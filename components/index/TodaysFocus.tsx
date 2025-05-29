import AntDesign from '@expo/vector-icons/AntDesign';
import { Text, View } from 'react-native';

export default function TodaysFocus() {
    return (
        <View
            className="bg-primary rounded-lg mb-2 mt-6 py-4 px-4 "
        >
            <Text className="text-white font-satoshi text-xl">Today's Focus</Text>
            <View className="bg-[#FF8F19] rounded-lg flex flex-row items-center justify-between p-2 w-full mt-2 mx-auto">
                <View>
                    <Text className='text-lg text-white font-satoshi'>Practice putting drills</Text>
                    <Text className='text-sm text-white font-satoshi'>9:00 AM</Text>
                </View>
                <AntDesign name="checkcircle" size={24} color="white" />
            </View>
        </View>
    );
}
