import Message from '@/types/models/Message';
import { Text, View } from 'react-native';

export default function MessageBubble({ message }: { message: Message }) {
    return (
        <View
            className={`flex flex-row items-center ${
                message.sender === 'bot'
                    ? 'pr-12'
                    : 'pl-12 flex-row-reverse ml-auto'
            }`}
        >
            <Text
                className={`${
                    message.sender === 'bot' ? 'bg-gray-700' : 'bg-primary'
                } text-white px-4 py-2 rounded-lg text-lg font-satoshi`}
            >
                {message.content}
            </Text>
        </View>
    );
}
