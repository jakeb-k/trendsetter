import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function TypingIndicator() {
    const animations = [1, 2, 3].map(() => useRef(new Animated.Value(0)).current);

    useEffect(() => {
        const createAnimation = (anim: Animated.Value, delay: number) =>
            Animated.sequence([
                Animated.delay(delay),
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim, {
                            toValue: 0,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ])
                ),
            ]);

        Animated.stagger(150, animations.map((a, i) => createAnimation(a, i * 150))).start();
    }, []);

    return (
        <View className='bg-gray-700 px-4 rounded-lg' style={styles.container}>
            {animations.map((anim, i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles.dot,
                        {
                            transform: [
                                {
                                    translateY: anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -1],
                                    }),
                                },
                            ],
                            opacity: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1],
                            }),
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
        gap: 6,
        width:72, 
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
});
