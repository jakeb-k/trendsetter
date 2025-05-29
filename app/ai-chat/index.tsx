import MessageBubble from '@/components/ai-chat/MessageBubble';
import { ThemedView } from '@/components/ThemedView';
import Message from '@/types/models/Message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([
        {
            content:
                'Hey, my name is Forge. Lets set some goals! What do you want to acheive?',
            sender: 'bot',
        },
        { content: 'I want to improve my coding skills.', sender: 'user' },
    ]);
    const [newMessage, setNewMessage] = useState<string>('');
    return (
        <ThemedView className="space-y-4 pt-6 px-4 h-full relative">
            {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
            ))}
            <View className="absolute bottom-4 w-11/12">

            <TextInput
                placeholder="Type your message..."
                placeholderTextColor="#ccc"
                onChangeText={setNewMessage}
                className="bg-white/10 text-white px-4 py-3 rounded-xl mb-4 w-full"
            />
            <FontAwesome name="microphone" size={24} color="#FF6B00" className="absolute right-4 top-3" />
            </View>
        </ThemedView>
    );
}
