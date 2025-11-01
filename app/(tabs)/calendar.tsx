import CalendarDayInfo from '@/components/calendar/CalendarDayInfo';
import CalendarView from '@/components/calendar/CalendarView';
import TitleText from '@/components/common/TitleText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEventsStore } from '@/stores/useEventStore';
import { calculateEventsForCurrentMonth } from '@/utils/scheduleHandler';
import Entypo from '@expo/vector-icons/Entypo';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export default function CalendarScreen() {
    const { events } = useEventsStore();
    const [currentDate, setCurrentDate] = useState(
        moment().format('YYYY-MM-DD')
    );
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
    const [monthlyEvents, setMonthlyEvents] = useState(
        calculateEventsForCurrentMonth(events, currentDate)
    );
    const [selectedDateEvents, setSelectedDateEvents] = useState(
        monthlyEvents.filter(
            (eventDates) =>
                eventDates.date === moment(selectedDate).format('YYYY-MM-DD')
        )
    );

    const backgroundColor = useThemeColor(
        { light: 'rgb(21, 23, 24)', dark: 'rgb(21, 23, 24)' },
        'background'
    );

    useEffect(() => {
        setSelectedDateEvents(
            calculateEventsForCurrentMonth(events, currentDate).filter(
                (eventDates) =>
                    eventDates.date ===
                    moment(selectedDate).format('YYYY-MM-DD')
            )
        );
    }, [selectedDate, events]);

    const changeMonth = (offset: any) => {
        const newDate = moment(currentDate).add(offset, 'month');
        setCurrentDate(newDate.format('YYYY-MM-DD'));
        setMonthlyEvents(
            calculateEventsForCurrentMonth(events, newDate.format('YYYY-MM-DD'))
        );
    };

    return (
        <ScrollView className="flex-1 bg-secondary">
            <ThemedView className="min-h-screen h-full w-full px-4 pb-32">
                <View className="flex flex-row items-center justify-between mt-12 pl-4">
                    <TitleText
                        className="font-bold text-3xl "
                        title={moment(currentDate).format('MMMM YYYY')}
                    />
                    <View className='flex flex-row justify-between space-x-6'>
                        <TouchableOpacity onPress={() => changeMonth(-1)}>
                            <Entypo
                                name="chevron-left"
                                size={40}
                                color="#FF6B00"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeMonth(1)}>
                            <Entypo
                                name="chevron-right"
                                size={40}
                                color="#FF6B00"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <CalendarView
                    eventDates={monthlyEvents}
                    calendarBg={backgroundColor}
                    currentDate={currentDate}
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
