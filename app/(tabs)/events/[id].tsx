import { ThemedView } from "@/components/ThemedView";
import { useEventsStore } from "@/stores/useEventStore";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";

export default function EventDetailLayout() {
    const { id } = useLocalSearchParams();
    const { events } = useEventsStore();

    const [event, setEvent] = useState(events.find((event) => event.id.toString() === id) || {});
    console.log(event); 

    return (
        // <Stack>
        //     <Stack.Screen
        //         name="events-detail"
        //         options={{
        //             headerShown: false, 
        //         }}
        //     />
        // </Stack>

        <ThemedView className="min-h-screen w-full px-4">
            <Text className="text-white text-2xl font-bold">
                Event Details ID: {id}
            </Text>
        </ThemedView>
    );

}