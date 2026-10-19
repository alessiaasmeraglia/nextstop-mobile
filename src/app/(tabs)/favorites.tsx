import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import StopCard from "../../components/StopCard";
import { useFavorites } from "../../context/FavoritesContext";
import { transportService } from "../../services/transportService";

export default function FavoritesScreen() {
    const { favorites, isLoading } = useFavorites();

    const favoriteStops = transportService
        .getStops()
        .filter((stop) => favorites.includes(stop.id));

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7047EB" />
                <Text style={styles.subtitle}>
                    Loading favorites...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your favorites</Text>

            <Text style={styles.subtitle}>
                Your saved stops, always within reach.
            </Text>

            <FlatList
                data={favoriteStops}
                keyExtractor={(item) => item.id}
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
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="heart-outline"
                            size={48}
                            color="#7047EB"
                        />

                        <Text style={styles.emptyTitle}>
                            No favorites yet
                        </Text>

                        <Text style={styles.emptyDescription}>
                            Save your most used stops to find
                            them quickly here.
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
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8F9FC",
        gap: 12,
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
    list: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1E1E2D",
    },
    emptyDescription: {
        fontSize: 15,
        color: "#737383",
        textAlign: "center",
        lineHeight: 22,
    },
});
