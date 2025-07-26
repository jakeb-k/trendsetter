import PrimaryButton from '@/components/common/PrimaryButton';
import TitleText from '@/components/common/TitleText';
import EventFeedbackInfo from '@/components/events/EventFeedbackInfo';
import { ThemedView } from '@/components/ThemedView';
import { useEventsStore } from '@/stores/useEventStore';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function EventDetailLayout() {
    const { id } = useLocalSearchParams();
    const { events } = useEventsStore();
    const [date, setDate] = useState(null);
    const [event, setEvent] = useState(() =>
        events.find((event) => event.id.toString() === id)
    );
    console.log(event);

    useEffect(() => {
        async function getSelectedDate() {
            const date = await AsyncStorage.getItem('selectedDate');
            if (date) {
                setDate(JSON.parse(date));
            }
        }
        getSelectedDate();
    }, []);

    if (event) {
        return (
            <ThemedView className="min-h-screen w-full px-8">
                <View className="flex flex-col w-full mt-6">
                    <TouchableOpacity>
                        <Entypo
                            name="chevron-left"
                            size={32}
                            color="#FF6B00"
                            className='-ml-2'
                        />
                    </TouchableOpacity>
                    <TitleText className="font-bold text-2xl mt-4" title={event.title} />
                </View>
                <View className=' mt-6 flex flex-row items-center justify-between'>
                    <Text className='text-white text-xl font-satoshi'>
                        {moment(date).format('ddd MMM Do')}
                    </Text>
                    <Text className='rounded-lg bg-lightprimary text-white px-2 py-1 font-semibold font-satoshi italic shadow-md shadow-primary'>
                        7 STREAK
                    </Text>
                </View>
                <View className=''>
                    <Text className='text-white text-lg font-satoshi font-bold mt-6'>
                        Description
                    </Text>
                    <Text className='text-white text-lg font-satoshi mt-2'>
                        {event.description}
                    </Text>
                </View>
                <PrimaryButton className='mt-6'>
                    <Text className="text-white text-center font-satoshi text-lg font-bold">
                        Log Progress
                    </Text>
                </PrimaryButton>
                <View className='mt-6'>
                    <Text className='text-white text-lg font-satoshi font-bold'>
                        History
                    </Text>
                    <EventFeedbackInfo />
                </View>
            </ThemedView>
        );
    }
}