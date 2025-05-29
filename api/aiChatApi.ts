import Config from '@/constants/Config';
import { AiChatRequest } from '@/types/requests/AiChatRequest';

import axios from 'axios';

export async function sendAiChatRequest(payload: AiChatRequest) {
    try {
        const res = await axios.post(`${Config.API_URL}/ai-plan/chat`, payload);
        return res.data;
    } catch (err) {
        console.error('AI Chat request failed:', err);
        return { error: true, message: err };
    }
}
