import Goal from '@/types/models/Goal';
import { calculateCompletionPercentage } from '@/utils/scheduleHandler';
import { Href, Link, router } from 'expo-router';
import moment from 'moment';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CurrentGoals({ goals }: { goals: Goal[] }) {
    const activeGoals = goals.filter((goal) => goal.status !== 'completed');
    return (
        <View className="my-2">
            <View className="flex flex-row justify-between">
                <Text className="text-[#F5F5F5] font-semibold text-lg ml-1">
                    Current Goals
                </Text>
                <View className="flex flex-row space-x-2">
                    {/* @ts-ignore */}
                    <Link
                        href={'/completed-goals'}
                        className="rounded-lg bg-white/10 px-2 py-1"
                    >
                        <Text className="text-white font-semibold font-satoshi">
                            COMPLETED
                        </Text>
                    </Link>
                    {/* @ts-ignore */}
                    <Link
                        href={'/create-goal'}
                        className="rounded-lg bg-primary px-2 py-1"
                    >
                        <Text className="text-white font-semibold font-satoshi">
                            ADD NEW
                        </Text>
                    </Link>
                </View>
            </View>
            {activeGoals.length > 0 ? (
                activeGoals.map((goal: Goal) => (
                    <TouchableOpacity
                        key={goal.id}
                        onPress={() => {
                            const href = {
                                pathname: '/goals/[id]',
                                params: { id: String(goal.id) },
                            } as const;

                            router.push(href as Href);
                        }}
                        className="bg-[#1A1A1A] drop-shadow-md rounded-lg p-2 mt-2"
                    >
                        <View className="flex flex-row justify-between">
                            <Text className="text-[#F5F5F5] font-semibold text-base w-3/4">
                                {goal.title}
                            </Text>
                            <Text className="text-[#F5F5F5] font-semibold text-base w-1/4 text-nowrap">
                                {moment(goal.end_date).format('Do MMM')}
                            </Text>
                        </View>
                        <View className="relative my-2">
                            <View className="bg-[#2C2C2C] rounded-xl w-full h-4"></View>
                            <View
                                className={`bg-primary rounded-xl absolute h-4`}
                                style={{
                                    width: `${calculateCompletionPercentage(
                                        goal.start_date,
                                        goal.end_date,
                                    )}%`,
                                }}
                            ></View>
                        </View>
                        <View className="flex flex-row justify-between">
                            <Text className="text-lightprimary font-semibold text-base"></Text>
                            <Text className="text-lightprimary font-semibold text-base">
                                225 points
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View className="p-2">
                    <Text className="text-white/80 font-satoshi text-lg">
                        You haven't set any goals yet - have a chat with{' '}
                        <TouchableOpacity>
                            <Text className="text-primary font-satoshi text-lg">
                                Forge
                            </Text>
                        </TouchableOpacity>{' '}
                        to change that
                    </Text>
                </View>
            )}
        </View>
    );
}
