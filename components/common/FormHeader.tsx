import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import TitleText from './TitleText';

interface Props {
    title: string;
    subtitle: string;
}

export default function FormHeader({ title, subtitle }: Props) {
    return (
        <View className="flex flex-col w-full mt-6">
            <TouchableOpacity>
                <Entypo
                    onPress={() => router.navigate('/calendar')}
                    name="chevron-left"
                    size={32}
                    color="#FF6B00"
                    className="-ml-2"
                />
            </TouchableOpacity>
            <TitleText className="font-bold text-2xl mt-4" title={title} />
            <Text className="text-white/50 font-satoshi font-semibold my-1 tracking-wide">
                {subtitle}
            </Text>
        </View>
    );
}
