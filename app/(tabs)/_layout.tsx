import { Tabs, useSegments } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { AnimatedTabWrap } from '@/components/index/AnimatedTabWrap';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const segments = useSegments();
    const activeRoute = segments[segments.length - 1]; // e.g. "calendar"

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: {
                    width: '92.5%',
                    position: 'absolute',
                    bottom: 8,
                    backgroundColor: '#000', // match your screenshot bg
                    borderRadius: 12,
                    height: 55,
                    borderTopWidth: 0,
                    boxShadow: '0 0px 3px #FF6B00, 0 0px 2px #FF6B00',
                    marginHorizontal: 'auto',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    fontFamily: 'Satoshi',
                    display: 'flex',
                    justifyContent: 'center',
                },
                tabBarActiveTintColor: '#FF6B00', // orange like your icons
                tabBarInactiveTintColor: '#FF6B00',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: () => {
                        const active = activeRoute === '(tabs)';
                        return (
                            <AnimatedTabWrap active={active}>
                                <AntDesign
                                    name="home"
                                    size={24}
                                    color={active ? '#000' : '#8B3C00'}
                                />
                            </AnimatedTabWrap>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarIcon: () => {
                        const active = activeRoute === 'calendar';
                        return (
                            <AnimatedTabWrap active={active}>
                                <Entypo
                                    name="calendar"
                                    size={24}
                                    color={active ? '#000' : '#8B3C00'}
                                />
                            </AnimatedTabWrap>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Progress',
                    tabBarIcon: () => {
                        const active = activeRoute === 'explore';
                        return (
                            <AnimatedTabWrap active={active}>
                                <Entypo
                                    name="bar-graph"
                                    size={24}
                                    color={active ? '#000' : '#8B3C00'}
                                />
                            </AnimatedTabWrap>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
