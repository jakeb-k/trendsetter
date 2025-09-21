import Event from '@/types/models/Event';
import { AntDesign } from '@expo/vector-icons';
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editEvent, setEditEvent] = useState({} as Event);
    const [success, setSuccess] = useState(false);
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

    const handleSuccess = () => {
        setIsSubmitting(false);
        setSuccess(true);
        setIsCreating(false);
    };

    return (
        <View className="px-2 mt-8">
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
            {isCreating && (
                <Animated.View style={{ opacity, transform: [{ scale }] }}>
                    <EventForm
                        isSubmitting={isSubmitting}
                        event={editEvent}
                        setSuccess={handleSuccess}
                        closeForm={() => setIsCreating(false)}
                    />
                </Animated.View>
            )}
            <PrimaryButton
                onPress={() => {
                    if (isCreating) {
                        setIsSubmitting(true);
                    } else {
                        setSuccess(false);
                        setIsCreating(!isCreating);
                    }
                }}
                className={`mt-4 ${
                    success
                        ? 'bg-green-700 shadow-green-700 flex flex-row justify-center space-x-2 items-center'
                        : ''
                }`}
            >
                <Text className="text-white text-center font-satoshi text-lg font-bold">
                    {isCreating
                        ? 'Create Event'
                        : success
                        ? 'Created Event'
                        : 'Add Event'}
                </Text>
                {success && <AntDesign name="check" size={24} color="white" />}
            </PrimaryButton>
        </View>
    );
}
