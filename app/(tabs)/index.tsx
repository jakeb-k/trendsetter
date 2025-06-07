import CurrentGoal from '@/components/index/CurrentGoal';
import TodaysFocus from '@/components/index/TodaysFocus';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useEventsStore } from '@/stores/useEventStore';
import { setTodaysEvents } from '@/utils/scheduleHandler';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

// id: number;
// title: string;
// description: string;
// repeat: {
//     frequency: number;
//     duration_of_weeks: number;
// };
// scheduled_for: Date;
// completed_at: Date;
// points: number;

// const events = {
//     '2025/05/30': [
//         {
//             id: 1,
//             title: 'Read putting guide',
//             description: 'something',
//             scheduled_for: new Date('2025/05/30'),
//             completed_at: null,
//             points: 25,
//         },
//         {
//             id: 2,
//             title: 'Practice chipping drills',
//             description: 'something',
//             scheduled_for: new Date('2025/05/30'),
//             completed_at: null,
//             points: 25,
//         },
//     ],
//     '2025/05/31': [
//         {
//             id: 1,
//             title: 'Play a round of golf',
//             description: 'something',
//             scheduled_for: new Date('2025/05/31'),
//             completed_at: null,
//             points: 25,
//         },
//     ],
// };

export default function HomeScreen() {
    const {events} = useEventsStore(); 

    const todaysEvents = useMemo(() => {
    return setTodaysEvents(events || []);
    }, [events]);

    console.log(todaysEvents); 

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#FFF9EC ', dark: '#FFF9EC ' }}
            headerContent={
                <View className="flex flex-col items-center px-4 pb-6 pt-4 h-full">
                    <Text
                        style={{
                            fontSize: 28,
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}
                        className="text-lg font-bold font-satoshi text-white"
                    >
                        Trendsetter
                    </Text>
                    {/* @todo set this to be motivation quote api */}
                    <Text className="text-white font-satoshi_italic font-semibold mt-4 text-center mx-8">
                        “You cannot open your third eye if your first two are
                        still blinking” - Jakeb
                    </Text>
                </View>
            }
        >
            <View
                style={{ borderTopEndRadius: 32, borderTopStartRadius: 32 }}
                className="bg-[#FEF3DA] min-h-screen rounded-t-xl px-4"
            >
                <TodaysFocus todaysEvents={todaysEvents} />
                <CurrentGoal />
                {/* {Object.entries(events).map(([date, eventsList]) => (
                    <NextEvents
                        key={date}
                        date={new Date(date)}
                        events={eventsList}
                    />
                ))} */}
            </View>
        </ParallaxScrollView>
    );
}
