import Event from '@/types/models/Event';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import TitleText from '../common/TitleText';

export default function EventForm(event?: Event) {
    const [newEvent, setNewEvent] = useState({
        goal_id: null,
        title: '',
        description: '',
        frequency: '',
        times_per_week: 0,
        duration_in_weeks: 0,
        start_date: new Date(),
    });

    return (
        <View className="my-4 border-2 border-primary shadow-lg shadow-primary rounded-lg p-2 relative space-y-2">
            <TitleText title="New Event" />
            <View>
                <Text className="text-lg font-satoshi text-white mt-2">
                    Goal
                </Text>
                <Picker
                    selectedValue={newEvent.goal_id}
                    onValueChange={(itemValue) =>
                        setNewEvent((prev) => ({ ...prev, goal_id: itemValue }))
                    }
                >
                    <Picker.Item label="Become Better At Golf" value="1" />
                    <Picker.Item
                        label="Become Better At Programming"
                        value="2"
                    />
                </Picker>
            </View>
            <View>
                <Text className="text-lg font-satoshi text-white mt-2">
                    Title
                </Text>
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
                <Text className="text-lg font-satoshi text-white mt-2">
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
            <View className="flex flex-row items-center space-x-4">
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
                        Times Per Week
                    </Text>
                    <TextInput
                        keyboardType="numeric"
                        value={newEvent.times_per_week.toString()}
                        textAlignVertical="top"
                        placeholder=""
                        placeholderTextColor="#ccc"
                        onChangeText={(text) =>
                            setNewEvent({ ...newEvent, times_per_week: Number(text) })
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
                            setNewEvent({ ...newEvent, duration_in_weeks: Number(text) })
                        }
                        className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
                    />
                </View>
            </View>
        </View>
    );
}
