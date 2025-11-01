import CurrentGoals from '@/components/index/CurrentGoals';
import NextEvents from '@/components/index/NextEvents';
import TodaysFocus from '@/components/index/TodaysFocus';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useEventsStore } from '@/stores/useEventStore';
import { useGoalsStore } from '@/stores/useGoalStore';
import { calculateEventsForCurrentMonth } from '@/utils/scheduleHandler';
import moment from 'moment';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {
    const { events } = useEventsStore();
    const { goals } = useGoalsStore();
    const monthlyEvents = calculateEventsForCurrentMonth(events);

    const todaysEvents = useMemo(() => {
        const eventIDs = monthlyEvents
            .filter(
                (dateEvent) => dateEvent.date === moment().format('YYYY-MM-DD')
            )
            .map((fEventDates) => fEventDates.eventID);
        return events.filter((event) => eventIDs.includes(event.id));
    }, [events]);

    const upcomingEvents = useMemo(() => {
        const repeatingEventIDs = events.map((event) => event.id);
        const upcomingEvents = [];
        repeatingEventIDs;
        for (const eventID of repeatingEventIDs) {
            const latestEvent = monthlyEvents.find(
                (event) =>
                    moment(event.date).isAfter(moment().format('YYYY-MM-DD')) &&
                    event.eventID === eventID
            );
            if (latestEvent) {
                upcomingEvents.push({
                    ...latestEvent,
                    event: events.find(
                        (event) => event.id === latestEvent.eventID
                    ),
                });
            }
        }
        return upcomingEvents;
    }, [events]);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#000 ', dark: '#000 ' }}
            headerContent={
                <View className="flex flex-col items-center px-4 pb-6 pt-4 h-full">
                    <Text
                        style={{
                            fontSize: 28,
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}
                        className="text-lg font-bold font-satoshi text-white"
                    >
                        Trendsetter
                    </Text>
                    {/* @todo set this to be motivation quote api */}
                    <Text className="text-white font-satoshi_italic font-semibold mt-4 text-center mx-8">
                        “You cannot open your third eye if your first two are
                        still blinking” - Jakeb
                    </Text>
                </View>
            }
        >
            <View
                style={{ borderTopEndRadius: 32, borderTopStartRadius: 32 }}
                className="bg-[#0F0F0F] min-h-screen h-full rounded-t-xl px-4"
            >
                <TodaysFocus todaysEvents={todaysEvents} />
                <CurrentGoals goals={goals} />
                {Object.keys(upcomingEvents).length > 0 && (
                    <Text className="text-white font-semibold text-lg ml-1">
                        Upcoming Events
                    </Text>
                )}
                {upcomingEvents.map((event, index) => (
                    <NextEvents
                        key={index}
                        date={new Date(event.date)}
                        //@ts-ignore
                        event={event.event}
                    />
                ))}
            </View>
        </ParallaxScrollView>
    );
}
