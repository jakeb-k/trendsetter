import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

export default function DotSpinner({ color = '#FF6B00' }: { color?: string }) {
    const spinAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const anim = Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: Platform.OS !== 'web',
            }),
        );

        anim.start();
        return () => anim.stop();
    }, [spinAnim]);

    const rotate = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={[styles.container, { transform: [{ rotate }] }]}>
            {Array.from({ length: 8 }).map((_, i) => (
                <View
                    key={i}
                    style={[
                        styles.dot,
                        { backgroundColor: color },
                        {
                            transform: [
                                { rotate: `${i * 45}deg` },
                                { translateY: -20 },
                            ],
                        },
                    ]}
                />
            ))}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
