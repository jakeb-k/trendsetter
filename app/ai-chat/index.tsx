import { sendAiChatRequest } from '@/api/aiChatApi';
import MessageBubble from '@/components/ai-chat/MessageBubble';
import DotSpinner from '@/components/common/DotSpinner';
import { ThemedView } from '@/components/ThemedView';
import Message from '@/types/models/Message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        let firstGoalMessage = null; 
        if (!goalDescription) {
            firstGoalMessage = newMessage; 
            setGoalDescription(newMessage);
        }
        setLoading(true);
        setMessages((prevMessages) => [
            ...prevMessages,
            { content: newMessage, sender: 'user' },
        ]);
        setNewMessage('');
        const payload = {
            goal_description: firstGoalMessage ? firstGoalMessage : goalDescription!,
            context: [...messages, { content: newMessage, sender: 'user' }],
        };

        try {
            const response = await sendAiChatRequest(payload);

            if (!response.error) {
                if(!response.finished){
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { content: response.message, sender: 'bot' },
                    ]);
                }
                console.log(response);
                setLoading(false);
                // router.replace('/'); // go to index page, replacing login
            } else {
                setError(
                    'There was an error logging in. Please try again later.'
                );
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unexpected error. Please try again later.');
        }
    };

    return (
        <ThemedView className=" pt-6 px-4 h-full relative">
            
            <TouchableOpacity className='bg-white/10 w-fit rounded-xl p-2 mb-4' onPress={handleSendMessage}>
                <Text className='text-primary'>SEND</Text>
            </TouchableOpacity>
            <ScrollView className="space-y-4 pb-32">
                {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                ))}

                {loading && <DotSpinner />}
            </ScrollView>
            <View className="absolute bottom-4 w-full backdrop-blur-xl">
                <TextInput
                    multiline={true}
                    value={newMessage}
                    textAlignVertical='top'
                    editable={!loading}
                    placeholder="Type your message..."
                    placeholderTextColor="#ccc"
                    style={{ maxHeight: 120 }}
                    onChangeText={setNewMessage}
                    onSubmitEditing={handleSendMessage}
                    className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl rounded-xl mb-4 w-11/12 pr-10"
                />
                <FontAwesome
                    name="microphone"
                    size={24}
                    color="#FF6B00"
                    className="absolute right-12 top-4"
                />
            </View>
        </ThemedView>
    );
}
