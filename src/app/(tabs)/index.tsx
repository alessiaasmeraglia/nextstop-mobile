
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>NEXTSTOP MOBILE</Text>

        <Text style={styles.title}>
          Where to next?
        </Text>

        <Text style={styles.subtitle}>
          Find your stop, check departures
          and move around with ease.
        </Text>
      </View>

      <Pressable
        style={styles.searchCard}
        onPress={() => router.push("/stops")}
        accessibilityRole="button"
        accessibilityLabel="Explore bus stops"
      >
        <Ionicons
          name="search-outline"
          size={24}
          color="#7047EB"
        />

        <Text style={styles.searchText}>
          Search for a stop...
        </Text>

        <Ionicons
          name="arrow-forward"
          size={20}
          color="#7047EB"
        />
      </Pressable>

      <Text style={styles.sectionTitle}>
        Your journey starts here
      </Text>

      <View style={styles.infoCard}>
        <Ionicons
          name="bus-outline"
          size={26}
          color="#7047EB"
        />

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            Public transport, simplified.
          </Text>

          <Text style={styles.infoText}>
            Explore routes and stops in one place.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    padding: 24,
  },
  header: {
    marginTop: 36,
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7047EB",
    letterSpacing: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1E1E2D",
  },
  subtitle: {
    fontSize: 16,
    color: "#737383",
    lineHeight: 24,
    marginTop: 12,
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  searchText: {
    flex: 1,
    color: "#737383",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 40,
    marginBottom: 16,
    color: "#1E1E2D",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E1E2D",
  },
  infoText: {
    fontSize: 14,
    color: "#737383",
    marginTop: 6,
  },
});
