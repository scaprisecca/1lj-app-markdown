# 1 Line Journal (1LJ) - Product Requirements Document

## 1. Overview

### 1.1 Product Vision
The 1 Line Journal (1LJ) is a minimalist daily journaling mobile application that encourages consistent, concise daily reflection through single-line entries. The app focuses on simplicity and historical perspective by showing "this day in the past" entries.

### 1.2 Technical Stack
- **Framework**: Expo (React Native)
- **Target Platform**: Android (MVP)
- **Development Language**: JavaScript/TypeScript
- **Storage**: Local device storage (AsyncStorage/FileSystem)
- **File Format**: Markdown (.md)

### 1.3 Success Metrics
- Daily active users maintaining consistent journaling habits
- User retention beyond 30 days
- Average entries per user per week

## 2. Technical Architecture

### 2.2 Data Models

#### Journal Entry
```typescript
interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  dayAbbrev: string; // m, t, w, h, f, s, x
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### App Settings
```typescript
interface AppSettings {
  notificationsEnabled: boolean;
  notificationTime: string; // HH:MM format
  journalFilePath: string;
}
```

### 2.3 Day Abbreviation Mapping
```typescript
const DAY_ABBREVIATIONS = {
  Monday: 'm',
  Tuesday: 't',
  Wednesday: 'w',
  Thursday: 'h',
  Friday: 'f',
  Saturday: 's',
  Sunday: 'x'
};
```

## 3. Feature Requirements

### 3.1 Navigation System

#### 3.1.1 Header Navigation
**Components**: 
- Logo/Title: "1 Line Journal" (left-aligned)
- Calendar Icon (right-aligned)

**Calendar Functionality**:
- Opens modal overlay with month/year navigation
- Highlights dates with existing entries
- Clicking date navigates to entry view or shows "Add Entry" button
- Previous month/year navigation capability

#### 3.1.2 Footer Navigation
**Fixed bottom navigation with 4 tabs**:
- Home (house icon) - HomeScreen
- Add Entry (+ icon) - AddEntryScreen  
- View Log (list icon) - ViewLogScreen
- Settings (gear icon) - SettingsScreen

**Technical Implementation**:
- Use React Navigation bottom tabs
- Icons from react-native-vector-icons or Expo icons
- Active state styling

### 3.2 Home Screen

#### 3.2.1 Layout Structure
1. **Today's Date Display**: Large, prominent date format
2. **Add Today's Note Button**: Primary CTA button
3. **"This Day in the Past" Section**: 
   - Heading
   - Scrollable list of historical entries for current date
   - Empty state when no historical entries exist

#### 3.2.2 Technical Requirements
- Calculate and display current date in readable format
- Query historical entries matching current month/day across different years
- Implement loading states for data fetching
- Handle empty states gracefully

### 3.3 Add Entry Screen

#### 3.3.1 Functionality
- **Auto-populated date prefix**: `YYYY-MM-DD {day_abbrev} |`
- **Text input field**: Multi-line text input for journal entry
- **Save functionality**: Append to markdown file
- **Validation**: Ensure entry content is not empty

#### 3.3.2 Entry Format
```
2025-05-25 x | This is my journal entry for today
```

#### 3.3.3 Technical Implementation
- Use TextInput component with multiline support
- Implement auto-save or manual save button
- File append operation using Expo FileSystem
- Navigation back to Home after successful save

### 3.4 View Log Screen

#### 3.4.1 Display Requirements
- **Full journal view**: Display entire markdown file content
- **Chronological order**: Most recent entries first
- **Scrollable interface**: Handle large amounts of text
- **Search capability**: Find specific entries (future enhancement)

#### 3.4.2 Technical Implementation
- Read markdown file using Expo FileSystem
- Implement FlatList or ScrollView for performance
- Consider pagination for large files
- Markdown rendering (react-native-markdown-display)

### 3.5 Settings Screen

#### 3.5.1 Configuration Options
1. **File Location Settings**:
   - Display current file path
   - Option to change storage location
   - File picker integration

2. **Notification Settings**:
   - Toggle notifications on/off
   - Time picker for daily reminder
   - Notification permission handling

#### 3.5.2 Technical Implementation
- Use AsyncStorage for app settings
- Integrate Expo Notifications for reminder functionality
- Expo DocumentPicker for file location selection
- Form validation and error handling

## 4. Technical Implementation Details

### 4.1 Storage Strategy

#### 4.1.1 Journal Data Storage
- **Primary Storage**: Local markdown file
- **Location**: Expo FileSystem.documentDirectory
- **Backup Strategy**: Export functionality (future)
- **Format**: Plain text markdown with consistent formatting

#### 4.1.2 App Settings Storage
- **Method**: AsyncStorage
- **Keys**: 
  - `@1LJ:settings`
  - `@1LJ:notifications`

### 4.2 Date Handling

#### 4.2.1 Date Utilities
```typescript
// Core date functions needed
- getCurrentDate(): string // YYYY-MM-DD
- getDayAbbreviation(date: Date): string
- getHistoricalDates(monthDay: string): JournalEntry[]
- formatDisplayDate(date: string): string
```

### 4.3 File Operations

#### 4.3.1 Journal File Management
```typescript
// Required file operations
- appendEntry(entry: JournalEntry): Promise<void>
- readJournalFile(): Promise<string>
- getEntriesByDate(date: string): Promise<JournalEntry[]>
- exportJournal(): Promise<string> // future feature
```

### 4.4 Notification System

#### 4.4.1 Daily Reminders
- Use Expo Notifications
- Schedule daily recurring notifications
- Handle notification permissions
- Background notification handling

## 5. UI/UX Requirements

### 5.1 Design Principles
- **Minimalist**: Clean, uncluttered interface
- **Accessible**: Proper contrast ratios and text sizes
- **Responsive**: Adapt to different screen sizes
- **Intuitive**: Clear navigation and action buttons

### 5.2 Color Scheme
- Primary colors for branding consistency
- High contrast for readability
- Dark mode support (future enhancement)

### 5.3 Typography
- Readable font sizes (minimum 16px for body text)
- Clear hierarchy with headings
- Monospace font for journal entries to maintain formatting

## 6. Development Phases

### 6.1 Phase 1 (MVP)
- Basic navigation structure
- Home screen with today's date
- Add entry functionality
- Simple file storage
- View log screen

### 6.2 Phase 2
- Calendar integration
- Historical entries ("This day in the past")
- Settings screen
- Notification system

### 6.3 Phase 3 (Future Enhancements)
- Search functionality
- Export capabilities
- Cloud sync options
- Statistics and insights

## 7. Testing Requirements

### 7.1 Unit Testing
- Date utility functions
- File operations
- Data parsing and formatting

### 7.2 Integration Testing
- Navigation flow
- File read/write operations
- Notification scheduling

### 7.3 User Acceptance Testing
- Complete user journeys
- Edge cases (empty states, large files)
- Performance testing with large datasets

## 8. Deployment & Distribution

### 8.1 Build Configuration
- Expo managed workflow
- Android-specific configurations
- App signing and release builds

### 8.2 Performance Considerations
- File size optimization
- Memory usage for large journal files
- Startup time optimization
