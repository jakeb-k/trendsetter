import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
    size?: number;
    strokeWidth?: number;
    progress: number; // 0 to 1
    label?: string;
};

const GoalProgressWheel = ({
    size = 120,
    strokeWidth = 10,
    progress,
    label,
}: Props) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const animatedProgress = useSharedValue(0);

    useFocusEffect(
        useCallback(() => {
            animatedProgress.value = 0;
            animatedProgress.value = withTiming(progress, {
                duration: 1000,
                easing: Easing.out(Easing.exp),
            });
        }, [progress])
    );

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - animatedProgress.value),
    }));

    return (
        <View className="items-center justify-center">
            <Svg width={size} height={size}>
                <Circle
                    stroke="#2e2e2e"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <AnimatedCircle
                    stroke="#ff6b00"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    originX={size / 2}
                    originY={size / 2}
                />
            </Svg>
            <View className="absolute items-center justify-center">
                <Text className="text-white text-3xl">
                    {Math.round(progress * 100)}%
                </Text>
                {label && (
                    <Text className="text-md font-satoshi_italic text-white/60 mt-1">{label}</Text>
                )}
            </View>
        </View>
    );
};

export default GoalProgressWheel;
