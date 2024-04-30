import { View, StyleSheet, ActivityIndicator, Image } from "react-native";

export function ModalLoading() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ActivityIndicator style={styles.loading} color="#3D5CFF" size='large' />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(24,24,24,0.6)",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    loading: {
        width: 100,
        height: 150
    },
    content: {
        backgroundColor: "#FFF",
        width: "85%",
        paddingTop: 24,
        paddingBottom: 24,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    },
})