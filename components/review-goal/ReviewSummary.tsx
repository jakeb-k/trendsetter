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
    const CardText = ({ children }: { children: React.ReactNode }) => (
        <Text className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4">
            {children}
        </Text>
    );

    return (
        <View className="mt-6 space-y-4">
            <Text className="text-white font-satoshi text-lg font-bold">
                Review Submitted
            </Text>

            <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />

            <Text className="text-white/80 font-satoshi">Outcome</Text>
            <CardText>{review.outcome.replace('_', ' ')}</CardText>

            <Text className="text-white/80 font-satoshi">Feelings</Text>
            <CardText>{review.feelings.join(', ')}</CardText>

            <Text className="text-white/80 font-satoshi">Why</Text>
            <CardText>{review.why}</CardText>

            <Text className="text-white/80 font-satoshi">Wins</Text>
            <CardText>{review.wins}</CardText>

            <Text className="text-white/80 font-satoshi">Obstacles</Text>
            <CardText>{review.obstacles}</CardText>

            <Text className="text-white/80 font-satoshi">Lessons</Text>
            <CardText>{review.lessons}</CardText>

            <Text className="text-white/80 font-satoshi">Next steps</Text>
            <CardText>{review.next_steps}</CardText>

            {!!review.advice && (
                <>
                    <Text className="text-white/80 font-satoshi">Advice</Text>
                    <CardText>{review.advice}</CardText>
                </>
            )}

            <Text className="text-white/60 font-satoshi text-sm mt-2">
                Submitted {moment(review.created_at).format('MMM Do, YYYY')}
            </Text>
        </View>
    );
}
