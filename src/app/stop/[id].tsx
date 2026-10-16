
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { departures } from "../../data/departures";
import { stops } from "../../data/stops";

export default function StopDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const stop = stops.find((item) => item.id === id);

    if (!stop) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ title: "Stop not found" }} />
                <Text style={styles.title}>Stop not found</Text>
                <Text style={styles.subtitle}>
                    This stop does not exist.
                </Text>
            </View>
        );
    }

    const stopDepartures = departures
        .filter((item) => item.stopId === stop.id)
        .sort((a, b) =>
            a.scheduledTime.localeCompare(b.scheduledTime)
        );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Stack.Screen options={{ title: "Stop details" }} />

            <Text style={styles.label}>BUS STOP</Text>

            <Text style={styles.title}>{stop.name}</Text>

            <View style={styles.location}>
                <Ionicons
                    name="location-outline"
                    size={18}
                    color="#737383"
                />
                <Text style={styles.subtitle}>{stop.city}</Text>
            </View>

            <View style={styles.notice}>
                <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#7047EB"
                />
                <Text style={styles.noticeText}>
                    Demo departures — simulated data
                </Text>
            </View>

            <Text style={styles.sectionTitle}>
                Upcoming departures
            </Text>

            {stopDepartures.length === 0 ? (
                <Text style={styles.empty}>
                    No departures available for this stop.
                </Text>
            ) : (
                stopDepartures.map((departure) => (
                    <View
                        key={departure.id}
                        style={styles.departureCard}
                    >
                        <View style={styles.lineBadge}>
                            <Text style={styles.lineText}>
                                {departure.line}
                            </Text>
                        </View>

                        <View style={styles.departureInfo}>
                            <Text style={styles.destination}>
                                {departure.destination}
                            </Text>
                            <Text style={styles.timeLabel}>
                                Scheduled departure
                            </Text>
                        </View>

                        <Text style={styles.time}>
                            {departure.scheduledTime}
                        </Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FC",
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: "#7047EB",
        letterSpacing: 2,
        marginBottom: 12,
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#1E1E2D",
    },
    location: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 15,
        color: "#737383",
    },
    notice: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0EBFF",
        padding: 16,
        borderRadius: 14,
        marginTop: 30,
        gap: 10,
    },
    noticeText: {
        color: "#5940A8",
        fontSize: 13,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 32,
        marginBottom: 16,
        color: "#1E1E2D",
    },
    departureCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        gap: 14,
    },
    lineBadge: {
        backgroundColor: "#7047EB",
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    lineText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    departureInfo: {
        flex: 1,
    },
    destination: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E1E2D",
    },
    timeLabel: {
        fontSize: 12,
        color: "#737383",
        marginTop: 5,
    },
    time: {
        fontSize: 16,
        fontWeight: "700",
        color: "#7047EB",
    },
    empty: {
        fontSize: 15,
        color: "#737383",
    },
});
