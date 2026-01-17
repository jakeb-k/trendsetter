import Entypo from '@expo/vector-icons/Entypo';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateGoalForm() {
    const [newGoal, setNewGoal] = useState({
        title: '',
        end_date: new Date(),
        description: '',
    });
    const [mode, setMode] = useState<any>('date');
    const [show, setShow] = useState(false);

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
    return (
        <View className="flex flex-col space-y-2 my-4">
            <View>
                <Text className="text-md font-satoshi text-white">Title</Text>
                <TextInput
                    value={''}
                    textAlignVertical="top"
                    placeholder="Enter Title..."
                    placeholderTextColor="#ccc"
                    onChangeText={(text) =>
                        setNewGoal({ ...newGoal, title: text })
                    }
                    className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                />
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
                            className='ml-2 mt-2'
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
        </View>
    );
}
