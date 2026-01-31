import { emojiConverter, statusConverter } from '@/utils/textConverters';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Text, View } from 'react-native';

type StatusCounts = Record<string, number>;
type MoodCounts = Record<string, number>;

export type StatsSnapshot = {
    points_earned?: number;
    max_possible_points?: number;
    threshold_points?: number;
    completion_reasons?: string[];
    status_counts?: StatusCounts;
    mood_counts?: MoodCounts;
};

type Props = {
    stats: StatsSnapshot;
};

export default function StatsSummary({ stats }: Props) {
    return (
        <View className="mt-6 rounded-xl bg-white/10 p-4">
            <Text className="text-white font-satoshi text-lg font-bold">
                Stats Summary
            </Text>

            <Text className="text-white/80 font-satoshi text-sm mt-2">
                {stats.points_earned ?? 0} / {stats.max_possible_points ?? 0}{' '}
                points
            </Text>

            <Text className="text-white/60 font-satoshi text-sm mt-1">
                Threshold: {stats.threshold_points ?? 0}
            </Text>

            <Text className="text-white/60 font-satoshi text-sm mt-1">
                Reasons:{' '}
                {(stats.completion_reasons?.length ?? 0) > 0
                    ? stats.completion_reasons!.join(', ')
                    : '—'}
            </Text>

            {!!stats.status_counts && (
                <Text className="text-white/60 font-satoshi text-sm mt-2">
                    Status:{' '}
                    {Object.entries(stats.status_counts).map(
                        ([status, count], idx) => {
                            const [iconName, colour] = statusConverter(status);

                            return (
                                <Text key={status}>
                                    {idx > 0 ? ' • ' : ''}
                                    <AntDesign
                                        name={iconName as any}
                                        size={16}
                                        color={colour}
                                    />{' '}
                                    {count}
                                </Text>
                            );
                        },
                    )}
                </Text>
            )}

            {!!stats.mood_counts && (
                <Text className="font-satoshi text-sm mt-1">
                    <Text className="text-white/60">Mood: </Text>
                    {Object.entries(stats.mood_counts).map(
                        ([mood, count], idx) => (
                            <Text key={mood}>
                                {idx > 0 ? ' • ' : ''}
                                {emojiConverter(mood)}{' '}
                                <Text className="text-white/60">{count}</Text>
                            </Text>
                        ),
                    )}
                </Text>
            )}
        </View>
    );
}
