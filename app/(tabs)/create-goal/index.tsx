import TitleText from '@/components/common/TitleText';
import { ThemedView } from '@/components/ThemedView';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CreateGoalScreen() {
    return (
        <ScrollView className="flex-1 bg-secondary">
            <ThemedView className="min-h-screen w-full px-8 overflow-y-scroll">
                <View className="flex flex-col w-full mt-6">
                    <TouchableOpacity>
                        <Entypo
                            onPress={() => router.navigate('/calendar')}
                            name="chevron-left"
                            size={32}
                            color="#FF6B00"
                            className="-ml-2"
                        />
                    </TouchableOpacity>
                    <TitleText
                        className="font-bold text-2xl mt-4"
                        title={'Set a Goal'}
                    />
                    <Text className="text-white/50 font-satoshi font-semibold my-1 tracking-wide">
                        Make it real. No Vague Targets.
                    </Text>
                </View>
                <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
            </ThemedView>
        </ScrollView>
    );
}
