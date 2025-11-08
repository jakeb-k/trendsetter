import PrimaryButton from '@/components/common/PrimaryButton';
import ProgressWheel from '@/components/common/ProgressWheel';
import TitleText from '@/components/common/TitleText';
import NextEvents from '@/components/index/NextEvents';
import { ThemedView } from '@/components/ThemedView';
import { useEventsStore } from '@/stores/useEventStore';
import { useGoalsStore } from '@/stores/useGoalStore';
import Event from '@/types/models/Event';
import { calculateEventsForCurrentMonth } from '@/utils/scheduleHandler';
import { Entypo } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface UpcomingEvent {
    date: string;
    event: Event;
    eventID: number;
}

export default function GoalDetailLayout() {
    const { id } = useLocalSearchParams();
    const { goals } = useGoalsStore();
    const { events } = useEventsStore();
    const [loading, setLoading] = useState(false);

    const goal = goals.find((goal) => goal.id.toString() === id);

    const monthlyEvents = calculateEventsForCurrentMonth(events);

    const upcomingEvents = useMemo(() => {
        const goalEventIDs = events
            .filter((event) => event.goal_id == id)
            .map((event) => event.id);
        const upcomingEvents: UpcomingEvent[] = [];
        for (const eventID of goalEventIDs) {
            const latestEvents = monthlyEvents
                .filter(
                    (event) =>
                        moment(event.date).isAfter(
                            moment().format('YYYY-MM-DD')
                        ) && event.eventID === eventID
                )
                .slice(0, 3);

            if (latestEvents.length > 0) {
                latestEvents.forEach((latestEvent) => {
                    upcomingEvents.push({
                        ...latestEvent,
                        event: events.find(
                            (event) => event.id === latestEvent.eventID
                        )!,
                    });
                });
            }
        }
        return upcomingEvents;
    }, [events]);

    if (goal) {
        return (
            <ScrollView className="flex-1 bg-secondary">
                <ThemedView className="min-h-screen w-full px-8 overflow-y-scroll  pb-48">
                    {/* goal progres section */}
                    <View className="flex flex-col w-full mt-6">
                        <TouchableOpacity>
                            <Entypo
                                onPress={() => router.navigate('/')}
                                name="chevron-left"
                                size={32}
                                color="#FF6B00"
                                className="-ml-2"
                            />
                        </TouchableOpacity>
                        <TitleText
                            className="font-bold text-2xl mt-4"
                            title={goal.title}
                        />
                    </View>
                    <Text className="font-satoshi text-white/70 italic text-base">
                        {goal.description}
                    </Text>
                    <View className="my-8">
                        <ProgressWheel
                            size={150}
                            progress={0.65}
                            label="Towards Goal"
                        />
                    </View>
                    <PrimaryButton onPress={() => {}}>
                        <Text className="text-white text-center font-satoshi text-lg font-bold">
                            Complete Goal
                        </Text>
                    </PrimaryButton>
                    <View className="mt-6 h-fit pb-32">
                        <Text
                            className={`text-white text-lg font-satoshi font-bold ${
                                loading ? 'pb-32' : ''
                            }`}
                        >
                            History
                        </Text>
                        {loading ? (
                            <View className="w-full flex flex-col items-center justify-center h-full pt-24">
                                <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </View>
                        ) : (
                            <>
                                {/* {eventFeedback.map((eventFeedbackItem) => (
                                    <EventFeedbackInfo
                                        key={eventFeedbackItem.id}
                                        {...eventFeedbackItem}
                                    />
                                ))} */}
                            </>
                        )}
                    </View>
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
                </ThemedView>
            </ScrollView>
        );
    }
}
