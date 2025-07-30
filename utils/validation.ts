import { z } from 'zod';
import { DayAbbreviation, DAY_ABBREVIATIONS, JournalEntry, AppSettings } from '../types/models';

// Helper functions for common validations
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const isValidTime = (timeString: string): boolean => {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString);
};

// Schema for DayAbbreviation
export const dayAbbreviationSchema = z.custom<DayAbbreviation>(
  (val: unknown) => Object.values(DAY_ABBREVIATIONS).includes(val as DayAbbreviation),
  {
    message: 'Invalid day abbreviation',
  }
);

// Schema for JournalEntry
export const journalEntrySchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((val: string) => {
      if (!isValidDate(val)) return false;
      const [year, month, day] = val.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && 
             date.getMonth() === month - 1 && 
             date.getDate() === day;
    }, 'Invalid date'),
  dayAbbrev: dayAbbreviationSchema,
  content: z.string().min(1, 'Content cannot be empty'),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

// Schema for creating a new journal entry (omits auto-generated fields)
export const newJournalEntrySchema = journalEntrySchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  id: z.string().uuid('Invalid UUID format').optional(),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});

// Schema for updating a journal entry
export const updateJournalEntrySchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  content: z.string().min(1, 'Content cannot be empty').optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});

// Schema for AppSettings
export const appSettingsSchema = z.object({
  notificationsEnabled: z.boolean(),
  notificationTime: z.string()
    .refine(isValidTime, 'Time must be in HH:MM format'),
  journalFilePath: z.string().min(1, 'Journal file path is required'),
});

// Type guards
export function isValidJournalEntry(data: unknown): data is JournalEntry {
  return journalEntrySchema.safeParse(data).success;
}

export function isValidAppSettings(data: unknown): data is AppSettings {
  return appSettingsSchema.safeParse(data).success;
}

// Validation functions
export function validateJournalEntry(data: unknown): { success: boolean; error?: z.ZodError } {
  return journalEntrySchema.safeParse(data);
}

export function validateNewJournalEntry(data: unknown): { success: boolean; error?: z.ZodError } {
  return newJournalEntrySchema.safeParse(data);
}

export function validateAppSettings(data: unknown): { success: boolean; error?: z.ZodError } {
  return appSettingsSchema.safeParse(data);
}

// Extract TypeScript types from Zod schemas
export type ValidatedJournalEntry = z.infer<typeof journalEntrySchema>;
export type ValidatedNewJournalEntry = z.infer<typeof newJournalEntrySchema>;
export type ValidatedAppSettings = z.infer<typeof appSettingsSchema>;
