import { useCallback, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import {
    Stack,
    useFocusEffect,
    useLocalSearchParams
} from "expo-router";

import DepartureCard from "../../components/DepartureCard";
import {
    colors,
    radius,
    spacing,
    typography,
} from "../../constants/theme";
import { useFavorites } from "../../context/FavoritesContext";
import { getTodayInTrento, scheduleService } from "../../services/scheduleService";
import { transportService } from "../../services/transportService";


function getTomorrow(date: string): string {
    const nextDate = new Date(`${date}T00:00:00Z`);

    nextDate.setUTCDate(nextDate.getUTCDate() + 1);

    return nextDate.toISOString().slice(0, 10);
}


function getMinutesUntilDeparture(
    scheduledTime: string,
    now: number
): number {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    });

    const parts = formatter.formatToParts(new Date(now));

    const hours = Number(
        parts.find((part) => part.type === "hour")?.value
    );

    const minutes = Number(
        parts.find((part) => part.type === "minute")?.value
    );

    const [departureHours, departureMinutes] =
        scheduledTime.split(":").map(Number);

    const currentMinutes = hours * 60 + minutes;

    const scheduledMinutes =
        departureHours * 60 + departureMinutes;

    return scheduledMinutes - currentMinutes;
}


export default function StopDetailsScreen() {
    const [selectedDay, setSelectedDay] = useState<
        "today" | "tomorrow"
    >("today");


    const [currentTime, setCurrentTime] = useState(
        () => Date.now()
    );

    useFocusEffect(
        useCallback(() => {
            setCurrentTime(Date.now());

            const interval = setInterval(() => {
                setCurrentTime(Date.now());
            }, 30_000);

            return () => clearInterval(interval);
        }, [])
    );

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

    const today = getTodayInTrento();

    const selectedDate =
        selectedDay === "today"
            ? today
            : getTomorrow(today);

    const stopDepartures =
        selectedDay === "today"
            ? scheduleService.getUpcomingDepartures(
                stop.id,
                10,
                currentTime
            )
            : scheduleService
                .getScheduledDepartures(stop.id, selectedDate)
                .slice(0, 10);

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
                    Official GTFS timetable. Times are scheduled,
                    not real-time predictions.
                </Text>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    Scheduled departures
                </Text>

                <Text style={styles.sectionLabel}>
                    Scheduled
                </Text>
            </View>


            <View style={styles.daySelector}>
                <Pressable
                    onPress={() => setSelectedDay("today")}
                    style={[
                        styles.dayButton,
                        selectedDay === "today" && styles.dayButtonActive,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{
                        selected: selectedDay === "today",
                    }}
                >
                    <Text
                        style={[
                            styles.dayButtonText,
                            selectedDay === "today" &&
                            styles.dayButtonTextActive,
                        ]}
                    >
                        Today
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setSelectedDay("tomorrow")}
                    style={[
                        styles.dayButton,
                        selectedDay === "tomorrow" &&
                        styles.dayButtonActive,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{
                        selected: selectedDay === "tomorrow",
                    }}
                >
                    <Text
                        style={[
                            styles.dayButtonText,
                            selectedDay === "tomorrow" &&
                            styles.dayButtonTextActive,
                        ]}
                    >
                        Tomorrow
                    </Text>
                </Pressable>
            </View>


            {stopDepartures.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons
                        name="time-outline"
                        size={38}
                        color={colors.textSecondary}
                    />

                    <Text style={styles.emptyTitle}>
                        {selectedDay === "today"
                            ? "No more departures today"
                            : "No departures scheduled"}
                    </Text>

                    <Text style={styles.emptyDescription}>
                        {selectedDay === "today"
                            ? "There are no more scheduled departures for today. Check tomorrow's timetable."
                            : "No scheduled departures were found for tomorrow."}
                    </Text>
                </View>
            ) : (

                stopDepartures.map((departure) => {
                    const minutesUntil =
                        selectedDay === "today"
                            ? getMinutesUntilDeparture(
                                departure.scheduledTime,
                                currentTime
                            )
                            : null;

                    return (
                        <View
                            key={departure.id}
                            style={styles.departureWrapper}
                        >
                            <DepartureCard departure={departure} />

                            {minutesUntil !== null &&
                                minutesUntil >= 0 && (
                                    <View style={styles.countdown}>
                                        <Ionicons
                                            name="time-outline"
                                            size={14}
                                            color={colors.primary}
                                        />

                                        <Text style={styles.countdownText}>
                                            {minutesUntil === 0
                                                ? "Scheduled now"
                                                : `In ${minutesUntil} min`}
                                        </Text>
                                    </View>
                                )}
                        </View>
                    );
                })

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

    daySelector: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },

    dayButton: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.md,
        backgroundColor: colors.surface,
    },

    dayButtonActive: {
        backgroundColor: colors.primary,
    },

    dayButtonText: {
        fontSize: typography.body,
        fontWeight: "600",
        color: colors.textSecondary,
    },

    dayButtonTextActive: {
        color: "#FFFFFF",
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

    departureWrapper: {
        marginBottom: spacing.sm,
    },

    countdown: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.primaryLight,
        borderRadius: radius.md,
        marginTop: spacing.xs,
    },

    countdownText: {
        fontSize: typography.small,
        fontWeight: "600",
        color: colors.primary,
    },

});
