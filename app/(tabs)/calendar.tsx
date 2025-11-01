import CalendarDayInfo from '@/components/calendar/CalendarDayInfo';
import CalendarView from '@/components/calendar/CalendarView';
import TitleText from '@/components/common/TitleText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEventsStore } from '@/stores/useEventStore';
import {
    calculateEventsForCurrentMonth,
} from '@/utils/scheduleHandler';
import Entypo from '@expo/vector-icons/Entypo';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export default function CalendarScreen() {
    const { events } = useEventsStore();
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
    const [selectedDateEvents, setSelectedDateEvents] = useState(
        calculateEventsForCurrentMonth(events).filter(
            (eventDates) =>
                eventDates.date === moment(selectedDate).format('YYYY-MM-DD')
        )
    );
    const monthlyEvents = calculateEventsForCurrentMonth(events)

    const [month, setMonth] = useState(moment().format('MMMM YYYY'));
    const backgroundColor = useThemeColor(
        { light: 'rgb(21, 23, 24)', dark: 'rgb(21, 23, 24)' },
        'background'
    );

    useEffect(() => {
        setSelectedDateEvents(
            calculateEventsForCurrentMonth(events).filter(
                (eventDates) =>
                    eventDates.date ===
                    moment(selectedDate).format('YYYY-MM-DD')
            )
        );
    }, [selectedDate, events]);


    return (
        <ScrollView className="flex-1 bg-secondary">
            <ThemedView className="min-h-screen h-full w-full px-4 pb-32">
                <View className="flex flex-row items-center justify-between mt-12 pl-4">
                    <TitleText className="font-bold text-3xl " title={month} />
                    <TouchableOpacity>
                        <Entypo
                            name="chevron-right"
                            size={40}
                            color="#FF6B00"
                        />
                    </TouchableOpacity>
                </View>
                <CalendarView
                    eventDates={monthlyEvents}
                    calendarBg={backgroundColor}
                    updateSelectedDate={setSelectedDate}
                />
                <CalendarDayInfo
                    date={selectedDate}
                    eventDates={selectedDateEvents}
                />
            </ThemedView>
        </ScrollView>
    );
}
