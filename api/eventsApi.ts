import Config from '@/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';


export async function getEventFeedbackHistory(eventID: string) {
    try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(
            `${Config.API_URL}/events/${eventID}/feedback`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err) {
        console.error('Event Feedback History request failed:', err);
        return { error: true, message: err || 'Unknown error' };
    }
}
