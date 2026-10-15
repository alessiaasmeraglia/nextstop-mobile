import { StyleSheet, Text, View } from "react-native";

export default function StopsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Find your stop</Text>
            <Text style={styles.subtitle}>
                Search bus stops and discover upcoming departures.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FC",
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1E1E2D",
    },
    subtitle: {
        marginTop: 12,
        fontSize: 16,
        color: "#737383",
    },
});