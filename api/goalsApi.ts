import Config from '@/constants/Config';
import { GoalRequest } from '@/types/requests/GoalsRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import { router } from 'expo-router';

export async function getGoals() {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            router.navigate('/login');
        }
        const res = await axios.get(`${Config.API_URL}/goals`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error('Cannot get goals:', err);
        return { error: true, message: err || 'Unknown error' };
    }
}

export async function getGoalFeedbackHistory(goalID: string) {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            router.navigate('/login');
        }
        const res = await axios.get(
            `${Config.API_URL}/goals/${goalID}/feedback`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return res.data;
    } catch (err) {
        console.error('Goal Feedback History request failed:', err);
        return { error: true, message: err || 'Unknown error' };
    }
}

export async function storeGoal(
    payload: GoalRequest,
) {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            router.navigate('/login');
        }
        const res = await axios.post(
            `${Config.API_URL}/goals/`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return res.data;
    } catch (err) {
        console.error('Goal create request failed:', err);
        return { error: true, message: err || 'Unknown error' };
    }
}
