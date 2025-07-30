import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '@hooks/useTheme';

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dates = Array.from({ length: 31 }, (_, i) => i + 1);

export default function HomeScreen() {
  const { colors } = useTheme();
  const today = new Date().getDate();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Journal</Text>
        <View style={styles.dateContainer}>
          <Text style={[styles.date, { color: colors.text }]}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.weekDaysContainer}>
          {days.map((day, index) => (
            <Text key={index} style={[styles.weekDay, { color: colors.text }]}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.datesContainer}>
          {dates.map((date) => (
            <View 
              key={date} 
              style={[
                styles.dateBox, 
                date === today && { backgroundColor: colors.tint },
                date === today && styles.todayDateBox
              ]}
            >
              <Text 
                style={[
                  styles.dateText, 
                  { color: date === today ? '#fff' : colors.text },
                  date === today && styles.todayDateText
                ]}
              >
                {date}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.recentEntries}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Entries</Text>
        <View style={styles.entriesList}>
          <Text style={[styles.noEntries, { color: colors.text }]}>
            No entries yet. Tap the + button to add your first entry.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    opacity: 0.8,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.7,
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dateBox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 20,
  },
  todayDateBox: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  todayDateText: {
    fontWeight: 'bold',
  },
  recentEntries: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  entriesList: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  noEntries: {
    textAlign: 'center',
    opacity: 0.6,
  },
});
