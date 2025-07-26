import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

export default function TabLayout() {
    const colorScheme = useColorScheme();

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
                    backgroundColor: '#FFE3B1', // match your screenshot bg
                    borderRadius: 12,
                    height: 55,
                    borderTopWidth: 0,
                    boxShadow: '0 4px 3px rgba(0, 0, 0, 0.07), 0 2px 2px rgba(0, 0, 0, 0.06)',
                    marginHorizontal: 'auto'
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    fontFamily: 'Satoshi', 
                    display: "flex",
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
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="home" size={24} color="#8B3C00" />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({ color }) => (
                       <Entypo name="calendar" size={24} color="#8B3C00" />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ color }) => (
                        <Entypo name="bar-graph" size={24} color="#8B3C00" />
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
