# 1LJ Only App

The '1LJ App' is a Expo app that is used for a daily journal app. Each day, the current date is added in the YYYY-MM-DD format followed by a single letter abbreviation for the day. The day abbreviations are as follows:

Mon = m
Tue = t
Wed = w
Thur = h
Fri = f
Sat = s
Sun = x

## Navigation

There is a footer navigation that has buttons to navigate to the different views in the application. The buttons are:

Home: A house icon that takes you to this home screen
Add entry: A "+" icon that links to the "Add today's note" screen so you can entry the journal entry for today
View Log: A list icon that will take you to a new screen to view all journal entries in order
Settings: A gear icon that takes you to the settings screen

There is a header navigation that has two section:

Left section: logo, which just says 1 Line Journal 
Right section: A calendar icon, that when clicked opens up a calendar view of the current month with the ability to navigate to previous months/years. Click on a specific date will show the journal entry for that date

if there is no journal entry for that day, then there is a button Add Entry that will allow you to add an entry for that day. This is useful in case you miss a day and need to go back to add an entry

## Home Screen

This is the default screen when you first open the app. The top of the screens shows today's date, then it has a button to 'Add today's note'. 

Under that is a heading that says "This day in the past" and it shows other entries from that day in past years. So for example if today is 2025-05-25, then this section would show what I entered in the app on May 25th in 2024, 2023, 2022, etc. 

The bottom of the screen is a mobile navigation section with a few buttons to view different screens. The buttons are: 

Home: A house icon that takes you to this home screen
Add entry: A "+" icon that links to the "Add today's note" screen so you can entry the journal entry for today
View Log: A list icon that will take you to a new screen to view all journal entries in order
Settings: A gear icon that takes you to the settings screen

## Add Entry Screen

Has a text box to add you entry for the day
The day's date is automatically added to the front of the note to match this format 2025-05-25 x | this is a note entry
The entry is appended to the bottom of the markdown file 

## View Log Screen

this is a view of the note file, showing all entries in your journal

## Settings Screen

Set the location of the note file used for the 1LJ, this is a local file on the device 
Able to enable/disable notifications as a reminder to add your journal entry for the day. You can set a specific time that you would like to be notified