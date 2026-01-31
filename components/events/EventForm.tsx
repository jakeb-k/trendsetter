import { storeEvent } from '@/api/eventsApi';
import { useEventsStore } from '@/stores/useEventStore';
import { useGoalsStore } from '@/stores/useGoalStore';
import Event from '@/types/models/Event';
import Goal from '@/types/models/Goal';
import { EventRequest } from '@/types/requests/EventsRequest';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import TitleText from '../common/TitleText';

type EventFormProps = {
    event?: Event;
    isSubmitting: boolean;
    closeForm?: () => void;
    resetSubmitting: () => void;
    setSuccess: () => void;
};

export default function EventForm({
    event,
    isSubmitting,
    closeForm,
    resetSubmitting,
    setSuccess,
}: EventFormProps) {
    const { setEvents, events } = useEventsStore();
    const { goals } = useGoalsStore();

    const [newEvent, setNewEvent] = useState<EventRequest>({
        goal_id: goals[0].id,
        title: '',
        description: '',
        frequency: 'weekly',
        times_per_week: 1,
        duration_in_weeks: 4,
        start_date: new Date(),
    });
    const [mode, setMode] = useState<any>('date');
    const [show, setShow] = useState(false);

    //@todo fix this
    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        setNewEvent((prev) => ({
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

    useEffect(() => {
        async function handleEventRequest() {
            storeEvent(newEvent)
                .then((response) => {
                    //@ts-ignore
                    setEvents([...events, response as Event]);
                    setSuccess();
                })
                .catch((error) => {
                    resetSubmitting();
                    console.error(error);
                })
                .finally(() => {});
        }

        if (isSubmitting) {
            handleEventRequest();
        }
    }, [isSubmitting]);

    return (
        <View className="my-4 border-2 border-primary shadow-lg shadow-primary rounded-lg p-2 px-4 relative space-y-2">
            <TouchableOpacity
                className="absolute top-4 right-4 z-50"
                onPress={closeForm}
            >
                <AntDesign name={'closecircleo'} size={24} color="white" />
            </TouchableOpacity>
            <TitleText title="New Event" />
            <View>
                <Text className="text-lg font-satoshi text-white mt-2">
                    Goal
                </Text>
                <View className="bg-white/10 px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2 text-primary text-md">
                    <Picker
                        selectedValue={newEvent.goal_id}
                        onValueChange={(itemValue) =>
                            setNewEvent((prev) => ({
                                ...prev,
                                goal_id: itemValue,
                            }))
                        }
                        dropdownIconColor="white" // for Android
                        style={{
                            backgroundColor: 'transparent',
                            color: '',
                        }}
                    >
                        {goals.map((goal: Goal) => (
                            <Picker.Item
                                key={goal.id}
                                label={goal.title}
                                value={goal.id}
                            />
                        ))}
                    </Picker>
                </View>
            </View>
            <View>
                <Text className="text-lg font-satoshi text-white">Title</Text>
                <TextInput
                    value={newEvent.title}
                    textAlignVertical="top"
                    placeholder="Enter Title..."
                    placeholderTextColor="#ccc"
                    onChangeText={(text) =>
                        setNewEvent({ ...newEvent, title: text })
                    }
                    className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                />
            </View>
            <View>
                <Text className="text-lg font-satoshi text-white">
                    Description
                </Text>
                <TextInput
                    multiline={true}
                    value={newEvent.description}
                    textAlignVertical="top"
                    placeholder="Add any notes..."
                    placeholderTextColor="#ccc"
                    style={{ maxHeight: 240 }}
                    onChangeText={(text) =>
                        setNewEvent({ ...newEvent, description: text })
                    }
                    className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                />
            </View>
            <Text className="text-lg font-satoshi text-white">Repeat</Text>
            <View className="flex flex-row items-center space-x-4 pb-2">
                <View className="flex flex-row space-x-2 items-center">
                    <View
                        className={`rounded-full border p-1 ${
                            newEvent.frequency === 'weekly'
                                ? 'border-primary'
                                : ' border-white'
                        }`}
                    >
                        <TouchableOpacity
                            className={`rounded-full border p-2 ${
                                newEvent.frequency === 'weekly'
                                    ? 'bg-primary border-primary'
                                    : 'bg-transparent'
                            }`}
                            onPress={() =>
                                setNewEvent({
                                    ...newEvent,
                                    frequency: 'weekly',
                                })
                            }
                        />
                    </View>
                    <Text className="text-lg font-satoshi text-white">
                        Weekly
                    </Text>
                </View>
                <View className="flex flex-row space-x-2 items-center">
                    <View
                        className={`rounded-full border p-1 ${
                            newEvent.frequency === 'monthly'
                                ? 'border-primary'
                                : ' border-white'
                        }`}
                    >
                        <TouchableOpacity
                            className={`rounded-full border p-2 ${
                                newEvent.frequency === 'monthly'
                                    ? 'bg-primary border-primary'
                                    : 'bg-transparent'
                            }`}
                            onPress={() =>
                                setNewEvent({
                                    ...newEvent,
                                    frequency: 'monthly',
                                })
                            }
                        />
                    </View>
                    <Text className="text-lg font-satoshi text-white">
                        Monthly
                    </Text>
                </View>
            </View>
            <View className="flex flex-row justify-between space-x-2">
                <View className="w-[47.5%]">
                    <Text className="text-lg font-satoshi text-white mt-3">
                        Frequency
                    </Text>
                    <TextInput
                        keyboardType="numeric"
                        value={newEvent.times_per_week.toString()}
                        textAlignVertical="top"
                        placeholder=""
                        placeholderTextColor="#ccc"
                        onChangeText={(text) =>
                            setNewEvent({
                                ...newEvent,
                                times_per_week: Number(text),
                            })
                        }
                        className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                    />
                </View>
                <View className="w-[47.5%]">
                    <Text className="text-lg font-satoshi text-white mt-3">
                        Duration (weeks)
                    </Text>
                    <TextInput
                        keyboardType="numeric"
                        value={newEvent.duration_in_weeks.toString()}
                        textAlignVertical="top"
                        placeholder="Add any notes..."
                        placeholderTextColor="#ccc"
                        onChangeText={(text) =>
                            setNewEvent({
                                ...newEvent,
                                duration_in_weeks: Number(text),
                            })
                        }
                        className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                    />
                </View>
            </View>
            <View>
                <Text className="text-lg font-satoshi text-white">
                    Start Date
                </Text>
                <TouchableOpacity
                    onPress={showDatepicker}
                    className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                >
                    <Text className="text-lg font-satoshi text-white">
                        Select Date
                    </Text>
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={newEvent.start_date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                    />
                )}
            </View>
        </View>
    );
}
