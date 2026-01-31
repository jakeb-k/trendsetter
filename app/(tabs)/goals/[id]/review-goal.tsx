import {
    createGoalReview,
    fetchGoalReview,
    getGoalFeedbackHistory,
} from '@/api/goalsApi';
import PrimaryButton from '@/components/common/PrimaryButton';
import TitleText from '@/components/common/TitleText';
import { ThemedView } from '@/components/ThemedView';
import { useGoalsStore } from '@/stores/useGoalStore';
import GoalReview from '@/types/models/GoalReview';
import GoalReviewRequest from '@/types/requests/GoalReviewRequest';
import { calculateCompletionStats } from '@/utils/progressCalculator';
import { Entypo } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const FEELINGS = [
    'happy',
    'good',
    'meh',
    'frustrated',
    'proud',
    'relieved',
    'disappointed',
    'burnt_out',
    'motivated',
];

const OUTCOMES: GoalReviewRequest['outcome'][] = [
    'achieved',
    'partially_achieved',
    'not_achieved',
];

export default function ReviewGoalScreen() {
    const { id } = useLocalSearchParams();
    const { goals } = useGoalsStore();
    const goal = goals.find((g) => g.id.toString() === id);

    const [review, setReview] = useState<GoalReview | null>(null);
    const [feedbackMap, setFeedbackMap] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<GoalReviewRequest>({
        outcome: 'achieved',
        feelings: [],
        why: '',
        wins: '',
        obstacles: '',
        lessons: '',
        next_steps: '',
        advice: '',
    });

    useEffect(() => {
        const loadReview = async () => {
            const response = await fetchGoalReview(Number(id));
            if (!response?.error && response?.review) {
                setReview(response.review);
            }
            const feedbackResponse = await getGoalFeedbackHistory(String(id));
            if (!feedbackResponse?.error && feedbackResponse?.feedback) {
                setFeedbackMap(feedbackResponse.feedback);
            }
            setIsLoading(false);
        };
        loadReview();
    }, []);

    const stats = useMemo(() => {
        const snapshot = review?.stats_snapshot ?? null;
        if (snapshot) {
            return snapshot;
        }
        if (!goal) {
            return {
                points_earned: 0,
                max_possible_points: 0,
                threshold_points: 0,
                completion_reasons: [],
            };
        }
        const computed = calculateCompletionStats(goal, goal.events ?? [], feedbackMap);
        return {
            points_earned: computed.pointsEarned,
            max_possible_points: computed.maxPossiblePoints,
            threshold_points: computed.thresholdPoints,
            completion_reasons: computed.completionReasons,
        };
    }, [review, goal, feedbackMap]);

    const toggleFeeling = (feeling: string) => {
        setForm((prev) => {
            const exists = prev.feelings.includes(feeling);
            return {
                ...prev,
                feelings: exists
                    ? prev.feelings.filter((item) => item !== feeling)
                    : [...prev.feelings, feeling],
            };
        });
    };

    const submitReview = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        const computed = goal
            ? calculateCompletionStats(goal, goal.events ?? [], feedbackMap)
            : null;
        const statusCounts = Object.values(feedbackMap).flat().reduce(
            (acc: Record<string, number>, feedback: any) => {
                acc[feedback.status] = (acc[feedback.status] ?? 0) + 1;
                return acc;
            },
            {}
        );
        const moodCounts = Object.values(feedbackMap).flat().reduce(
            (acc: Record<string, number>, feedback: any) => {
                acc[feedback.mood] = (acc[feedback.mood] ?? 0) + 1;
                return acc;
            },
            {}
        );
        const response = await createGoalReview(Number(id), {
            ...form,
            advice: form.advice?.trim() === '' ? null : form.advice,
            stats_snapshot: computed
                ? {
                      points_earned: computed.pointsEarned,
                      max_possible_points: computed.maxPossiblePoints,
                      threshold_points: computed.thresholdPoints,
                      completion_reasons: computed.completionReasons,
                      status_counts: statusCounts,
                      mood_counts: moodCounts,
                  }
                : null,
        });
        if (!response?.error && response?.review) {
            setReview(response.review);
            router.navigate('/completed-goals');
        } else {
            setError('Unable to submit review right now.');
        }
        setIsSubmitting(false);
    };

    if (!goal) {
        return (
            <ThemedView className="flex-1 bg-secondary items-center justify-center">
                <Text className="text-white">Goal not found.</Text>
            </ThemedView>
        );
    }

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
                        title="Goal Review"
                    />
                    <Text className="font-satoshi text-white/70 italic text-base mt-2">
                        {goal.title}
                    </Text>
                </View>

                <View className="mt-6 rounded-xl bg-white/10 p-4">
                    <Text className="text-white font-satoshi text-lg font-bold">
                        Stats Summary
                    </Text>
                    <Text className="text-white/80 font-satoshi text-sm mt-2">
                        {stats.points_earned ?? 0} / {stats.max_possible_points ?? 0} points
                    </Text>
                    <Text className="text-white/60 font-satoshi text-sm mt-1">
                        Threshold: {stats.threshold_points ?? 0}
                    </Text>
                    <Text className="text-white/60 font-satoshi text-sm mt-1">
                        Reasons:{' '}
                        {(stats.completion_reasons ?? []).length > 0
                            ? stats.completion_reasons.join(', ')
                            : '—'}
                    </Text>
                    {!!review?.stats_snapshot?.status_counts && (
                        <Text className="text-white/60 font-satoshi text-sm mt-2">
                            Status:{' '}
                            {Object.entries(
                                review.stats_snapshot.status_counts ?? {},
                            )
                                .map(([key, value]) => `${key}:${value}`)
                                .join(' • ')}
                        </Text>
                    )}
                    {!!review?.stats_snapshot?.mood_counts && (
                        <Text className="text-white/60 font-satoshi text-sm mt-1">
                            Mood:{' '}
                            {Object.entries(
                                review.stats_snapshot.mood_counts ?? {},
                            )
                                .map(([key, value]) => `${key}:${value}`)
                                .join(' • ')}
                        </Text>
                    )}
                </View>

                {isLoading ? (
                    <View className="w-full flex flex-col items-center justify-center h-full pt-24">
                        <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </View>
                ) : review ? (
                    <View className="mt-6 space-y-4">
                        <Text className="text-white font-satoshi text-lg font-bold">
                            Review Submitted
                        </Text>
                        <Text className="text-white/80 font-satoshi">
                            Outcome: {review.outcome.replace('_', ' ')}
                        </Text>
                        <Text className="text-white/80 font-satoshi">
                            Feelings: {review.feelings.join(', ')}
                        </Text>
                        <Text className="text-white/80 font-satoshi">
                            Why: {review.why}
                        </Text>
                        <Text className="text-white/80 font-satoshi">
                            Wins: {review.wins}
                        </Text>
                        <Text className="text-white/80 font-satoshi">
                            Obstacles: {review.obstacles}
                        </Text>
                        <Text className="text-white/80 font-satoshi">
                            Lessons: {review.lessons}
                        </Text>
                        <Text className="text-white/80 font-satoshi">
                            Next steps: {review.next_steps}
                        </Text>
                        {review.advice && (
                            <Text className="text-white/80 font-satoshi">
                                Advice: {review.advice}
                            </Text>
                        )}
                        <Text className="text-white/60 font-satoshi text-sm mt-2">
                            Submitted {moment(review.created_at).format('MMM Do, YYYY')}
                        </Text>
                    </View>
                ) : (
                    <View className="mt-6 space-y-4">
                        <Text className="text-white font-satoshi text-lg font-bold">
                            Outcome
                        </Text>
                        <View className="flex flex-row flex-wrap">
                            {OUTCOMES.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            outcome: option,
                                        }))
                                    }
                                    className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                                        form.outcome === option
                                            ? 'bg-primary'
                                            : 'bg-white/10'
                                    }`}
                                >
                                    <Text className="text-white font-satoshi">
                                        {option.replace('_', ' ')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text className="text-white font-satoshi text-lg font-bold">
                            Feelings
                        </Text>
                        <View className="flex flex-row flex-wrap">
                            {FEELINGS.map((feeling) => (
                                <TouchableOpacity
                                    key={feeling}
                                    onPress={() => toggleFeeling(feeling)}
                                    className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                                        form.feelings.includes(feeling)
                                            ? 'bg-primary'
                                            : 'bg-white/10'
                                    }`}
                                >
                                    <Text className="text-white font-satoshi">
                                        {feeling.replace('_', ' ')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text className="text-white font-satoshi text-lg font-bold">
                            Why
                        </Text>
                        <TextInput
                            multiline
                            value={form.why}
                            onChangeText={(text) =>
                                setForm((prev) => ({ ...prev, why: text }))
                            }
                            placeholder="What made this happen?"
                            placeholderTextColor="#ccc"
                            className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl"
                            style={{ minHeight: 120 }}
                        />

                        <Text className="text-white font-satoshi text-lg font-bold">
                            Wins
                        </Text>
                        <TextInput
                            multiline
                            value={form.wins}
                            onChangeText={(text) =>
                                setForm((prev) => ({ ...prev, wins: text }))
                            }
                            placeholder="What worked?"
                            placeholderTextColor="#ccc"
                            className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl"
                            style={{ minHeight: 120 }}
                        />

                        <Text className="text-white font-satoshi text-lg font-bold">
                            Obstacles
                        </Text>
                        <TextInput
                            multiline
                            value={form.obstacles}
                            onChangeText={(text) =>
                                setForm((prev) => ({
                                    ...prev,
                                    obstacles: text,
                                }))
                            }
                            placeholder="What got in the way?"
                            placeholderTextColor="#ccc"
                            className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl"
                            style={{ minHeight: 120 }}
                        />

                        <Text className="text-white font-satoshi text-lg font-bold">
                            Lessons
                        </Text>
                        <TextInput
                            multiline
                            value={form.lessons}
                            onChangeText={(text) =>
                                setForm((prev) => ({
                                    ...prev,
                                    lessons: text,
                                }))
                            }
                            placeholder="What did you learn?"
                            placeholderTextColor="#ccc"
                            className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl"
                            style={{ minHeight: 120 }}
                        />

                        <Text className="text-white font-satoshi text-lg font-bold">
                            Next Steps
                        </Text>
                        <TextInput
                            multiline
                            value={form.next_steps}
                            onChangeText={(text) =>
                                setForm((prev) => ({
                                    ...prev,
                                    next_steps: text,
                                }))
                            }
                            placeholder="What will you do next?"
                            placeholderTextColor="#ccc"
                            className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl"
                            style={{ minHeight: 120 }}
                        />

                        <Text className="text-white font-satoshi text-lg font-bold">
                            Advice to Future Me (optional)
                        </Text>
                        <TextInput
                            multiline
                            value={form.advice ?? ''}
                            onChangeText={(text) =>
                                setForm((prev) => ({
                                    ...prev,
                                    advice: text,
                                }))
                            }
                            placeholder="Anything you want to remember?"
                            placeholderTextColor="#ccc"
                            className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl"
                            style={{ minHeight: 120 }}
                        />

                        <PrimaryButton onPress={submitReview} className="mt-4">
                            <Text className="text-white text-center font-satoshi text-lg font-bold">
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </Text>
                        </PrimaryButton>
                        {error && (
                            <View className="rounded-xl backdrop-blur-xl bg-red-200/20 mt-4 p-4">
                                <Text className="text-red-600 text-center font-satoshi text-lg font-bold">
                                    {error}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ThemedView>
        </ScrollView>
    );
}
