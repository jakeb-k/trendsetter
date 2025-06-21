import { Text, View } from 'react-native';

export default function CalendarDay({
    date,
    state, 
}: {
    date: any;
    state: string | undefined; 
}) {
    console.log(date)
    return (
        <View
            style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#FF6B00',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                    state === 'today' ? '#FF6B0040' : 'transparent',
                opacity: state === 'disabled' ? 0.3 : 1,
            }}
        >
            {/* //@ts-ignore */}
            <Text style={{ color: '#fff' }}>{date.day}</Text>
        </View>
    );
}
