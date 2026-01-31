import moment from 'moment';
import React from 'react';
import { Text, View } from 'react-native';

type Review = {
    outcome: string;
    feelings: string[];
    why: string;
    wins: string;
    obstacles: string;
    lessons: string;
    next_steps: string;
    advice?: string | null;
    created_at: string;
};

type Props = {
    review: Review;
};

export default function ReviewSummary({ review }: Props) {
    return (
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

            {!!review.advice && (
                <Text className="text-white/80 font-satoshi">
                    Advice: {review.advice}
                </Text>
            )}

            <Text className="text-white/60 font-satoshi text-sm mt-2">
                Submitted {moment(review.created_at).format('MMM Do, YYYY')}
            </Text>
        </View>
    );
}
