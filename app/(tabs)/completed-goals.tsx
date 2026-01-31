import { fetchCompletedGoals } from '@/api/goalsApi';
import TitleText from '@/components/common/TitleText';
import { ThemedView } from '@/components/ThemedView';
import { useGoalsStore } from '@/stores/useGoalStore';
import Goal from '@/types/models/Goal';
import {
    calculateCurrentProgressForEvent,
    calculateMaxProgressForGoal,
} from '@/utils/progressCalculator';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CompletedGoalsScreen() {
    const { completedGoals, setCompletedGoals } = useGoalsStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            const response = await fetchCompletedGoals();
            if (!response?.error) {
                setCompletedGoals(response.goals ?? []);
            }
            setIsLoading(false);
        };
        fetchGoals();
    }, []);

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
                    <TitleText
                        className="font-bold text-2xl mt-4"
                        title="Completed Goals"
                    />
                    <Text className="font-satoshi text-white/70 italic text-base mt-2">
                        Your wins live here. Tap a goal to view its review.
                    </Text>
                </View>

                {isLoading ? (
                    <View className="w-full flex flex-col items-center justify-center h-full pt-24">
                        <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </View>
                ) : completedGoals.length > 0 ? (
                    <View className="mt-6 space-y-3">
                        {completedGoals.map((goal: Goal) => (
                            <TouchableOpacity
                                key={goal.id}
                                onPress={() =>
                                    router.push({
                                        pathname: '/goals/[id]/review-goal',
                                        params: { id: String(goal.id) },
                                    })
                                }
                                className="bg-[#1A1A1A] drop-shadow-md rounded-lg p-3"
                            >
                                {(() => {
                                    const eventsWithFeedback = (goal.events ??
                                        []) as any[];
                                    const pointsEarned = eventsWithFeedback.reduce(
                                        (acc, event) =>
                                            acc +
                                            calculateCurrentProgressForEvent(
                                                event.feedback ?? [],
                                            ),
                                        0,
                                    );
                                    const maxPossiblePoints =
                                        calculateMaxProgressForGoal(
                                            goal,
                                            eventsWithFeedback,
                                        );
                                    return (
                                        <>
                                <View className="flex flex-row justify-between">
                                    <Text className="text-[#F5F5F5] font-semibold text-base w-3/4">
                                        {goal.title}
                                    </Text>
                                    <Text className="text-[#F5F5F5] font-semibold text-base w-1/4 text-right">
                                        {goal.completed_at
                                            ? moment(goal.completed_at).format(
                                                  'Do MMM',
                                              )
                                            : '—'}
                                    </Text>
                                </View>
                                <View className="flex flex-row justify-between mt-2">
                                    <Text className="text-lightprimary font-semibold text-sm">
                                        {goal.review_summary?.outcome
                                            ? String(
                                                  goal.review_summary.outcome,
                                              )
                                                  .replace('_', ' ')
                                                  .toUpperCase()
                                            : 'REVIEW'}
                                    </Text>
                                    <Text className="text-lightprimary font-semibold text-sm">
                                        {goal.points_earned ?? pointsEarned} /{' '}
                                        {goal.max_possible_points ??
                                            maxPossiblePoints}{' '}
                                        points
                                    </Text>
                                </View>
                                        </>
                                    );
                                })()}
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View className="mt-8">
                        <Text className="text-white/80 font-satoshi text-lg">
                            No completed goals yet.
                        </Text>
                    </View>
                )}
            </ThemedView>
        </ScrollView>
    );
}
