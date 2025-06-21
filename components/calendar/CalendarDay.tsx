import { Text, TouchableOpacity } from 'react-native';

export default function CalendarDay({
    date,
    state,
    isSelected,
    onDayPress,
}: {
    date: any;
    state: string | undefined;
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
        </TouchableOpacity>
    );
}
