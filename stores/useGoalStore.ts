import Goal from '@/types/models/Goal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'expo-zustand-persist';
import { create } from 'zustand';

interface GoalsStore {
    goals: Goal[];
    setGoals: (newGoals: Goal[]) => void;
}

export const useGoalsStore = create<GoalsStore>()(
    persist(
        (set) => ({
            goals: [],
            setGoals: (newGoals) => set({ goals: newGoals }),
        }),
        {
            name: 'Goals-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
