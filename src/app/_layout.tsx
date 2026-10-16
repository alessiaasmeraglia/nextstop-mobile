
import { Stack } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="stop/[id]"
          options={{
            title: "Stop details",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </FavoritesProvider>
  );
}
