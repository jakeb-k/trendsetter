import Event from '@/types/models/Event';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text, View } from 'react-native';

export default function TodaysFocus({
    todaysEvents,
}: {
    todaysEvents: Event[];
}) {

    return (
        <View className="bg-[#1A1A1A] rounded-lg mb-2 mt-6 py-4 px-4 ">
            <Text className="text-white font-satoshi text-xl">
                Today's Focus
            </Text>
            {todaysEvents.length > 0 ? (<View className="bg-[#1A1A1A] border border-gray-700 rounded-lg flex flex-col items-center justify-between p-2 w-full mt-2 mx-auto">
                {todaysEvents.map((event: Event) => (
                    <View key={event.id} className="mb-2 border-b border-gray-700 flex flex-row justify-between w-full pb-2 items-center">
                        <View>
                            <Text className="text-lg text-white font-satoshi">
                                {event.title}
                            </Text>
                        </View>
                        <AntDesign name="check" size={24} color="#FF6A00" />
                    </View>
                ))}
            </View>) : (
                <View>
                    <Text className='text-white/80 font-satoshi text-lg'>
                        You have nothing scheduled for today
                    </Text>
                </View>
            )}
        </View>
    );
}
