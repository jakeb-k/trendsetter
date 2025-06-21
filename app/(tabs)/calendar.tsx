import CalendarView from '@/components/calendar/CalendarView';
import TitleText from '@/components/common/TitleText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import Entypo from '@expo/vector-icons/Entypo';
import moment from 'moment';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function CalendarScreen() {
    const [month, setMonth] = useState(moment().format('MMMM YYYY'));
      const backgroundColor = useThemeColor({ light: 'rgb(21, 23, 24)', dark: 'rgb(21, 23, 24)' }, 'background');
    
    return (
        <ThemedView className="min-h-screen w-full px-4">
            <View className="flex flex-row items-center justify-between mt-12 pl-4">
                <TitleText className="font-bold text-3xl " title={month} />
                <TouchableOpacity>
                    <Entypo name="chevron-right" size={40} color="#FF6B00" />
                </TouchableOpacity>
            </View>
            <CalendarView calendarBg={backgroundColor} /> 
        </ThemedView>
    );
}
