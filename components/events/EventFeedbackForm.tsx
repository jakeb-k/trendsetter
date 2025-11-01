import { storeEventFeedback } from '@/api/eventsApi';
import { MoodOptions, StatusOptions } from '@/constants/Enums';
import Event from '@/types/models/Event';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    event: Event;
    isSubmitting: boolean;
    setNewData: (newEvent: any) => void;
    closeForm: () => void;
};

export default function EventFeedbackForm({
    event,
    isSubmitting,
    setNewData,
    closeForm,
}: Props) {
    const [data, setData] = useState({
        note: '',
        status: '',
        mood: '',
        created_at: new Date(),
    });

    useEffect(() => {
        async function handleEventFeedbackRequest() {
            const newEvent = await storeEventFeedback(
                data,
                event.id.toString()
            );
            if (!newEvent.error) {
                setNewData(newEvent);
            } else {
                console.error(newEvent.error);
            }
        }
        if(isSubmitting) {
            handleEventFeedbackRequest()
        }
    }, [isSubmitting]);

    return (
        <View className="pl-4 my-4 border-2 border-primary shadow-lg shadow-primary rounded-lg p-2 relative">
            <TouchableOpacity
                className="absolute top-2 right-4 z-50"
                onPress={closeForm}
            >
                <AntDesign name={'closecircleo'} size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-satoshi text-white">
                Log Progress - {moment(data.created_at).format('ddd Do MMM')}
            </Text>
            <Text className="font-satoshi text-white mt-2 mb-1">
                {event.title}
            </Text>
            <Text className="text-sm font-satoshi_italic text-gray-400">
                Record your progress for this event
            </Text>
            <Text className="text-lg font-satoshi text-white mt-2">Mood</Text>
            <View className="flex flex-row items-center justify-start space-x-4 my-2">
                {Object.entries(MoodOptions).map(([key, value]) => {
                    const Icon = value;
                    return (
                        <TouchableOpacity
                            key={key}
                            className={`text-lg font-satoshi text-white ${
                                data.mood === key ? 'font-bold' : ''
                            }`}
                            onPress={() => setData({ ...data, mood: key })}
                        >
                            <Icon
                                className="transition-all duration-150 ease-in-out"
                                width={40}
                                height={40}
                                fill={`${data.mood === key ? '#FF6B00' : ''}`}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
            <Text className="text-lg font-satoshi text-white mt-2">
                Progress
            </Text>
            <View className="flex flex-wrap flex-row items-center justify-start mr-4 my-2">
                {Object.entries(StatusOptions).map(([key, value]) => {
                    const Icon = value;
                    return (
                        <TouchableOpacity
                            key={key}
                            className={`text-lg font-satoshi text-white flex flex-row items-center justify-start space-x-4  mt-2 px-2 py-1 rounded-lg w-[47.5%] mr-[2.5%] transition-all duration-150 ease-in-out ${
                                data.status === key
                                    ? 'bg-primary'
                                    : 'bg-secondary'
                            }`}
                            onPress={() => setData({ ...data, status: key })}
                        >
                            <Icon
                                className="transition-all duration-150 ease-in-out"
                                width={key === 'nailed_it' ? 26 : 32}
                                height={key === 'nailed_it' ? 26 : 32}
                            />
                            <Text className="text-white font-satoshi">
                                {(
                                    key.charAt(0).toUpperCase() + key.slice(1)
                                ).replace('_', ' ')}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <Text className="text-lg font-satoshi text-white mt-2">Note</Text>
            <TextInput
                multiline={true}
                value={data.note}
                textAlignVertical="top"
                placeholder="Add any notes..."
                placeholderTextColor="#ccc"
                style={{ maxHeight: 240 }}
                onChangeText={(text) => setData({ ...data, note: text })}
                className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
            />
        </View>
    );
}
