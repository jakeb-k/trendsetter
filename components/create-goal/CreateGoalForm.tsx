import { storeGoal } from '@/api/goalsApi';
import { useGoalsStore } from '@/stores/useGoalStore';
import Goal from '@/types/models/Goal';
import Entypo from '@expo/vector-icons/Entypo';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../common/PrimaryButton';

type Props = {
    passNewGoal: (goal: Goal) => void;
};

export default function CreateGoalForm({ passNewGoal }: Props) {
    const { updateGoals } = useGoalsStore();

    //@todo - set date to null to have actual validation
    const [newGoal, setNewGoal] = useState({
        title: '',
        end_date: new Date(),
        description: '',
    });
    const [mode, setMode] = useState<any>('date');
    const [show, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    //@todo fix this
    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        setNewGoal((prev) => ({
            ...prev,
            start_date: currentDate ? currentDate : new Date(),
        }));
    };

    const showMode = (currentMode: any) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const validateNewGoalRequest = async () => {
        setSubmitting(true);
        const error = validateGoal();
        if (error) {
            setError(error);
        } else {
            await handleNewGoalRequest();
        }
        setSubmitting(false);
    };

    async function handleNewGoalRequest() {
        storeGoal(newGoal)
            .then((response) => {
                updateGoals(response.goal);
                setError(null);
                passNewGoal(response.goal);
            })
            .catch((error) => {
                setError('Unable to create goal, try again in a few seconds!');
                console.error(error);
            });
    }

    const validateGoal = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!newGoal.title.trim()) {
            return 'You gotta name the mission.';
        }

        if (newGoal.title.length > 80) {
            return "That title's doing too much. Shorten it.";
        }

        if (!newGoal.description.trim()) {
            return 'Why does this matter? Give it a reason.';
        }
        if (!newGoal.end_date) {
            return 'Deadlines matter. Pick one.';
        } else {
            const endDate = new Date(newGoal.end_date);
            endDate.setHours(0, 0, 0, 0);

            if (endDate < today) {
                return "Unless you've got a time machine, pick a future date.";
            }
        }
    };

    return (
        <View className="flex flex-col space-y-2 my-4">
            <View>
                <Text className="text-md font-satoshi text-white">Title</Text>
                <TextInput
                    value={newGoal.title}
                    textAlignVertical="top"
                    placeholder="Name the mission"
                    placeholderTextColor="#ccc"
                    onChangeText={(text) =>
                        setNewGoal({ ...newGoal, title: text })
                    }
                    className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                />
                <Text className="text-white/50 font-satoshi my-1 tracking-wide">
                    Be specific. Your future self reads this.
                </Text>
            </View>
            <View className="mt-2 h-[1px] w-full bg-secondary" />
            <View>
                <Text className="text-md font-satoshi text-white">
                    Start Date
                </Text>
                <TouchableOpacity
                    onPress={showDatepicker}
                    className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                >
                    <View className="flex flex-row justify-between">
                        <Text className="text-l font-satoshi text-white">
                            End Date
                        </Text>
                        <Text className="text-l font-satoshi text-white/50 flex-row items-center ">
                            Pick a deadline{' '}
                            <Entypo
                                className="ml-2 mt-2"
                                name="chevron-thin-right"
                                size={16}
                                color="rgba(255,255,255,0.5)"
                            />
                        </Text>
                    </View>
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={newGoal.end_date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                    />
                )}
            </View>
            <View className="mt-2 h-[1px] w-full bg-secondary" />
            <View>
                <Text className="text-md font-satoshi text-white">
                    Why this matters
                </Text>
                <TextInput
                    multiline={true}
                    value={newGoal.description}
                    textAlignVertical="top"
                    placeholder="Outcome, purpose, stakes..."
                    placeholderTextColor="#ccc"
                    style={{ minHeight: 140, maxHeight: 240 }}
                    onChangeText={(text) =>
                        setNewGoal({ ...newGoal, description: text })
                    }
                    className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                />
            </View>
            <PrimaryButton
                className="relative"
                onPress={validateNewGoalRequest}
            >
                <Text className="font-satoshi text-center text-white font-bold text-lg">
                    Create Goal
                </Text>
                {submitting && (
                    <View className="animate-spin absolute right-1/4 border-t-2 border-r-2 top-2 rounded-full border-white size-6"></View>
                )}
            </PrimaryButton>
            <View className="mt-12"></View>
            {error && (
                <View className="rounded-xl backdrop-blur-xl bg-red-200/20 mt-4 p-4">
                    <Text className="text-red-600 text-center font-satoshi text-lg font-bold">
                        {error}
                    </Text>
                </View>
            )}
        </View>
    );
}
