import { sendLoginRequest } from '@/api/aiChatApi';
import PrimaryButton from '@/components/common/PrimaryButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
    const [loginDetails, setLoginDetails] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const handleOnChange = (key: string, value: string) => {
        setLoginDetails((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleLogin = async () => {
        try {
            const response = await sendLoginRequest(loginDetails);

            if (!response.error) {
                await AsyncStorage.setItem('token', response.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.user));
                router.replace('/'); // go to index page, replacing login
            } else {
                setError('There was an error logging in. Please try again later.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unexpected error. Please try again later.');
        }
    };

    return (
        <ImageBackground
            className="flex-1 justify-center items-center min-h-screen min-w-screen"
            source={require('@/assets/images/orange_rectangle_bg.png')}
        >
            <View className="rounded-lg bg-white/70 p-8 my-auto m-auto min-h-1/2 mt-32 w-5/6">
                <Text className="text-black text-2xl mb-6 text-center">Welcome!</Text>

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                    className="bg-white/90 text-black px-4 py-3 rounded-xl mb-4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#ccc"
                    className="bg-white/90 text-black px-4 py-3 rounded-xl mb-4"
                    secureTextEntry
                />

                <PrimaryButton onPress={handleLogin}>
                    <Text className="text-white text-lg text-center">Login</Text>
                </PrimaryButton>
            </View>
        </ImageBackground>
    );
}
