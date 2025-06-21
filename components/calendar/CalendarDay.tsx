import { Text, TouchableOpacity, View } from 'react-native';

export default function CalendarDay({
    date,
    state,
    eventCount,
    isSelected,
    onDayPress,
}: {
    date: any;
    state: string | undefined;
    eventCount: number;
    isSelected?: boolean;
    onDayPress: (day: any) => void;
}) {
    return (
        <TouchableOpacity
            className={`
    w-10 h-10 rounded-xl border border-[#FF6B00]
    justify-center items-center relative overflow-hidden
    ${state === 'disabled' ? 'opacity-30' : ''}
    ${state === 'today' ? 'bg-[#FF6B0040]' : ''}
    ${isSelected ? 'bg-[#FF6B0080]' : ''}
    transition-all duration-200 ease-in-out
  `}
            onPress={() => onDayPress(date)}
        >
            {/* //@ts-ignore */}
            <Text style={{ color: '#fff' }}>{date.day}</Text>
            <View className="flex flex-row justify-center absolute bottom-0.5">
                {Array.from({ length: eventCount }).map((_, i) => (
                    <View key={i} className="h-1.5 w-1.5 rounded-full bg-primary mr-0.5"></View>
                ))}
            </View>
        </TouchableOpacity>
    );
}
