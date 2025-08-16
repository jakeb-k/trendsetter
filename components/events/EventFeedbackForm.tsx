import EventFeedback from '@/types/models/EventFeedback';
import { emojiConverter, statusConverter } from '@/utils/textConverters';
import AntDesign from '@expo/vector-icons/AntDesign';
import moment from 'moment';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function EventFeedbackInfo(eventFeedback?: EventFeedback) {
    const [data, setData] = useState({
        note: eventFeedback?.note ?? '',
        status: eventFeedback?.status ?? '',
        mood: eventFeedback?.mood ?? 'nailed_it',
        created_at: new Date(),
    });
    //@TODO - should have sliding actions (edit and delete) on event feedback but only for the current date
    if (eventFeedback) {
        return (
            <View className="pl-4 my-4 border-2 border-primary shadow-lg shadow-primary rounded-lg p-2 relative">
                <View className="absolute top-2 right-4 flex flex-row items-center space-x-2">
                    <Text className="text-xl">{emojiConverter(eventFeedback.mood)}</Text>
                    <AntDesign name={statusConverter(eventFeedback.status)[0]} size={20} color={statusConverter(eventFeedback.status)[1]} />
                </View>
                <Text className="text-lg font-satoshi text-white mb-2">
                    {moment(eventFeedback.created_at).format('ddd Do MMM')}
                </Text>
                <Text className="tracking-wider font-satoshi_italic mb-4 text-white text-left">
                    {eventFeedback.note || 'No note provided'}
                </Text>
            </View>
        );
    }
}
