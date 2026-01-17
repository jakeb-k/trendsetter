import { Text, TextInput, View } from 'react-native';

export default function CreateGoalForm() {
    return (
        <View className='my-4'>
            <Text className="text-lg font-satoshi text-white">Title</Text>
            <TextInput
                value={''}
                textAlignVertical="top"
                placeholder="Enter Title..."
                placeholderTextColor="#ccc"
                // onChangeText={(text) =>
                //     setNewEvent({ ...newEvent, title: text })
                // }
                className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mt-2 mb-4 mr-2"
            />
        </View>
    );
}
