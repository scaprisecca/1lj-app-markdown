import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import { DAY_ABBREVIATIONS, DayAbbreviation } from '@app-types/models';

// Helper to get day abbreviation
const getDayAbbreviation = (date: Date): DayAbbreviation => {
  const dayIndex = date.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
  return DAY_ABBREVIATIONS[dayName] || 'x'; // Default to 'x' if somehow not found
};

const JOURNAL_FILE_URI = FileSystem.documentDirectory + 'journal.md';

const AddEntryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [entryContent, setEntryContent] = useState('');

  const currentDate = useMemo(() => new Date(), []);
  const formattedDatePrefix = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dayAbbrev = getDayAbbreviation(currentDate);
    return `${year}-${month}-${day} ${dayAbbrev} | `;
  }, [currentDate]);

  const handleSaveEntry = async () => {
    if (entryContent.trim() === '') {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    const entryToSave = `${formattedDatePrefix}${entryContent.trim()}`;

    try {
      let existingContent = '';
      const fileInfo = await FileSystem.getInfoAsync(JOURNAL_FILE_URI);

      if (fileInfo.exists && !fileInfo.isDirectory) {
        existingContent = await FileSystem.readAsStringAsync(JOURNAL_FILE_URI, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }

      let contentToWrite = entryToSave;
      if (existingContent.trim().length > 0) {
        // File exists and is not empty, prepend newlines for separation
        contentToWrite = `${existingContent}\n\n${entryToSave}`;
      } else {
        // File does not exist or is empty (or only whitespace), write new entry directly
        contentToWrite = entryToSave;
      }

      await FileSystem.writeAsStringAsync(JOURNAL_FILE_URI, contentToWrite, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log('Entry saved to:', JOURNAL_FILE_URI);
      Alert.alert('Entry Saved', 'Your journal entry has been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);

    } catch (error: any) {
      console.error('Failed to save entry:', error);
      Alert.alert('Save Failed', `Could not save your entry: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.datePrefix}>{formattedDatePrefix}</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="What's on your mind?"
            placeholderTextColor={Colors.light.icon}
            value={entryContent}
            onChangeText={setEntryContent}
            autoFocus
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  datePrefix: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.icon,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    textAlignVertical: 'top', // For Android
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddEntryScreen;
