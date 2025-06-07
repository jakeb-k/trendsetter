import { sendAiChatRequest } from '@/api/aiChatApi';
import MessageBubble from '@/components/ai-chat/MessageBubble';
import PrimaryButton from '@/components/common/PrimaryButton';
import TypingLoader from '@/components/common/TypingLoader';
import { ThemedView } from '@/components/ThemedView';
import Message from '@/types/models/Message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View
} from 'react-native';

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
    ]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [goalDescription, setGoalDescription] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [finished, setFinished] = useState(false);

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
            goal_description: firstGoalMessage
                ? firstGoalMessage
                : goalDescription!,
            context: [...messages, { content: newMessage, sender: 'user' }],
        };

        try {
            const response = await sendAiChatRequest(payload);

            if (!response.error) {
                if (!response.finished) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { content: response.message, sender: 'bot' },
                    ]);
                } else {
                    const finishedMessage = `Alright — your plan's forged 🔥

Every step is built to push you forward. Check your calendar, lock in your focus, and let's get to work.`;

                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { content: finishedMessage, sender: 'bot' },
                    ]);

                    // Persisting to AsyncStorage
                    try {
                        await AsyncStorage.setItem(
                            'events',
                            JSON.stringify(response.events)
                        );
                        await AsyncStorage.setItem(
                            'ai_plan',
                            JSON.stringify(response.ai_plan)
                        );
                        await AsyncStorage.setItem(
                            'goal',
                            JSON.stringify(response.goal)
                        );
                        setFinished(true)
                    } catch (error) {
                        console.error('AsyncStorage write failed:', error);
                    }
                    //grab the events and add them to the session storage - need zustand persistence here.
                }
                console.log(response);
                setLoading(false);
                //  // go to index page, replacing login
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
            {/* <TouchableOpacity
                className="bg-white/10 w-fit rounded-xl p-2 mb-4"
                onPress={handleSendMessage}
            >
                <Text className="text-primary">SEND</Text>
            </TouchableOpacity> */}
            <ScrollView className="space-y-4 pb-32">
                {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                ))}

                {loading && <TypingLoader />}
                {finished && (
                    <PrimaryButton onPress={() => router.navigate('/')}>
                        <Text className='font-satoshi text-center text-white font-bold text-lg '>Let's Go!</Text>
                    </PrimaryButton>
                )}
            </ScrollView>
            <View className="absolute bottom-0 pt-6 rounded-t-lg w-full backdrop-blur-xl">
                <TextInput
                    multiline={true}
                    value={newMessage}
                    textAlignVertical="top"
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
                    className="absolute right-12 top-12"
                />
            </View>
        </ThemedView>
    );
}
