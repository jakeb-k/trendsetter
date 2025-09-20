import Event from '@/types/models/Event';
import moment from 'moment';
import { Text, View } from 'react-native';

export default function NextEvents({
    events,
    date,
}: {
    events: Event[];
    date: Date;
}) {
    return (
        // should have slide actions of cancelling or completing
        <View className="bg-[#1A1A1A] drop-shadow-md rounded-lg p-2 flex flex-row items-center space-x-6 mt-2 pl-6">
            <View className="flex flex-col items-center">
                <Text className="text-lg text-lightprimary font-semibold">
                    {moment(date).format('MMM')}
                </Text>
                <Text className="text-xl text-primary font-bold">
                    {moment(date).format('DD')}
                </Text>
            </View>
            <View className="flex flex-col justify-center pt-1 w-3/4">
                {events.map((event: Event, index: number) => (
                    <Text
                        key={index}
                        className={`text-white py-1 text-base font-satoshi ${index > 0 ? 'border-t' : ''} border-primary`}
                    >
                        {event.title}
                    </Text>
                ))}
            </View>
        </View>
    );
}
