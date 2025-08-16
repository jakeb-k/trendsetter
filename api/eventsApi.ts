import Config from '@/constants/Config';
import { EventFeedbackRequest } from '@/types/requests/EventsRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import { router } from 'expo-router';

export async function getEventFeedbackHistory(eventID: string) {
    try {
        const token = await AsyncStorage.getItem('token');
        if(!token){
            router.navigate('/login')
        }
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

export async function storeEventFeedback(payload: EventFeedbackRequest, eventID: string) {
    try {
        const token = await AsyncStorage.getItem('token');
        if(!token){
            router.navigate('/login')
        }
        const res = await axios.post(
            `${Config.API_URL}/events/${eventID}/feedback`,
            payload,
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
