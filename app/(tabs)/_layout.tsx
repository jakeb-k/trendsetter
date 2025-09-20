import { Tabs, useSegments } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const segments = useSegments();
    const activeRoute = segments[segments.length - 1]; // e.g. "calendar"

    console.log(activeRoute);
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
                    tabBarIcon: ({ focused }) => (
                        <AntDesign
                            name="home"
                            size={24}
                            color={
                                activeRoute === '(tabs)' ? '#000' : '#8B3C00'
                            }
                            style={{
                                backgroundColor:
                                    activeRoute === '(tabs)'
                                        ? '#FF6B00'
                                        : 'transparent',
                                borderRadius: 8,
                                padding: 3,
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({}) => (
                        <Entypo
                            name="calendar"
                            size={24}
                            color={
                                activeRoute === 'calendar' ? '#000' : '#8B3C00'
                            }
                            style={{
                                backgroundColor:
                                    activeRoute === 'calendar'
                                        ? '#FF6B00'
                                        : 'transparent',
                                borderRadius: 8,
                                padding: 3,
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ focused }) => (
                        <Entypo
                            name="bar-graph"
                            size={24}
                            color={
                                activeRoute === 'explore' ? '#000' : '#8B3C00'
                            }
                            style={{
                                backgroundColor:
                                    activeRoute === 'explore'
                                        ? '#FF6B00'
                                        : 'transparent',
                                borderRadius: 8,
                                padding: 3,
                            }}
                        />
                    ),
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
