import type { EventDate } from '@/types/models/Event';
import moment from 'moment';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CalendarDay from './CalendarDay';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CustomCalendarScreen({
    calendarBg,
    eventDates,
    currentDate,
    updateSelectedDate, 
}: {
    calendarBg?: string;
    eventDates?: EventDate[]; 
    currentDate: string; 
    updateSelectedDate?: (date: string) => void;
}) {

    const [viewDate, setViewDate] = useState({
        [moment().format('YYYY-MM-DD')]: {
            marked: true,
            dotColor: '#fff',
            selected: true,
            selectedColor: '#FF6B00',
        },
    });

    // the markedDates will be the dates that have the events on them. There should only be one highlighted one properly, and for this one it will be have the circle thign around it

    return (
        <View className="background-black">
            <View className="flex flex-row justify-between ">
                {WEEKDAYS.map((d, i) => (
                    <Text
                        key={i}
                        className="text-lg font-semibold font-satoshi text-center w-full text-primary"
                    >
                        {d}
                    </Text>
                ))}
            </View>

            {/* Calendar */}
            <Calendar
                key={currentDate}
                current={currentDate}
                hideArrows={true}
                renderHeader={() => null}
                hideExtraDays={true}
                hideDayNames={true}
                markedDates={viewDate}
                //@todo make this work for swipe
                onMonthChange={(date) => console.log(date)}
                enableSwipeMonths
                dayComponent={({ date, state }) =>{
                    //@ts-ignore
                    const eventCount = eventDates?.filter((eventDate) => eventDate.date === moment(date.dateString).format('YYYY-MM-DD')).length || 0;
                    return (
                    <CalendarDay
                        date={date}
                        state={state}
                        eventCount={eventCount}
                        // @ts-ignore
                        isSelected={viewDate === date.dateString}
                        onDayPress={(day) => {
                            setViewDate(day.dateString);
                            updateSelectedDate?.(day.dateString);
                        }}
                    />
                )}}
                theme={{
                    calendarBackground: calendarBg,
                    backgroundColor: calendarBg,
                    textDayFontWeight: '400',
                    textDayStyle: {
                        borderRadius: 16,
                        borderBlockColor: '#FF6B00',
                        borderStyle: 'solid',
                    },
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                }}
            />
        </View>
    );
}