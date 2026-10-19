
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams } from "expo-router";

import DepartureCard from "../../components/DepartureCard";
import {
    colors,
    radius,
    spacing,
    typography,
} from "../../constants/theme";
import { useFavorites } from "../../context/FavoritesContext";
import { transportService } from "../../services/transportService";

export default function StopDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const {
        isFavorite,
        toggleFavorite,
        isLoading,
    } = useFavorites();

    const stop = transportService.getStopById(id);

    if (!stop) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ title: "Stop not found" }} />

                <View style={styles.content}>
                    <Text style={styles.title}>
                        Stop not found
                    </Text>

                    <Text style={styles.subtitle}>
                        The requested stop does not exist.
                    </Text>
                </View>
            </View>
        );
    }

    const stopDepartures =
        transportService.getDeparturesByStopId(stop.id);

    const saved = isFavorite(stop.id);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Stack.Screen
                options={{ title: "Stop details" }}
            />

            <View style={styles.header}>
                <View style={styles.stopIcon}>
                    <Ionicons
                        name={
                            stop.mode === "train"
                                ? "train-outline"
                                : "bus-outline"
                        }
                        size={28}
                        color={colors.primary}
                    />
                </View>

                <Pressable
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(stop.id)}
                    disabled={isLoading}
                    accessibilityRole="button"
                    accessibilityLabel={
                        saved
                            ? "Remove stop from favorites"
                            : "Add stop to favorites"
                    }
                    accessibilityState={{
                        selected: saved,
                        disabled: isLoading,
                    }}
                >
                    <Ionicons
                        name={saved ? "heart" : "heart-outline"}
                        size={26}
                        color={
                            saved
                                ? colors.primary
                                : colors.textSecondary
                        }
                    />
                </Pressable>
            </View>

            <Text style={styles.label}>BUS STOP</Text>

            <Text style={styles.title}>{stop.name}</Text>

            <View style={styles.location}>
                <Ionicons
                    name="location-outline"
                    size={18}
                    color={colors.textSecondary}
                />

                <Text style={styles.subtitle}>
                    {stop.city}, Italy
                </Text>
            </View>

            <View style={styles.notice}>
                <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color={colors.primary}
                />

                <Text style={styles.noticeText}>
                    Official GTFS stop data. Scheduled departures coming soon.
                </Text>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    Departures
                </Text>

                <Text style={styles.sectionLabel}>
                    Scheduled
                </Text>
            </View>

            {stopDepartures.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons
                        name="time-outline"
                        size={38}
                        color={colors.textSecondary}
                    />

                    <Text style={styles.emptyTitle}>
                        No departures available
                    </Text>

                    <Text style={styles.emptyDescription}>
                        Scheduled departures are not available yet.
                    </Text>
                </View>
            ) : (
                stopDepartures.map((departure) => (
                    <DepartureCard
                        key={departure.id}
                        departure={departure}
                    />
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.lg,
    },
    stopIcon: {
        width: 56,
        height: 56,
        borderRadius: radius.lg,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
    },
    favoriteButton: {
        width: 48,
        height: 48,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: typography.small,
        fontWeight: "700",
        color: colors.primary,
        letterSpacing: 2,
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: typography.title,
        fontWeight: "700",
        color: colors.text,
    },
    location: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        marginTop: spacing.sm,
    },
    subtitle: {
        fontSize: typography.body,
        color: colors.textSecondary,
    },
    notice: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primaryLight,
        padding: spacing.md,
        borderRadius: radius.lg,
        marginTop: spacing.xl,
        gap: spacing.sm,
    },
    noticeText: {
        flex: 1,
        fontSize: typography.caption,
        color: colors.primary,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: spacing.xl,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.subtitle,
        fontWeight: "700",
        color: colors.text,
    },
    sectionLabel: {
        fontSize: typography.small,
        color: colors.textSecondary,
    },
    empty: {
        alignItems: "center",
        padding: spacing.xl,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        gap: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.body,
        fontWeight: "700",
        color: colors.text,
    },
    emptyDescription: {
        fontSize: typography.caption,
        color: colors.textSecondary,
        textAlign: "center",
        lineHeight: 22,
    },
});
