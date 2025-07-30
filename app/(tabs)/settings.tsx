import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Notifications from 'expo-notifications';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useHeaderOptions } from '@hooks/useHeaderOptions';
import { useTheme } from '@hooks/useTheme';

type AppSettings = {
  journalFilePath: string;
  notificationsEnabled: boolean;
  notificationTime: string;
};

const APP_SETTINGS_KEY = 'appSettings';
const DEFAULT_JOURNAL_PATH = FileSystem.documentDirectory + 'journal.md';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Configure default notification channel for Android
  useEffect(() => {
    Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }, []);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const storedSettings = await AsyncStorage.getItem(APP_SETTINGS_KEY);
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        } else {
          setSettings({
            journalFilePath: DEFAULT_JOURNAL_PATH,
            notificationsEnabled: false,
            notificationTime: '09:00',
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        Alert.alert('Error', 'Failed to load settings. Using defaults.');
        setSettings({
          journalFilePath: DEFAULT_JOURNAL_PATH,
          notificationsEnabled: false,
          notificationTime: '09:00',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Set up header options
  useHeaderOptions({
    title: 'Settings',
  });

  // Notification functions
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
  }, []);

  const scheduleDailyReminder = useCallback(async (time: string) => {
    const hasPermission = await requestPermissionsAsync();
    if (!hasPermission) return;

    await cancelAllReminders();

    const [hours, minutes] = time.split(':').map(Number);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for your daily journal!',
          body: 'Open the app to write down your thoughts and experiences.',
          sound: true,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
          channelId: 'default',
        },
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      Alert.alert('Scheduling Error', 'Could not schedule the daily reminder.');
    }
  }, [requestPermissionsAsync, cancelAllReminders]);

  // Save settings
  const saveSettings = useCallback(async (updatedSettings: AppSettings) => {
    if (!settings) return;

    const oldNotificationsEnabled = settings.notificationsEnabled;
    const oldNotificationTime = settings.notificationTime;

    try {
      await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);

      const newNotificationsEnabled = updatedSettings.notificationsEnabled;
      const newNotificationTime = updatedSettings.notificationTime;

      if (newNotificationsEnabled && !oldNotificationsEnabled) {
        await scheduleDailyReminder(newNotificationTime);
      } else if (!newNotificationsEnabled && oldNotificationsEnabled) {
        await cancelAllReminders();
      } else if (newNotificationsEnabled && newNotificationTime !== oldNotificationTime) {
        await scheduleDailyReminder(newNotificationTime);
      }
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
        type: 'text/markdown',
        copyToCacheDirectory: false,
      });

      if (result.canceled) {
        return; // User cancelled the picker
      }

      if (result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        
        // Verify the file is accessible
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          throw new Error('Selected file is not accessible');
        }

        // Update settings with the new file path
        handleSettingChange('journalFilePath', fileUri);
        Alert.alert('Success', 'Journal file location updated successfully!');
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate && settings) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      handleSettingChange('notificationTime', `${hours}:${minutes}`);
    }
  };

  if (isLoading || !settings) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading settings...
        </Text>
      </View>
    );
  }

  // Parse the notification time for the time picker
  const [notificationHours, notificationMinutes] = settings.notificationTime.split(':').map(Number);
  const notificationDate = new Date();
  notificationDate.setHours(notificationHours, notificationMinutes);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Journal File Location Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Journal File</Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>File Location:</Text>
          <Text 
            style={[styles.settingValue, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {settings.journalFilePath}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={handleChangeFileLocation}
          >
            <Text style={styles.buttonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        
        {/* Enable Notifications Toggle */}
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Enable Daily Reminders</Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) => handleSettingChange('notificationsEnabled', value)}
            trackColor={{ false: '#767577', true: colors.tint }}
            thumbColor={settings.notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        {/* Reminder Time Picker */}
        <View style={[styles.settingItem, !settings.notificationsEnabled && styles.disabledSetting]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Reminder Time</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            disabled={!settings.notificationsEnabled}
          >
            <Text style={[styles.timeText, { color: settings.notificationsEnabled ? colors.text : '#888' }]}>
              {settings.notificationTime}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={notificationDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          themeVariant={colors.background === '#fff' ? 'light' : 'dark'}
          style={styles.timePicker}
        />
      )}

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <Text style={[styles.appInfo, { color: colors.text }]}>
          One Line a Day Journal
        </Text>
        <Text style={[styles.appVersion, { color: colors.text }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  disabledSetting: {
    opacity: 0.5,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    marginRight: 16,
  },
  settingValue: {
    flex: 1,
    fontSize: 14,
    opacity: 0.8,
    marginRight: 12,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    padding: 8,
    minWidth: 80,
    textAlign: 'right',
  },
  timePicker: {
    marginTop: 10,
    marginBottom: 20,
  },
  appInfo: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
