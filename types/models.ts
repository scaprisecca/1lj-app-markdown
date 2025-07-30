// Day of week abbreviations
export type DayAbbreviation = 'm' | 't' | 'w' | 'h' | 'f' | 's' | 'x';

export const DAY_ABBREVIATIONS: Record<string, DayAbbreviation> = {
  Monday: 'm',
  Tuesday: 't',
  Wednesday: 'w',
  Thursday: 'h',
  Friday: 'f',
  Saturday: 's',
  Sunday: 'x'
} as const;

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  dayAbbrev: DayAbbreviation;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface AppSettings {
  notificationsEnabled: boolean;
  notificationTime: string; // HH:MM format
  journalFilePath: string;
}

// Helper type for creating new journal entries
export type NewJournalEntry = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Type for updating journal entries
export type UpdateJournalEntry = Partial<Omit<JournalEntry, 'id' | 'date' | 'dayAbbrev'>> & {
  id: string;
};
