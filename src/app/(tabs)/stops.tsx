
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import StopCard from "../../components/StopCard";
import { stops } from "../../data/stops";

export default function StopsScreen() {
    const [search, setSearch] = useState("");

    const filteredStops = useMemo(() => {
        const query = search.trim().toLowerCase();

        return stops.filter((stop) => {
            return (
                stop.name.toLowerCase().includes(query) ||
                stop.city.toLowerCase().includes(query) ||
                stop.lines.some((line) => line.includes(query))
            );
        });
    }, [search]);

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
                    color="#737383"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Search stops or lines..."
                    placeholderTextColor="#737383"
                    value={search}
                    onChangeText={setSearch}
                    autoCorrect={false}
                    accessibilityLabel="Search stops or lines"
                />
            </View>

            <Text style={styles.results}>
                {filteredStops.length} stops found
            </Text>

            <FlatList
                data={filteredStops}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <StopCard stop={item} />
                )}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons
                            name="search-outline"
                            size={36}
                            color="#737383"
                        />

                        <Text style={styles.emptyText}>
                            No stops found
                        </Text>

                        <Text style={styles.emptyDescription}>
                            Try searching for another stop or line.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FC",
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1E1E2D",
    },
    subtitle: {
        fontSize: 16,
        color: "#737383",
        marginTop: 8,
        marginBottom: 24,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        borderRadius: 14,
        gap: 12,
        height: 56,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#1E1E2D",
    },
    results: {
        fontSize: 14,
        fontWeight: "500",
        color: "#737383",
        marginTop: 24,
        marginBottom: 16,
    },
    list: {
        paddingBottom: 24,
        flexGrow: 1,
    },
    empty: {
        alignItems: "center",
        paddingTop: 64,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1E1E2D",
        marginTop: 16,
    },
    emptyDescription: {
        fontSize: 14,
        color: "#737383",
        marginTop: 8,
        textAlign: "center",
    },
});
