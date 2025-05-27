import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as FileSystem from 'expo-file-system';
import { Colors } from '../../constants/Colors';
import { JournalEntry, DayAbbreviation } from '../types/models';

// Using JournalEntry from '../types/models' instead of local HistoricalEntry interface

const JOURNAL_FILE_URI = FileSystem.documentDirectory + 'journal.md';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>(); // Use 'any' for now, or define your StackParamList
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [historicalEntries, setHistoricalEntries] = React.useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchHistoricalEntries = async () => {
      setIsLoading(true);
      try {
        const fileInfo = await FileSystem.getInfoAsync(JOURNAL_FILE_URI);
        if (!fileInfo.exists || fileInfo.isDirectory) {
          setHistoricalEntries([]);
          setIsLoading(false);
          return;
        }

        const fileContent = await FileSystem.readAsStringAsync(JOURNAL_FILE_URI, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (!fileContent.trim()) {
          setHistoricalEntries([]);
          setIsLoading(false);
          return;
        }

        const entries = fileContent.split('\n\n');
        const currentMonth = currentDate.getMonth(); // 0-indexed
        const currentDayOfMonth = currentDate.getDate(); // 1-indexed
        const currentYear = currentDate.getFullYear();

        const relevantEntries: JournalEntry[] = [];

        for (const entryBlock of entries) {
          if (!entryBlock.trim()) continue;

          const parts = entryBlock.split(' | ');
          if (parts.length < 2) continue; // Malformed entry

          const dateAndAbbrevPart = parts[0].trim().split(' ');
          if (dateAndAbbrevPart.length < 2) continue; // Malformed date part

          const entryDateStr = dateAndAbbrevPart[0];
          const entryDayAbbrev = dateAndAbbrevPart[1] as DayAbbreviation;
          const entryContent = parts.slice(1).join(' | ').trim();

          // Parse entryDateStr (e.g., "2023-05-26")
          const [yearStr, monthStr, dayStr] = entryDateStr.split('-');
          const entryYear = parseInt(yearStr, 10);
          const entryMonth = parseInt(monthStr, 10) - 1; // JS months are 0-indexed
          const entryDayOfMonth = parseInt(dayStr, 10);

          if (
            entryYear < currentYear &&
            entryMonth === currentMonth &&
            entryDayOfMonth === currentDayOfMonth
          ) {
            const entryDateObject = new Date(entryYear, entryMonth, entryDayOfMonth);
            relevantEntries.push({
              id: entryDateStr, // Use date string as a unique ID for the entry
              date: entryDateStr,
              dayAbbrev: entryDayAbbrev,
              content: entryContent,
              createdAt: entryDateObject.toISOString(), // Placeholder
              updatedAt: entryDateObject.toISOString(), // Placeholder
            });
          }
        }
        setHistoricalEntries(relevantEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); // Show newest first
      } catch (error) {
        console.error('Failed to load historical entries:', error);
        setHistoricalEntries([]); // Set to empty on error
      }
      setIsLoading(false);
    };

    fetchHistoricalEntries();
  }, [currentDate]); // Rerun if currentDate changes (though it's stable after init here)

  const formattedDate = (): string => {
    return currentDate.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleAddTodaysNote = () => {
    navigation.navigate('AddEntryScreen');
  };

  const handleViewLog = () => {
    navigation.navigate('ViewLogScreen');
  };

  return (
    <View style={styles.container}>
      {/* 1. Today's Date Display */}
      <Text style={styles.dateDisplay}>{formattedDate()}</Text>

      {/* 2. Add Today's Note Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTodaysNote}>
        <Text style={styles.addButtonText}>Add Today's Note</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.viewLogButton} onPress={handleViewLog}>
        <Text style={styles.viewLogButtonText}>View Full Log</Text>
      </TouchableOpacity>

      {/* 3. "This Day in the Past" Section */}
      <View style={styles.historicalSection}>
        <Text style={styles.historicalSectionTitle}>This Day in the Past</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading historical entries...</Text>
        ) : historicalEntries.length > 0 ? (
          <ScrollView style={styles.historicalList}>
            {historicalEntries.map(entry => (
              <View key={entry.id} style={styles.historicalEntryItem}>
                <Text style={styles.historicalEntryDateText}>{entry.date} ({entry.dayAbbrev})</Text>
                <Text style={styles.historicalEntryContentText}>{entry.content}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyStateText}>No entries from this day in the past.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  dateDisplay: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.light.text,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: Colors.dark.text, // Using dark theme's text color for contrast on light.tint
    fontSize: 18,
    fontWeight: '600',
  },
  viewLogButton: {
    backgroundColor: Colors.light.card, // A more subtle background
    borderColor: Colors.light.tint,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30, // Keep same margin as addButton or adjust as needed
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.84,
    elevation: 3,
  },
  viewLogButtonText: {
    color: Colors.light.tint,
    fontSize: 17,
    fontWeight: '600',
  },
  historicalSection: {
    flex: 1,
  },
  historicalSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.light.text,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.light.icon,
  },
  historicalList: {
    flex: 1,
  },
  historicalEntryItem: {
    backgroundColor: Colors.light.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historicalEntryDateText: { // For displaying "YYYY-MM-DD (d)"
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 5,
    fontWeight: '600',
  },
  historicalEntryContentText: { // For displaying entry.content
    fontSize: 16,
    color: Colors.light.text,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.light.icon,
  },
});

export default HomeScreen;
