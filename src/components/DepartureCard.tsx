
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import type { Departure } from "../types/transport";

interface DepartureCardProps {
    departure: Departure;
}

export default function DepartureCard({
    departure,
}: DepartureCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.lineBadge}>
                <Text style={styles.lineText}>
                    {departure.line}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.destination}>
                    {departure.destination}
                </Text>

                <Text style={styles.label}>
                    Scheduled departure
                </Text>
            </View>

            <Text style={styles.time}>
                {departure.scheduledTime}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: 12,
        gap: 14,
    },
    lineBadge: {
        minWidth: 44,
        height: 44,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
    },
    lineText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: "700",
    },
    content: {
        flex: 1,
    },
    destination: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },
    label: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 5,
    },
    time: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.primary,
        fontVariant: ["tabular-nums"],
    },
});