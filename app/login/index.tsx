import { sendLoginRequest } from '@/api/authApi';
import PrimaryButton from '@/components/common/PrimaryButton';
import { useEventsStore } from '@/stores/useEventStore';
import { useGoalsStore } from '@/stores/useGoalStore';
import Goal from '@/types/models/Goal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
export default function LoginScreen() {
    const [loginDetails, setLoginDetails] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<any | null>(null);
    const handleOnChange = (key: string, value: string) => {
        setLoginDetails((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    const [loading, setLoading] = useState(false);

    const { setEvents } = useEventsStore();
    const { setGoals } = useGoalsStore();

    const handleLogin = async () => {
        if (
            loginDetails.email === '' ||
            !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(loginDetails.email)
        ) {
            setError({
                message: 'That email looks a bit funny, try again.',
            });
            return;
        } else if (loginDetails.password === '') {
            setError({
                message: 'Probably need to enter a password',
            });
            return;
        }
        sendLoginRequest(loginDetails)
            .then(async (response) => {
                const events = response.goals.flatMap(
                    (goal: Goal) => goal.events
                );
                setEvents(events);
                setGoals(response.goals);
                await AsyncStorage.setItem('token', response.token);
                await AsyncStorage.setItem(
                    'user',
                    JSON.stringify(response.user)
                );
                router.push('/');
            })
            .catch((error) => {
                console.error(error);
                setError({
                    ...error.response.data,
                    message: 'I think you need to create an account...',
                });
            });
    };

    return (
        <View className="absolute top-1/2 -translate-y-56 left-1/2 -translate-x-1/2 w-5/6">
            <Text className="text-white font-satoshi font-bold text-2xl text-center mb-2">
                Welcome Back
            </Text>
            <Text className="text-white/80 text-lg font-satoshi text-center mb-6">
                Time to level up. Let's get it!
            </Text>
            <TextInput
                placeholder="Email"
                placeholderTextColor="#ccc"
                onChange={(e) => handleOnChange('email', e.nativeEvent.text)}
                className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl border-2 border-primary rounded-xl mb-6"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="#ccc"
                onChange={(e) => handleOnChange('password', e.nativeEvent.text)}
                className="bg-white/10 text-white px-4 py-3 backdrop-blur-xl border-2 border-primary rounded-xl mb-6"
                secureTextEntry
            />

            <PrimaryButton onPress={handleLogin}>
                <Text className="text-white text-center font-satoshi text-lg font-bold">
                    Login
                </Text>
            </PrimaryButton>
            {error && (
                <View className="rounded-xl backdrop-blur-xl bg-red-200/20 mt-4 p-4">
                    <Text className="text-red-600 text-center font-satoshi text-lg font-bold">
                        {error.message}
                    </Text>
                </View>
            )}
            <View className="flex flex-row items-center justify-center mt-12 space-x-4">
                <Text className="text-white/80 text-lg font-satoshi text-center">
                    Don't have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Text className="text-primary text-lg font-satoshi">
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
