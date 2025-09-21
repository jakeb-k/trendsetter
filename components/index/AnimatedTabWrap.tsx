// AnimatedTabWrap.tsx
import { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

export function AnimatedTabWrap({
    active,
    children,
    radius = 6,
    pad = 3,
    activeBg = '#FF6B00',
}: {
    active: boolean;
    children: React.ReactNode;
    radius?: number;
    pad?: number;
    activeBg?: string;
}) {
    const t = useSharedValue(active ? 1 : 0);

    useEffect(() => {
        t.value = withTiming(active ? 1 : 0, { duration: 180 });
    }, [active]);

    const style = useAnimatedStyle<ViewStyle>(() => ({
        backgroundColor: interpolateColor(
            t.value,
            [0, 1],
            ['transparent', activeBg]
        ),
        transform: [{ scale: 0.98 + t.value * 0.02 }],
        borderRadius: radius,
        padding: pad,
    }));

    return <Animated.View style={style}>{children}</Animated.View>;
}
