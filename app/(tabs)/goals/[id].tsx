import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text } from 'react-native';

export default function EventDetailLayout() {
    const { id } = useLocalSearchParams();

    return (
        <ScrollView className="flex-1 bg-secondary">
            <ThemedView className="min-h-screen w-full px-8 overflow-y-scroll">
                <Text className='text-white'>GOALS {id} PAGE</Text>
            </ThemedView>
        </ScrollView>
    );
}
