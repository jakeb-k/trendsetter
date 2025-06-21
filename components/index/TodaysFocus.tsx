import Event from '@/types/models/Event';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text, View } from 'react-native';

export default function TodaysFocus({
    todaysEvents,
}: {
    todaysEvents: Event[];
}) {

    return (
        <View className="bg-primary rounded-lg mb-2 mt-6 py-4 px-4 ">
            <Text className="text-white font-satoshi text-xl">
                Today's Focus
            </Text>
            <View className="bg-[#FF8F19] rounded-lg flex flex-col items-center justify-between p-2 w-full mt-2 mx-auto">
                {todaysEvents.map((event: Event) => (
                    <View  key={event.id} className="mb-2 border-b border-white flex flex-row justify-between w-full pb-2 items-center">
                        <View>
                            <Text className="text-lg text-white font-satoshi">
                                {event.title}
                            </Text>
                        </View>
                        <AntDesign name="checkcircle" size={24} color="white" />
                    </View>
                ))}
            </View>
        </View>
    );
}
