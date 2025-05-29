import Config from '@/constants/Config';
import { AiChatRequest } from '@/types/requests/AiChatRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';


export async function sendAiChatRequest(payload: AiChatRequest) {
    try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.post(
            `${Config.API_URL}/ai-plan/chat`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err) {
        console.error('AI Chat request failed:', err);
        return { error: true, message: err || 'Unknown error' };
    }
}
