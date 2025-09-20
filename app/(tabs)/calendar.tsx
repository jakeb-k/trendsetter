import CalendarDayInfo from '@/components/calendar/CalendarDayInfo';
import CalendarView from '@/components/calendar/CalendarView';
import TitleText from '@/components/common/TitleText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEventsStore } from '@/stores/useEventStore';
import {
    createDateArrayForCurrentMonth,
    setDateEvents,
} from '@/utils/scheduleHandler';
import Entypo from '@expo/vector-icons/Entypo';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function CalendarScreen() {
    const { events } = useEventsStore();
    // const [currentEvents, setCurrentEvents] = useState([]); 
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
    const [selectedDateEvents, setSelectedDateEvents] = useState(
        setDateEvents(events || [], selectedDate)
    );

    const [month, setMonth] = useState(moment().format('MMMM YYYY'));
    const backgroundColor = useThemeColor(
        { light: 'rgb(21, 23, 24)', dark: 'rgb(21, 23, 24)' },
        'background'
    );

    const [eventDates, setEventDates] = useState<string[]>(
        createDateArrayForCurrentMonth(month, events || [])
    );

    useEffect(() => {
        setSelectedDateEvents(setDateEvents(events || [], selectedDate));
    }, [selectedDate, events]);

    // useEffect(() => {
    //     setCurrentEvents((events: any) => {
    //         return events.filter((event: Event) => event. )
    //     })
    // }, [events])

    return (
        <ThemedView className="min-h-screen w-full px-4">
            <View className="flex flex-row items-center justify-between mt-12 pl-4">
                <TitleText className="font-bold text-3xl " title={month} />
                <TouchableOpacity>
                    <Entypo name="chevron-right" size={40} color="#FF6B00" />
                </TouchableOpacity>
            </View>
            <CalendarView
                eventDates={eventDates}
                calendarBg={backgroundColor}
                updateSelectedDate={setSelectedDate}
            />
            <CalendarDayInfo date={selectedDate} events={selectedDateEvents} />
        </ThemedView>
    );
}
