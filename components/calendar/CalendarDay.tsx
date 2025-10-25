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
    justify-center items-center
    ${state === 'disabled' ? 'opacity-30' : ''}
    ${state === 'today' ? 'bg-[#FF6B0040]' : ''} 
    ${isSelected ? 'bg-[#FF6B0080]' : ''}
    transition-all duration-200 ease-in-out
  `}
            onPress={() => onDayPress(date)}
        >
            {/* //@ts-ignore */}
            <Text style={{ color: '#fff' }}>{date.day}</Text>
            {eventCount > 0 && (
                <View className="flex flex-row justify-center items-center absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary z-50">
                    <Text className="text-white font-bold font-satoshi">
                        {eventCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
