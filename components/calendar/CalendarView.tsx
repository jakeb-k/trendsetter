import dayjs from 'dayjs';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CalendarDay from './CalendarDay';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CustomCalendarScreen({
    calendarBg,
}: {
    calendarBg?: string;
}) {
    const [currentDate, setCurrentDate] = useState(
        dayjs().format('YYYY-MM-DD')
    );

    const [viewDate, setViewDate] = useState({
        [dayjs().format('YYYY-MM-DD')]: {
            marked: true,
            dotColor: '#fff',
            selected: true,
            selectedColor: '#FF6B00',
        },
    });

    // the markedDates will be the dates that have the events on them. There should only be one highlighted one properly, and for this one it will be have the circle thign around it

    const changeMonth = (offset: any) => {
        const newDate = dayjs(currentDate).add(offset, 'month');
        setCurrentDate(newDate.format('YYYY-MM-DD'));
    };

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
                current={currentDate}
                hideArrows={true}
                renderHeader={() => null}
                hideExtraDays={true}
                hideDayNames={true}
                markedDates={viewDate}
                dayComponent={({ date, state }) => (
                    <CalendarDay
                        date={date}
                        state={state}
                        isSelected={viewDate === date.dateString}
                        onDayPress={(day) => {
                            setViewDate(day.dateString);
                        }}
                    />
                )}
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    monthText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 5,
    },
    weekText: {
        fontSize: 16,
        fontWeight: '500',
        width: 32,
        textAlign: 'center',
        color: '#000',
    },
});
