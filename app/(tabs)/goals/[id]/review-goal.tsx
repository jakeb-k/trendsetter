import {
    createGoalReview,
    fetchGoalReview,
    getGoalFeedbackHistory,
} from '@/api/goalsApi';
import TitleText from '@/components/common/TitleText';
import ReviewForm from '@/components/review-goal/ReviewForm';
import ReviewSummary from '@/components/review-goal/ReviewSummary';
import StatsSummary from '@/components/review-goal/StatsSummary';
import { ThemedView } from '@/components/ThemedView';
import { useGoalsStore } from '@/stores/useGoalStore';
import type GoalReview from '@/types/models/GoalReview';
import type GoalReviewRequest from '@/types/requests/GoalReviewRequest';
import { calculateCompletionStats } from '@/utils/progressCalculator';
import { Entypo } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Feedback = { status: string; mood: string };
type FeedbackMap = Record<string, Feedback[]>;

const EMPTY_STATS = {
    points_earned: 0,
    max_possible_points: 0,
    threshold_points: 0,
    completion_reasons: [],
};

export default function ReviewGoalScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { goals } = useGoalsStore();

    const goal = useMemo(
        () => goals.find((g) => String(g.id) === id),
        [goals, id],
    );

    const [review, setReview] = useState<GoalReview | null>(null);
    const [feedbackMap, setFeedbackMap] = useState<FeedbackMap>({});
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
        let alive = true;

        (async () => {
            try {
                const [r, f] = await Promise.all([
                    fetchGoalReview(Number(id)),
                    getGoalFeedbackHistory(String(id)),
                ]);

                if (!alive) return;

                if (!r?.error && r?.review) setReview(r.review);
                if (!f?.error && f?.feedback)
                    setFeedbackMap(f.feedback as FeedbackMap);
            } finally {
                if (alive) setIsLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id]);

    const stats = useMemo(() => {
        if (review?.stats_snapshot) return review.stats_snapshot;
        if (!goal) return EMPTY_STATS;

        const computed = calculateCompletionStats(
            goal,
            goal.events ?? [],
            feedbackMap,
        );
        return {
            points_earned: computed.pointsEarned,
            max_possible_points: computed.maxPossiblePoints,
            threshold_points: computed.thresholdPoints,
            completion_reasons: computed.completionReasons,
        };
    }, [review, goal, feedbackMap]);

    const summariseCounts = (key: 'status' | 'mood') =>
        Object.values(feedbackMap)
            .flat()
            .reduce<Record<string, number>>((acc, item) => {
                const k = item?.[key];
                if (k) acc[k] = (acc[k] ?? 0) + 1;
                return acc;
            }, {});

    const submitReview = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        const computed = goal
            ? calculateCompletionStats(goal, goal.events ?? [], feedbackMap)
            : null;

        const response = await createGoalReview(Number(id), {
            ...form,
            advice: form.advice?.trim() ? form.advice : null,
            stats_snapshot: computed
                ? {
                      points_earned: computed.pointsEarned,
                      max_possible_points: computed.maxPossiblePoints,
                      threshold_points: computed.thresholdPoints,
                      completion_reasons: computed.completionReasons,
                      status_counts: summariseCounts('status'),
                      mood_counts: summariseCounts('mood'),
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
                    <TouchableOpacity onPress={() => router.navigate('/')}>
                        <Entypo
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

                    <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
                </View>

                <StatsSummary stats={stats} />

                {isLoading ? (
                    <View className="w-full flex flex-col items-center justify-center h-full pt-24">
                        <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </View>
                ) : review ? (
                    <ReviewSummary review={review} />
                ) : (
                    <>
                        <ReviewForm
                            form={form}
                            setForm={setForm}
                            isSubmitting={isSubmitting}
                            onSubmit={submitReview}
                        />
                        {error && (
                            <View className="rounded-xl backdrop-blur-xl bg-red-200/20 mt-4 p-4">
                                <Text className="text-red-600 text-center font-satoshi text-lg font-bold">
                                    {error}
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ThemedView>
        </ScrollView>
    );
}
