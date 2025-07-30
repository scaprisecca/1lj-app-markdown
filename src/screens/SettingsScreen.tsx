import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { AppSettings } from '@app-types/models';
import { Colors } from '../../constants/Colors';
import * as DocumentPicker from 'expo-document-picker';
import * as Notifications from 'expo-notifications';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const APP_SETTINGS_KEY = 'appSettings';
const DEFAULT_JOURNAL_PATH = FileSystem.documentDirectory + 'journal.md';

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Configure default notification channel for Android (optional, but good practice)
  useEffect(() => {
    Notifications.setNotificationChannelAsync('default', {
      name: 'Default', // Changed from 'default' to 'Default' for clarity
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }, []);

  const defaultSettings = React.useMemo((): AppSettings => ({
    journalFilePath: DEFAULT_JOURNAL_PATH,
    notificationsEnabled: false,
    notificationTime: '09:00', // Default notification time
  }), []);

  // Notification permission and scheduling functions
  const requestPermissionsAsync = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Cannot schedule notifications without permission.');
      return false;
    }
    return true;
  }, []);

  const cancelAllReminders = useCallback(async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    // console.log('All reminders cancelled');
  }, []);

  const scheduleDailyReminder = useCallback(async (time: string) => {
    const hasPermission = await requestPermissionsAsync();
    if (!hasPermission) return;

    await cancelAllReminders(); // Cancel any existing before scheduling a new one

    const [hours, minutes] = time.split(':').map(Number);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time for your daily journal&apos;!",
          body: 'Open the app to write down your thoughts and experiences.',
          sound: true, // Plays the default notification sound
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
          channelId: 'default', // Explicitly use the configured channel
        },
      });
      // console.log(`Daily reminder scheduled for ${time}`);
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      Alert.alert('Scheduling Error', 'Could not schedule the daily reminder.');
    }
  }, [requestPermissionsAsync, cancelAllReminders]);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const storedSettings = await AsyncStorage.getItem(APP_SETTINGS_KEY);
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        Alert.alert('Error', 'Could not load settings. Using defaults.');
        setSettings(defaultSettings);
      }
      setIsLoading(false);
    };
    loadSettings();
  }, [defaultSettings]);

  // Save settings
  const saveSettings = useCallback(async (updatedSettings: AppSettings) => {
    if (!settings) return; // Guard against settings not being loaded yet

    const oldNotificationsEnabled = settings.notificationsEnabled;
    const oldNotificationTime = settings.notificationTime;

    try {
      await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(updatedSettings));
      setSettings(updatedSettings); // Update local state

      const newNotificationsEnabled = updatedSettings.notificationsEnabled;
      const newNotificationTime = updatedSettings.notificationTime;

      if (newNotificationsEnabled && !oldNotificationsEnabled) {
        // Case 1: Notifications were turned ON
        // console.log('Notifications turned ON, scheduling reminder for:', newNotificationTime);
        await scheduleDailyReminder(newNotificationTime);
      } else if (!newNotificationsEnabled && oldNotificationsEnabled) {
        // Case 2: Notifications were turned OFF
        // console.log('Notifications turned OFF, cancelling reminders.');
        await cancelAllReminders();
      } else if (newNotificationsEnabled && newNotificationTime !== oldNotificationTime) {
        // Case 3: Notifications are ON and time changed
        // console.log('Notification time changed to:', newNotificationTime, ' rescheduling reminder.');
        await scheduleDailyReminder(newNotificationTime);
      }
      // Note: If notifications were already on and time didn't change, or were already off, no action needed.

    } catch (error) {
      console.error('Failed to save settings or update notification:', error);
      Alert.alert('Error', 'Failed to save settings or update notification schedule.');
    }
  }, [settings, scheduleDailyReminder, cancelAllReminders]);

  const handleSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    if (settings) {
      const newSettings = { ...settings, [key]: value };
      saveSettings(newSettings);
    }
  };

  const handleChangeFileLocation = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/markdown', // Encourage picking markdown files
        copyToCacheDirectory: false, // Use the original file URI
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFileUri = result.assets[0].uri;
        // Basic validation: check if we can get info about the URI (optional, but good practice)
        try {
            const fileInfo = await FileSystem.getInfoAsync(selectedFileUri);
            if (!fileInfo.exists || fileInfo.isDirectory) {
                Alert.alert('Invalid File', 'The selected path is not a valid file or is not accessible.');
                return;
            }
        } catch (infoError) {
            console.warn('Could not get info for selected file URI:', infoError);
            // Proceeding anyway, but this might indicate a non-standard URI or permission issue later
        }

        handleSettingChange('journalFilePath', selectedFileUri);
        Alert.alert('File Selected', `Journal file path set to: ${result.assets[0].name || selectedFileUri}`);
      } else {
        console.log('Document picker cancelled or no asset selected.');
        // Optionally, provide feedback to the user if it was cancelled
        // if (result.canceled) Alert.alert('Cancelled', 'File selection was cancelled.');
      }
    } catch (error: any) {
      console.error('Error picking document:', error);
      Alert.alert('Error', `Could not select file: ${error.message || 'Unknown error'}`);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios'); // On iOS, picker might stay open until user confirms
    if (event.type === 'set' && selectedDate && settings) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      handleSettingChange('notificationTime', `${hours}:${minutes}`);
    }
    // For Android, hiding picker is usually done immediately after event
    if (Platform.OS === 'android') {
        setShowTimePicker(false);
    }
  };
  
  // const [showTimePicker, setShowTimePicker] = useState(false); // For later

  if (isLoading || !settings) {
    return (
      <View style={styles.centered}><Text>Loading settings...</Text></View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* File Location Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>File Location</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Current Journal File:</Text>
          <Text style={styles.filePathText} numberOfLines={1} ellipsizeMode="middle">
            {settings.journalFilePath.replace(FileSystem.documentDirectory || '', 'docs://')}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleChangeFileLocation}>
          <Text style={styles.buttonText}>Change Journal File</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItemRow}>
          <Text style={styles.settingText}>Enable Daily Reminder</Text>
          <Switch
            trackColor={{ false: Colors.light.icon, true: Colors.light.tint }}
            thumbColor={settings.notificationsEnabled ? Colors.light.tint : Colors.light.card}
            ios_backgroundColor={Colors.light.icon}
            onValueChange={(value) => handleSettingChange('notificationsEnabled', value)}
            value={settings.notificationsEnabled}
          />
        </View>
        {settings.notificationsEnabled && (
          <View style={styles.settingItemRow}>
            <Text style={styles.settingText}>Reminder Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.timeText}>{settings.notificationTime}</Text>
            </TouchableOpacity>
          </View>
        )}
        {showTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(`2000-01-01T${settings.notificationTime}:00`)} // Dummy date, only time matters
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </View>

      {/* Add more settings sections as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
  },
  settingItem: {
    marginBottom: 15,
  },
  settingItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.background,
  },
  settingText: {
    fontSize: 16,
    color: Colors.light.text,
    flexShrink: 1,
  },
  filePathText: {
    fontSize: 14,
    color: Colors.light.icon,
    fontStyle: 'italic',
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.dark.text, // Contrast
    fontSize: 16,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '600',
  },
});

export default SettingsScreen;
