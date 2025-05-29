import { sendAiChatRequest } from '@/api/aiChatApi';
import MessageBubble from '@/components/ai-chat/MessageBubble';
import { ThemedView } from '@/components/ThemedView';
import Message from '@/types/models/Message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([
        {
            content: `Hey, I'm Forge. I'm here to help you stop thinking about your goals and actually hit them.

To do that, I need to know exactly what you're aiming for.

Be specific. Don't just say “get fit” or “make money”. Tell me what, how much, and by when—the clearer you are, the sharper I can make the plan.

So…
What's the goal you're chasing right now?`,
            sender: 'bot',
        },
        // { content: 'I want to improve my coding skills.', sender: 'user' },
    ]);
    const [loading, setLoading] = useState(false); 
    const [newMessage, setNewMessage] = useState<string>('');
    const [goalDescription, setGoalDescription] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSendMessage = async () => {
        if(!goalDescription){
            setGoalDescription(newMessage);
        }
        setLoading(true);
        setMessages((prevMessages) => (
            [...prevMessages, {content: newMessage, sender: "user"}]
        ))
        setNewMessage(''); 
        const payload = {
            goalDescription: goalDescription!,
            context: messages, 
        }
        try {
            const response = await sendAiChatRequest(payload);

            if (!response.error) {
                console.log(response); 
                // router.replace('/'); // go to index page, replacing login
            } else {
                setError('There was an error logging in. Please try again later.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unexpected error. Please try again later.');
        }
    }

    return (
        <ThemedView className=" pt-6 px-4 h-full relative">
            <ScrollView className="space-y-4 pb-32">
                {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                ))}
            </ScrollView>
            <View className="absolute bottom-4 w-11/12">
                <TextInput
                    placeholder="Type your message..."
                    placeholderTextColor="#ccc"
                    onChangeText={setNewMessage}
                    onSubmitEditing={handleSendMessage}
                    className="bg-white/10 text-white px-4 py-3 rounded-xl mb-4 w-full"
                />
                <FontAwesome
                    name="microphone"
                    size={24}
                    color="#FF6B00"
                    className="absolute right-4 top-3"
                />
            </View>
        </ThemedView>
    );
}
