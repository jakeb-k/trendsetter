import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Forge',
                    headerTitleAlign: 'center', 
                    headerStyle: { backgroundColor: '#FF6B00' },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontFamily: 'Satoshi',
                        color: '#fff',
                        fontSize: 24,
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}
