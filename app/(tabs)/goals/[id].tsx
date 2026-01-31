import { completeGoal, getGoalFeedbackHistory } from '@/api/goalsApi';
import PrimaryButton from '@/components/common/PrimaryButton';
import ProgressWheel from '@/components/common/ProgressWheel';
import TitleText from '@/components/common/TitleText';
import EventFeedbackInfo from '@/components/events/EventFeedbackInfo';
import NextEvents from '@/components/index/NextEvents';
import { ThemedView } from '@/components/ThemedView';
import { useEventsStore } from '@/stores/useEventStore';
import { useGoalsStore } from '@/stores/useGoalStore';
import Event from '@/types/models/Event';
import EventFeedback from '@/types/models/EventFeedback';
import {
    calculateCurrentProgressForEvent,
    calculateMaxProgressForGoal
} from '@/utils/progressCalculator';
import { calculateEventsForCurrentMonth } from '@/utils/scheduleHandler';
import { Entypo } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface UpcomingEvent {
    date: string;
    event: Event;
    eventID: number;
}

interface GoalFeedback {
    string: EventFeedback[];
}

export default function GoalDetailLayout() {
    const { id } = useLocalSearchParams();
    const { goals, replaceGoal } = useGoalsStore();
    const { events } = useEventsStore();
    const [isLoading, setIsLoading] = useState(true);
    const [goalFeedback, setGoalFeedback] = useState<GoalFeedback>(
        {} as GoalFeedback
    );
    const [completionError, setCompletionError] = useState<string | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);

    const goal = goals.find((goal) => goal.id.toString() === id)!;

    const fallbackMaxPoints = calculateMaxProgressForGoal(goal, events);
    const fallbackCurrentPoints = Object.values(goalFeedback).reduce(
        (acc, feedback) => acc + calculateCurrentProgressForEvent(feedback),
        0
    );
    const pointsEarned = goal.points_earned ?? fallbackCurrentPoints;
    const maxPossiblePoints = goal.max_possible_points ?? fallbackMaxPoints;
    const completionPercentage = Number(
        maxPossiblePoints > 0
            ? ((pointsEarned / maxPossiblePoints) * 100).toFixed(2)
            : 0
    );

    const monthlyEvents = calculateEventsForCurrentMonth(events);
    const daysLeft = moment(goal.end_date).diff(moment(), 'days');
    const isCompleted = goal.status === 'completed' || !!goal.completed_at;
    const isCompletable = !!goal.is_completable && !isCompleted;
    const completionReasonText = (goal.completion_reasons ?? [])
        .map((reason) => {
            if (reason === 'points_threshold') {
                return 'You hit 75% of your target points.';
            }
            if (reason === 'end_date_passed') {
                return 'Your goal period has ended.';
            }
            return null;
        })
        .filter(Boolean)
        .join(' ');

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

    useEffect(() => {
        const fetchGoalFeedback = async () => {
            getGoalFeedbackHistory(id.toString())
                .then((response) => {
                    setGoalFeedback(response.feedback);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                });
        };
        fetchGoalFeedback();
    }, []);

    const handleCompleteGoal = async () => {
        if (isCompleting) return;
        setIsCompleting(true);
        setCompletionError(null);
        const response = await completeGoal(goal.id);
        if (!response?.error && response?.goal) {
            replaceGoal(response.goal);
            router.push({
                pathname: '/goals/[id]/review-goal',
                params: { id: String(goal.id) },
            });
        } else {
            setCompletionError(
                'This goal is not eligible to complete yet.'
            );
        }
        setIsCompleting(false);
    };

    if (goal) {
        return (
            <ScrollView className="flex-1 bg-secondary">
                <ThemedView className="min-h-screen w-full px-8 overflow-y-scroll pb-48">
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
                        <View>
                            <TitleText
                                className="font-bold text-2xl mt-4"
                                title={goal.title}
                            />
                            <Text className="font-bold text-xl font-satoshi text-lightprimary italic my-2">
                                {isCompleted
                                    ? 'Completed'
                                    : `${daysLeft} Days Left`}
                            </Text>
                        </View>
                    </View>
                    <Text className="font-satoshi text-white/70 italic text-base">
                        {goal.description}
                    </Text>
                    <View className="my-8">
                        <ProgressWheel
                            size={150}
                            progress={completionPercentage}
                            label="Towards Goal"
                        />
                        <View className="mt-4">
                            <Text className="text-white/80 text-base font-satoshi text-center">
                                {pointsEarned} / {maxPossiblePoints} points
                            </Text>
                            <Text className="text-white/60 text-sm font-satoshi text-center mt-1">
                                Threshold: {goal.threshold_points ?? 0}
                            </Text>
                        </View>
                    </View>
                    {isCompletable && (
                        <>
                            <PrimaryButton onPress={handleCompleteGoal}>
                                <Text className="text-white text-center font-satoshi text-lg font-bold">
                                    {isCompleting ? 'Completing...' : 'Complete Goal'}
                                </Text>
                            </PrimaryButton>
                            {completionReasonText && (
                                <Text className="text-white/70 text-sm font-satoshi text-center mt-2">
                                    {completionReasonText}
                                </Text>
                            )}
                        </>
                    )}
                    {isCompleted && (
                        <PrimaryButton
                            className="mt-2"
                            onPress={() =>
                                router.push({
                                    pathname: '/goals/[id]/review-goal',
                                    params: { id: String(goal.id) },
                                })
                            }
                        >
                            <Text className="text-white text-center font-satoshi text-lg font-bold">
                                View Review
                            </Text>
                        </PrimaryButton>
                    )}
                    {completionError && (
                        <View className="rounded-xl backdrop-blur-xl bg-red-200/20 mt-4 p-4">
                            <Text className="text-red-600 text-center font-satoshi text-lg font-bold">
                                {completionError}
                            </Text>
                        </View>
                    )}
                    <View className="mt-6 h-fit">
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
                    <View className="mt-6 h-fit mb-8">
                        <Text
                            className={`text-white text-lg font-satoshi font-bold ${
                                isLoading ? 'pb-32' : ''
                            }`}
                        >
                            History
                        </Text>
                        {Object.entries(goalFeedback).map(([key, items]) => (
                            <>
                                <Text className="text-white/80 text-base font-satoshi mt-4">
                                    {key}
                                </Text>
                                {items.map(
                                    (
                                        feedback: EventFeedback,
                                        index: number
                                    ) => (
                                        <EventFeedbackInfo
                                            key={index}
                                            {...feedback}
                                        />
                                    )
                                )}
                            </>
                        ))}
                    </View>
                </ThemedView>
            </ScrollView>
        );
    }
}
