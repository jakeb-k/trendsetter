import Goal from '@/types/models/Goal';
import { calculateCompletionPercentage } from '@/utils/scheduleHandler';
import moment from 'moment';
import { Text, View } from 'react-native';

export default function CurrentGoals({ goals }: { goals: Goal[] }) {
    return (
        <View className="mb-2">
            <Text className="text-[#8B3C00] font-semibold text-lg ml-1">
                Current Goals
            </Text>
            {goals.map((goal: Goal) => (
                <View key={goal.id} className="bg-[#FDF7E8] drop-shadow-md rounded-lg p-2 mt-2">
                    <View className="flex flex-row justify-between">
                        <Text className="text-[#8B3C00] font-semibold text-base w-3/4">
                            {goal.title}
                        </Text>
                        <Text className="text-[#8B3C00] font-semibold text-base w-1/4 text-nowrap">
                            {moment(goal.end_date).format('Do MMM')}
                        </Text>
                    </View>
                    <View className="relative my-2">
                        <View className="bg-gray-200 rounded-xl w-full h-4"></View>
                        <View
                            className={`bg-primary rounded-xl absolute h-4`}
                            style={{ width: `${calculateCompletionPercentage(goal.start_date, goal.end_date)}%` }}
                        ></View>
                    </View>
                    <View className="flex flex-row justify-between">
                        <Text className="text-lightprimary font-semibold text-base">
                            5-day streak
                        </Text>
                        <Text className="text-lightprimary font-semibold text-base">
                            225 points
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}
