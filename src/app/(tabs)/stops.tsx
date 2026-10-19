
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import StopCard from "../../components/StopCard";
import { colors, radius, spacing, typography } from "../../constants/theme";
import { transportService } from "../../services/transportService";

type CityFilter = "All" | "Trento" | "Rovereto";

const cityFilters: CityFilter[] = ["All", "Trento", "Rovereto"];

export default function StopsScreen() {
    const [search, setSearch] = useState("");
    const [city, setCity] = useState<CityFilter>("All");

    const filteredStops = useMemo(() => {
        return transportService
            .searchStops(search)
            .filter((stop) => city === "All" || stop.city === city);
    }, [search, city]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Find your stop</Text>

            <Text style={styles.subtitle}>
                Search stops and lines around you.
            </Text>

            <View style={styles.searchContainer}>
                <Ionicons
                    name="search-outline"
                    size={22}
                    color={colors.primary}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Search stops or lines..."
                    placeholderTextColor={colors.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                    autoCorrect={false}
                    accessibilityLabel="Search stops or lines"
                />

                {search.length > 0 && (
                    <Pressable
                        onPress={() => setSearch("")}
                        accessibilityRole="button"
                        accessibilityLabel="Clear search"
                        hitSlop={8}
                    >
                        <Ionicons
                            name="close-circle"
                            size={22}
                            color={colors.textSecondary}
                        />
                    </Pressable>
                )}
            </View>

            <View style={styles.filters}>
                {cityFilters.map((filter) => (
                    <Pressable
                        key={filter}
                        onPress={() => setCity(filter)}
                        style={[
                            styles.filterButton,
                            city === filter && styles.filterButtonActive,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: city === filter }}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                city === filter && styles.filterTextActive,
                            ]}
                        >
                            {filter}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.results}>
                {filteredStops.length} stops found
            </Text>

            <FlatList
                data={filteredStops}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <StopCard
                        stop={item}
                        onPress={() =>
                            router.push({
                                pathname: "/stop/[id]",
                                params: { id: item.id },
                            })
                        }
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons
                            name="search-outline"
                            size={40}
                            color={colors.textSecondary}
                        />
                        <Text style={styles.emptyTitle}>
                            No stops found
                        </Text>
                        <Text style={styles.emptyDescription}>
                            Try another search or change your city filter.
                        </Text>
                        <Pressable
                            onPress={() => {
                                setSearch("");
                                setCity("All");
                            }}
                            accessibilityRole="button"
                            style={styles.resetButton}
                        >
                            <Text style={styles.resetText}>
                                Reset filters
                            </Text>
                        </Pressable>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
    },
    title: {
        fontSize: typography.title,
        fontWeight: "700",
        color: colors.text,
    },
    subtitle: {
        fontSize: typography.body,
        color: colors.textSecondary,
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        borderRadius: radius.lg,
        gap: spacing.sm,
        height: 56,
    },
    input: {
        flex: 1,
        fontSize: typography.body,
        color: colors.text,
    },
    filters: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    filterButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterText: {
        color: colors.textSecondary,
        fontSize: 13,
        fontWeight: "600",
    },
    filterTextActive: {
        color: colors.surface,
    },
    results: {
        fontSize: typography.caption,
        color: colors.textSecondary,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    list: {
        flexGrow: 1,
        paddingBottom: spacing.lg,
    },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.subtitle,
        fontWeight: "700",
        color: colors.text,
    },
    emptyDescription: {
        fontSize: typography.caption,
        color: colors.textSecondary,
        textAlign: "center",
        lineHeight: 22,
    },
    resetButton: {
        backgroundColor: colors.primaryLight,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: 12,
        marginTop: spacing.sm,
    },
    resetText: {
        color: colors.primary,
        fontWeight: "700",
    },
});
