import CreateGoalHeader from '@/components/create-goal/CreateGoalHeader';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView, View } from 'react-native';

export default function CreateGoalScreen() {
    return (
        <ScrollView className="flex-1 bg-secondary">
            <ThemedView className="min-h-screen w-full px-8 overflow-y-scroll">
                <CreateGoalHeader />
                <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
            </ThemedView>
        </ScrollView>
    );
}
