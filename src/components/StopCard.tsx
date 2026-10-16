
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useFavorites } from "../context/FavoritesContext";
import type { Stop } from "../types/transport";

interface StopCardProps {
    stop: Stop;
    onPress?: () => void;
}

export default function StopCard({
    stop,
    onPress,
}: StopCardProps) {
    const {
        isFavorite,
        toggleFavorite,
        isLoading,
    } = useFavorites();

    const saved = isFavorite(stop.id);

    return (
        <View style={styles.card}>
            <Pressable
                style={styles.mainContent}
                onPress={onPress}
                disabled={!onPress}
                accessibilityRole={onPress ? "button" : undefined}
                accessibilityLabel={`${stop.name}, ${stop.city}`}
            >
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={stop.mode === "train" ? "train-outline" : "bus-outline"}
                        size={24}
                        color="#7047EB"
                    />
                </View>

                <View style={styles.content}>
                    <Text style={styles.name}>{stop.name}</Text>

                    <Text style={styles.city}>{stop.city}</Text>

                    <Text style={styles.lines}>
                        Lines: {stop.lines.join(" · ")}
                    </Text>
                </View>
            </Pressable>

            <Pressable
                onPress={() => toggleFavorite(stop.id)}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel={
                    saved
                        ? `Remove ${stop.name} from favorites`
                        : `Add ${stop.name} to favorites`
                }
                accessibilityState={{
                    selected: saved,
                    disabled: isLoading,
                }}
                hitSlop={8}
                style={styles.favoriteButton}
            >
                <Ionicons
                    name={saved ? "heart" : "heart-outline"}
                    size={24}
                    color={saved ? "#7047EB" : "#737383"}
                />
            </Pressable>
        </View>
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
        gap: 10,
    },
    mainContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
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
    favoriteButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
});
