import { getEventFeedbackHistory } from '@/api/eventsApi';
import PrimaryButton from '@/components/common/PrimaryButton';
import TitleText from '@/components/common/TitleText';
import EventFeedbackForm from '@/components/events/EventFeedbackForm';
import EventFeedbackInfo from '@/components/events/EventFeedbackInfo';
import { ThemedView } from '@/components/ThemedView';
import { useEventsStore } from '@/stores/useEventStore';
import EventFeedback from '@/types/models/EventFeedback';
import { AntDesign, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EventDetailLayout() {
    const { id } = useLocalSearchParams();
    const { events, setEvents } = useEventsStore();
    const [date, setDate] = useState(null);
    const [event, setEvent] = useState(() =>
        events.find((event) => event.id.toString() === id)
    );
    const [eventFeedback, setEventFeedback] = useState<EventFeedback[]>([]);
    const [loggedDates, setLoggedDates] = useState<string[]>([] as string[])
    const [isLoading, setIsLoading] = useState(true); 
    const [success, setSuccess] = useState(false);
    const [isLogging, setIsLogging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        async function getSelectedDate() {
            const date = await AsyncStorage.getItem('selectedDate');
            if (date) {
                setDate(JSON.parse(date));
            }
        }
        async function waitForEventFeedback() {
            if (!id) return;
            const data = await requestEventFeedbackHistory(id.toString());
            if (data) {
                console.log(data);
                setEventFeedback(data.feedback);
                setLoggedDates(() => {
                    return data.feedback.map((feedback: EventFeedback) => {
                        return feedback.created_at
                    })
                })
                setIsLoading(false);
            } else {
                console.error('Failed to fetch event feedback');
            }
        }

        waitForEventFeedback();
        getSelectedDate();
    }, []);

    console.log(loggedDates)

    const requestEventFeedbackHistory = async (id: string) => {
        if (!id) return;
        return getEventFeedbackHistory(id.toString());
    };

    useEffect(() => {
        if (isLogging) {
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
    }, [isLogging]);

    const setEventLogged = () => {
        const updatedEvents = events.map((event) =>
            event.id.toString() === id ? { ...event, latestLogDate: moment().format('YYYY-MM-DD')} : event
        );
        setEvents(updatedEvents);
    };

    if (event) {
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
                            title={event.title}
                        />
                    </View>
                    <View className=" mt-6 flex flex-row items-center justify-between">
                        <Text className="text-white text-xl font-satoshi">
                            {moment(date).format('ddd MMM Do')}
                        </Text>
                        {/* @todo use real data */}
                        <Text className="rounded-lg bg-lightprimary text-white px-2 py-1 font-semibold font-satoshi italic shadow-md shadow-primary">
                            7 STREAK
                        </Text>
                    </View>
                    <View className="mb-6">
                        <Text className="text-white text-lg font-satoshi font-bold mt-6">
                            Description
                        </Text>
                        <Text className="text-white text-lg font-satoshi mt-2">
                            {event.description}
                        </Text>
                    </View>
                    {isLogging && (
                        <Animated.View
                            style={{ opacity, transform: [{ scale }] }}
                        >
                            <EventFeedbackForm
                                event={event}
                                closeForm={() => setIsLogging(false)}
                                isSubmitting={isSubmitting}
                                setNewData={(newEvent: any) => {
                                    setEventFeedback(
                                        (existingEvents: EventFeedback[]) => {
                                            const filtered =
                                                existingEvents.filter(
                                                    (event: EventFeedback) =>
                                                        event.id !== newEvent.id
                                                );
                                            return [newEvent, ...filtered];
                                        }
                                    );
                                    setEventLogged();
                                    setSuccess(true);
                                    setIsLogging(false);
                                    setIsSubmitting(false);
                                }}
                            />
                        </Animated.View>
                    )}
                    <PrimaryButton
                        onPress={() => {
                            if (!isLogging) {
                                setIsLogging(true);
                            } else {
                                setIsSubmitting(true);
                            }
                        }}
                        className={`my-3 ${
                            success ? 'bg-green-500 shadow-green-500' : ''
                        }`}
                    >
                        <Text className="text-white text-center font-satoshi text-lg font-bold">
                            {isLogging
                                ? isSubmitting
                                    ? 'Saving'
                                    : 'Save'
                                : success
                                ? 'Saved'
                                : 'Log Progress'}
                        </Text>
                        {isSubmitting && (
                            <View className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin ml-4 absolute left-[57.5%] mt-1" />
                        )}
                        {success && (
                            <AntDesign
                                className="absolute left-[59.5%]"
                                name="check"
                                size={28}
                                color={'white'}
                            />
                        )}
                    </PrimaryButton>

                    <View className="mt-6 h-fit pb-32">
                        <Text
                            className={`text-white text-lg font-satoshi font-bold ${
                                isLoading ? 'pb-32' : ''
                            }`}
                        >
                            History
                        </Text>
                        {isLoading ? (
                            <View className="w-full flex flex-col items-center justify-center h-full pt-24">
                                <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </View>
                        ) : (
                            <>
                                {eventFeedback.map((eventFeedbackItem) => (
                                    <EventFeedbackInfo
                                        key={eventFeedbackItem.id}
                                        {...eventFeedbackItem}
                                    />
                                ))}
                            </>
                        )}
                    </View>
                </ThemedView>
            </ScrollView>
        );
    }
}
