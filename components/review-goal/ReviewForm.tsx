import PrimaryButton from '@/components/common/PrimaryButton';
import type GoalReviewRequest from '@/types/requests/GoalReviewRequest';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

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

type Props = {
    form: GoalReviewRequest;
    setForm: React.Dispatch<React.SetStateAction<GoalReviewRequest>>;
    isSubmitting: boolean;
    onSubmit: () => void;
};

export default function ReviewForm({
    form,
    setForm,
    isSubmitting,
    onSubmit,
}: Props) {
    const toggleFeeling = (feeling: string) => {
        setForm((prev) => ({
            ...prev,
            feelings: prev.feelings.includes(feeling)
                ? prev.feelings.filter((f) => f !== feeling)
                : [...prev.feelings, feeling],
        }));
    };

    return (
        <View className="mt-6 space-y-4">
            <Text className="text-white font-satoshi text-lg font-bold">
                Outcome
            </Text>

            <View className="flex flex-row flex-wrap">
                {OUTCOMES.map((option) => (
                    <TouchableOpacity
                        key={option}
                        onPress={() =>
                            setForm((prev) => ({ ...prev, outcome: option }))
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

            {[
                ['Why', 'why', 'What made this happen?'],
                ['Wins', 'wins', 'What worked?'],
                ['Obstacles', 'obstacles', 'What got in the way?'],
                ['Lessons', 'lessons', 'What did you learn?'],
                ['Next Steps', 'next_steps', 'What will you do next?'],
                [
                    'Advice to Future Me (optional)',
                    'advice',
                    'Anything to remember?',
                ],
            ].map(([label, key, placeholder]) => (
                <View key={key}>
                    <Text className="text-white font-satoshi text-lg font-bold">
                        {label}
                    </Text>
                    <TextInput
                        multiline
                        value={(form as any)[key] ?? ''}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, [key]: text }))
                        }
                        placeholder={placeholder}
                        placeholderTextColor="#ccc"
                        className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl"
                        style={{ minHeight: 120 }}
                    />
                </View>
            ))}

            <PrimaryButton onPress={onSubmit} className="mt-4">
                <Text className="text-white text-center font-satoshi text-lg font-bold">
                    {isSubmitting ? 'Submitting…' : 'Submit Review'}
                </Text>
            </PrimaryButton>
        </View>
    );
}
