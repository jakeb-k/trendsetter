import { Text, View } from 'react-native';

export default function CurrentGoal() {
    const progressPercentage = 30;
    return (
        <View className="">
            <Text className="text-[#8B3C00] font-semibold text-lg">Current Goal</Text>
            <View className="bg-[#FDF7E8] drop-shadow-md rounded-lg p-2 mt-2">
                <View className="flex flex-row justify-between">
                    <Text className="text-[#8B3C00] font-semibold text-lg">
                        Improve Golf Score
                    </Text>
                    <Text className="text-[#8B3C00] font-semibold text-lg">30%</Text>
                </View>
                <View className="relative my-2">
                    <View className="bg-gray-200 rounded-xl w-full h-4"></View>
                    <View
                        className={`bg-primary rounded-xl absolute h-4`}
                        style={{ width: `${progressPercentage}%` }}
                    ></View>
                </View>
                <View className='flex flex-row justify-between'>
                    <Text className='text-lightprimary font-semibold text-base'>5-day streak</Text>
                    <Text className='text-lightprimary font-semibold text-base'>225 points</Text>
                </View>
            </View>
        </View>
    );
}
