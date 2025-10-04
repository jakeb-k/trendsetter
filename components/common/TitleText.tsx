import { useThemeColor } from '@/hooks/useThemeColor';
import { Text } from 'react-native';

export default function TitleText({
    title,
    className,
}: {
    title: string;
    className?: string;
}) {
    const textColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');
    const colourClass = textColor === 'white' ? 'text-white' : 'text-black';

    return (
        <Text className={`${className} ${colourClass} font-satoshi text-2xl`}>
            {title}
        </Text>
    );
}
