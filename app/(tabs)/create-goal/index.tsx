import CreateGoal from '@/components/create-goal/CreateGoal';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { ScrollView } from 'react-native';

export default function CreateGoalScreen() {
    const [isCreatingGoal, setIsCreatingGoal] = useState(true);

    return (
        <ScrollView className="flex-1 bg-secondary">
            <ThemedView className="min-h-screen w-full px-8 overflow-y-scroll">
                <CreateGoal />
            </ThemedView>
        </ScrollView>
    );
}
