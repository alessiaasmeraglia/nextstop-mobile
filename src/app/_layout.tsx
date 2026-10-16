
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
  );
}
