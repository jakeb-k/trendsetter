import Event from '@/types/models/Event';
import moment from 'moment';
import { Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../common/PrimaryButton';
import TitleText from '../common/TitleText';

export default function CalendarDayInfo({
    events,
    date,
}: {
    events: Event[];
    date: string;
}) {
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
                    <PrimaryButton>
                        <Text className="text-white text-center font-satoshi text-lg font-bold">
                            Add Event
                        </Text>
                    </PrimaryButton>
                </>
            )}
        </View>
    );
}
