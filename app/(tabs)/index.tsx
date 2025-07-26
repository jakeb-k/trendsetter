import CurrentGoals from '@/components/index/CurrentGoals';
import NextEvents from '@/components/index/NextEvents';
import TodaysFocus from '@/components/index/TodaysFocus';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useEventsStore } from '@/stores/useEventStore';
import { useGoalsStore } from '@/stores/useGoalStore';
import { setDateEvents, setUpcomingEvents } from '@/utils/scheduleHandler';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {
    const { events } = useEventsStore();
    const { goals } = useGoalsStore();

    const todaysEvents = useMemo(() => {
        //@ts-ignore
        return setDateEvents(events || []);
    }, [events]);

    const upcomingEvents = useMemo(() => {
        //@ts-ignore
        return setUpcomingEvents(events);
    }, [events]);

    const groupedEvents = upcomingEvents.reduce((acc, event) => {
        const dateKey = new Date(event.upcomingDate).toDateString(); // to group by day
        if (!acc[dateKey]) acc[dateKey] = [];
        //@ts-ignore
        acc[dateKey].push(event);
        return acc;
    }, {} as Record<string, Event[]>);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#FFF9EC ', dark: '#FFF9EC ' }}
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
                className="bg-[#FEF3DA] min-h-screen h-full rounded-t-xl px-4"
            >
                <TodaysFocus todaysEvents={todaysEvents} />
                <CurrentGoals goals={goals} />
                <Text className="text-[#8B3C00] font-semibold text-lg ml-1">
                    Upcoming Events
                </Text>
                {Object.entries(groupedEvents)
                    .sort(
                        ([a], [b]) =>
                            new Date(a).getTime() - new Date(b).getTime()
                    )
                    .map(([date, events]) => (
                        <NextEvents
                            key={date}
                            date={new Date(date)}
                            //@ts-ignore
                            events={events}
                        />
                    ))}
            </View>
        </ParallaxScrollView>
    );
}
