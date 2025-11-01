import Event from '@/types/models/Event';
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import moment from 'moment';
import { Text, TouchableOpacity, View } from 'react-native';

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
            {todaysEvents.length > 0 ? (
                <View className="bg-[#1A1A1A] border border-gray-700 rounded-lg flex flex-col items-center justify-between p-2 w-full mt-2 mx-auto">
                    {todaysEvents.map((event: Event, index) => (
                        <TouchableOpacity
                            onPress={() => {
                                router.push({
                                    pathname: '/events/[id]',
                                    params: { id: event.id },
                                });
                            }}
                            key={event.id}
                            className={`mb-2 ${
                                index === todaysEvents.length - 1
                                    ? 'pb-0'
                                    : 'border-b pb-2'
                            }  border-gray-700 flex flex-row justify-between w-full items-center`}
                        >
                            <View>
                                <Text className="text-lg text-white font-satoshi">
                                    {event.title}
                                </Text>
                            </View>
                            {event.latestLogDate &&
                            event.latestLogDate ===
                                moment().format('YYYY-MM-DD') ? (
                                <AntDesign
                                    name="checkcircleo"
                                    size={24}
                                    color="#22c55e"
                                />
                            ) : (
                                <Entypo
                                    className="hover:translate-x-2 transition-all duration-150 ease-in-out -my-2"
                                    name="chevron-right"
                                    size={32}
                                    color="#FF6B00"
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <View>
                    <Text className="text-white/80 font-satoshi text-lg">
                        You have nothing scheduled for today
                    </Text>
                </View>
            )}
        </View>
    );
}
