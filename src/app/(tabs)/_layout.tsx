import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#7047EB",
                tabBarInactiveTintColor: "#737383",
                headerStyle: {
                    backgroundColor: "#F8F9FC",
                },
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="stops"
                options={{
                    title: "Stops",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bus-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="favorites"
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}