import Event from '@/types/models/Event';
import EventFeedback from '@/types/models/EventFeedback';
import moment from 'moment';
import { useState } from 'react';
import { Text, View } from 'react-native';

type Props = { eventFeedback?: EventFeedback; event: Event };

export default function EventFeedbackForm({ eventFeedback, event }: Props) {
    const [data, setData] = useState({
        note: eventFeedback?.note ?? '',
        status: eventFeedback?.status ?? '',
        mood: eventFeedback?.mood ?? 'nailed_it',
        created_at: new Date(),
    });
    return (
        <View className="pl-4 my-4 border-2 border-primary shadow-lg shadow-primary rounded-lg p-2 relative">
            <Text className="text-lg font-satoshi text-white">
                Log Progress - {moment(data.created_at).format('ddd Do MMM')}
            </Text>
            <Text className="font-satoshi text-white mt-2 mb-1">{event.title}</Text>
            <Text className="text-sm font-satoshi_italic text-gray-400">
                Record your progress for this event
            </Text>
            <Text className="font-satoshi text-white mt-2">Mood</Text>
            <Text className="font-satoshi text-white mt-2">Progress</Text>
        </View>
    );
}
