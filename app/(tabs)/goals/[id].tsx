import ProgressWheel from '@/components/common/ProgressWheel';
import TitleText from '@/components/common/TitleText';
import { ThemedView } from '@/components/ThemedView';
import { useGoalsStore } from '@/stores/useGoalStore';
import { Entypo } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function GoalDetailLayout() {
    const { id } = useLocalSearchParams();
    const { goals } = useGoalsStore();
    const goal = goals.find((goal) => goal.id.toString() === id);

    if (goal) {
        return (
            <ScrollView className="flex-1 bg-secondary">
                <ThemedView className="min-h-screen w-full px-8 overflow-y-scroll">
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
                    <View className="mt-6 bg-secondary/50 rounded-xl p-4">
                        <Text className="font-satoshi text-white/70 italic text-base">
                            {goal.description}
                        </Text>
                        <View className="mt-8">
                            <ProgressWheel
                                size={150}
                                progress={0.65}
                                label="Towards Goal"
                            />
                        </View>
                    </View>
                </ThemedView>
            </ScrollView>
        );
    }
}
