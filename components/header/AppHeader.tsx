import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { IconSymbol } from '../ui/IconSymbol';
import { useColorScheme } from '@hooks/useColorScheme';
import { Colors } from '@constants/Colors';

type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
};

type AppHeaderProps = {
  title?: string;
  onDateSelect?: (date: string) => void;
  markedDates?: MarkedDates;
};

export const AppHeader = ({ 
  title = '1 Line Journal',
  onDateSelect = () => {},
  markedDates = {}
}: AppHeaderProps) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    onDateSelect(day.dateString);
    setIsCalendarVisible(false);
  };

  // Mark today and any other dates with entries
  const allMarkedDates = {
    ...markedDates,
    [new Date().toISOString().split('T')[0]]: {
      ...markedDates[new Date().toISOString().split('T')[0]],
      dotColor: colors.tint,
      selected: new Date().toISOString().split('T')[0] === selectedDate,
    },
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      
      <TouchableOpacity 
        onPress={() => setIsCalendarVisible(true)}
        style={styles.calendarButton}
      >
        <IconSymbol name="calendar" size={24} color={colors.tint} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Calendar
              current={selectedDate}
              onDayPress={handleDayPress}
              markedDates={allMarkedDates}
              theme={{
                backgroundColor: colors.background,
                calendarBackground: colors.background,
                textSectionTitleColor: colors.text,
                selectedDayBackgroundColor: colors.tint,
                selectedDayTextColor: colors.background,
                todayTextColor: colors.tint,
                dayTextColor: colors.text,
                textDisabledColor: `${colors.text}80`,
                dotColor: colors.tint,
                selectedDotColor: colors.background,
                arrowColor: colors.tint,
                monthTextColor: colors.text,
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: colors.tint }]}
              onPress={() => setIsCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  calendarButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
