import Goal from '@/types/models/Goal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'expo-zustand-persist';
import { create } from 'zustand';

interface GoalsStore {
    goals: Goal[];
    completedGoals: Goal[];
    setGoals: (newGoals: Goal[]) => void;
    setCompletedGoals: (newGoals: Goal[]) => void;
    replaceGoal: (updatedGoal: Goal) => void;
    updateGoals: (newGoal: Goal) => void;
}

export const useGoalsStore = create<GoalsStore>()(
    persist(
        (set) => ({
            goals: [],
            completedGoals: [],
            setGoals: (newGoals) => set({ goals: newGoals }),
            setCompletedGoals: (newGoals) => set({ completedGoals: newGoals }),
            replaceGoal: (updatedGoal) =>
                set((state) => ({
                    goals: state.goals.map((goal) =>
                        goal.id === updatedGoal.id ? updatedGoal : goal
                    ),
                })),
            updateGoals: (newGoal) =>
                set((state) => ({
                    goals: [...state.goals, newGoal],
                })),
        }),
        {
            name: 'Goals-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
