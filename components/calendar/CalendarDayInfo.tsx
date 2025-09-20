import Event from '@/types/models/Event';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../common/PrimaryButton';
import TitleText from '../common/TitleText';
import EventForm from '../events/EventForm';

export default function CalendarDayInfo({
    events,
    date,
}: {
    events: Event[];
    date: string;
}) {
    const [isCreating, setIsCreating] = useState(false);
    const [editEvent, setEditEvent] = useState({} as Event)
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (isCreating) {
            opacity.setValue(0);
            scale.setValue(0.9);
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                friction: 6,
            }).start();
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isCreating]);

    const handleEventPress = async (eventId: number) => {
        await AsyncStorage.setItem('selectedDate', JSON.stringify(date));
        router.push({ pathname: '/events/[id]', params: { id: eventId } });
    };

    return (
        <View className="pl-4 mt-8">
            <TitleText
                className="mb-2"
                title={moment(date).format('ddd Do MMM')}
            />
            {events.length > 0 ? (
                events.map((event: Event) => (
                    <TouchableOpacity
                        key={event.id}
                        onPress={() => handleEventPress(event.id)}
                        className="border-2 border-primary rounded-lg py-4 px-2 mb-4"
                    >
                        <Text className="text-lg font-satoshi text-white">
                            {event.title}
                        </Text>
                    </TouchableOpacity>
                ))
            ) : (
                <>
                    <Text className="text-lg font-satoshi_italic mb-4 text-white text-left">
                        You have nothing scheduled for today
                    </Text>
                </>
            )}

            <EventForm event={editEvent}  />
            <PrimaryButton className="mt-4">
                <Text className="text-white text-center font-satoshi text-lg font-bold">
                    {isCreating ? 'Create Event' : 'Add Event'}
                </Text>
            </PrimaryButton>
        </View>
    );
}
