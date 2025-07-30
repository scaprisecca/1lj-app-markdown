import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import * as FileSystem from 'expo-file-system';
import Markdown from 'react-native-markdown-display';

const JOURNAL_FILE_URI = FileSystem.documentDirectory + 'journal.md';

const ViewLogScreen: React.FC = () => {
  const [logContent, setLogContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogContent = React.useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fileInfo = await FileSystem.getInfoAsync(JOURNAL_FILE_URI);
        if (fileInfo.exists && !fileInfo.isDirectory) {
          const content = await FileSystem.readAsStringAsync(JOURNAL_FILE_URI, {
            encoding: FileSystem.EncodingType.UTF8,
          });
          setLogContent(content);
        } else {
          // If file doesn't exist, it's not an error, just an empty journal for now.
          // We could create it here if desired, or let the AddEntryScreen handle creation.
          setLogContent(''); 
        }
      } catch (e: any) {
        console.error('Failed to load journal log:', e);
        setError(`Failed to load journal: ${e.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }, []); // Empty dependency array for useCallback as it doesn't depend on props/state from this component

  useEffect(() => {
    fetchLogContent();
  }, [fetchLogContent]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Loading Journal...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLogContent}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal Log</Text>
      <ScrollView style={styles.scrollView}>
        {logContent.trim() === '' ? (
          <Text style={styles.emptyLogText}>Your journal is empty. Start writing!</Text>
        ) : (
          <Markdown style={markdownStyles}>{logContent}</Markdown>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  errorText: {
    fontSize: 16,
    color: 'red', // Consider using a color from Colors.ts for errors
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 15,
  },
  logText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  emptyLogText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
    marginTop: 50,
  },
});

const markdownStyles = StyleSheet.create({
  heading1: {
    color: Colors.light.tint,
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: Colors.light.icon,
    paddingBottom: 5,
  },
  heading2: {
    color: Colors.light.text,
    marginTop: 10,
    marginBottom: 8,
  },
  body: {
    color: Colors.light.text,
    fontSize: 16,
    lineHeight: 24,
  },
  hr: {
    backgroundColor: Colors.light.icon,
    height: 1,
    marginVertical: 10,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet_list_icon: {
    color: Colors.light.text,
    fontSize: 16, // Adjust size as needed
    marginRight: 8,
    lineHeight: 24, // Match body lineHeight
  },
  ordered_list_icon: {
    color: Colors.light.text,
    fontSize: 16, // Adjust size as needed
    marginRight: 8,
    lineHeight: 24, // Match body lineHeight
  },
});

export default ViewLogScreen;
