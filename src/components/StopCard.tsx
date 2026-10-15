
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Stop } from "../types/transport";

interface StopCardProps {
    stop: Stop;
    onPress?: () => void;
}

export default function StopCard({
    stop,
    onPress,
}: StopCardProps) {
    return (
        <Pressable
            style={styles.card}
            onPress={onPress}
            disabled={!onPress}
            accessibilityRole={onPress ? "button" : undefined}
            accessibilityLabel={`${stop.name}, ${stop.city}`}
        >
            <View style={styles.iconContainer}>
                <Ionicons name="bus-outline" size={24} color="#7047EB" />
            </View>

            <View style={styles.content}>
                <Text style={styles.name}>{stop.name}</Text>
                <Text style={styles.city}>{stop.city}</Text>

                <Text style={styles.lines}>
                    Lines: {stop.lines.join(" · ")}
                </Text>
            </View>

            {onPress && (
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#737383"
                />
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        gap: 14,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#F0EBFF",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E1E2D",
    },
    city: {
        fontSize: 14,
        color: "#737383",
        marginTop: 4,
    },
    lines: {
        fontSize: 13,
        color: "#7047EB",
        marginTop: 8,
    },
});
