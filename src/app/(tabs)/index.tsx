
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";

import { useFavorites } from "../../context/FavoritesContext";

export default function HomeScreen() {
  const { favorites, isLoading } = useFavorites();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.label}>
            NEXTSTOP MOBILE
          </Text>

          <Text style={styles.title}>
            Where to next?
          </Text>

          <Text style={styles.subtitle}>
            Your city, one stop away.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="bus-outline"
            size={28}
            color={colors.primary}
          />
        </View>
      </View>

      <Pressable
        style={styles.searchCard}
        onPress={() => router.push("/stops")}
        accessibilityRole="button"
        accessibilityLabel="Search stops or lines"
      >
        <Ionicons
          name="search-outline"
          size={24}
          color={colors.primary}
        />

        <Text style={styles.searchText}>
          Search stops or lines...
        </Text>

        <Ionicons
          name="arrow-forward"
          size={20}
          color={colors.primary}
        />
      </Pressable>

      <Pressable
        style={styles.favoritesCard}
        onPress={() => router.push("/favorites")}
        accessibilityRole="button"
        accessibilityLabel="Open favorite stops"
      >
        <Ionicons
          name="heart"
          size={25}
          color={colors.surface}
        />

        <View style={styles.favoritesContent}>
          <Text style={styles.favoritesTitle}>
            Your favorite stops
          </Text>

          <Text style={styles.favoritesSubtitle}>
            {isLoading
              ? "Loading favorites..."
              : favorites.length === 0
                ? "Save a stop to access it quickly"
                : `${favorites.length} saved ${
                    favorites.length === 1 ? "stop" : "stops"
                  }`}
          </Text>
        </View>

        <Ionicons
          name="arrow-forward"
          size={20}
          color={colors.surface}
        />
      </Pressable>

      <Text style={styles.sectionTitle}>
        Explore mobility
      </Text>

      <View style={styles.grid}>
        <Pressable
          style={styles.featureCard}
          onPress={() => router.push("/stops")}
          accessibilityRole="button"
          accessibilityLabel="Explore bus stops"
        >
          <Ionicons
            name="bus-outline"
            size={28}
            color={colors.primary}
          />

          <Text style={styles.featureTitle}>
            Bus stops
          </Text>

          <Text style={styles.featureDescription}>
            Find stops and departures
          </Text>
        </Pressable>

        <Pressable
          style={styles.featureCard}
          onPress={() => router.push("/stops")}
          accessibilityRole="button"
          accessibilityLabel="Explore transit lines"
        >
          <Ionicons
            name="git-branch-outline"
            size={28}
            color={colors.primary}
          />

          <Text style={styles.featureTitle}>
            Routes
          </Text>

          <Text style={styles.featureDescription}>
            Search available lines
          </Text>
        </Pressable>
      </View>

      <Text style={styles.demoNotice}>
        Currently displaying demo transit information.
      </Text>
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
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerText: {
    flex: 1,
  },
  label: {
    fontSize: typography.small,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.hero,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  headerIcon: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginLeft: spacing.sm,
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 60,
    gap: 12,
  },
  searchText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  favoritesCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.md,
  },
  favoritesContent: {
    flex: 1,
  },
  favoritesTitle: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.surface,
  },
  favoritesSubtitle: {
    fontSize: typography.caption,
    color: colors.primaryLight,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  featureCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  featureTitle: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.md,
  },
  featureDescription: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  demoNotice: {
    marginTop: spacing.xl,
    color: colors.textSecondary,
    fontSize: typography.small,
    textAlign: "center",
  },
});
