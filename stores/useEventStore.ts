import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'expo-zustand-persist';
import { create } from 'zustand';
interface Event {
    id: number;
    title: string;
    description: string;
    repeat?: {
        frequency: string;
        duration_of_weeks: number;
    };
    scheduled_for: Date;
    completed_at: Date | null;
    points: number;
}

interface EventsStore {
    events: Event[];
    setEvents: (newEvents: Event[]) => void;
}

export const useEventsStore = create<EventsStore>()(
    persist(
        (set) => ({
            events: [],
            setEvents: (newEvents) => set({ events: newEvents }),
        }),
        {
            name: 'events-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
