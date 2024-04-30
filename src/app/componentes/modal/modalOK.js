import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from "react-native";

export function ModalOK({ textOK, handleClose }) {
    return (
        <View style={styles.container}>

            <View style={styles.content}>
                <Image
                    style={styles.img}
                    source={require("../../../assets/IconOK.png")}
                />
                <Text style={styles.title}>Sucesso</Text>
                <Text style={styles.text}>{textOK}</Text>
                <View style={styles.buttonArea}>
                    <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleClose}>
                        <Text style={styles.buttonSaveText}>OK</Text>
                    </TouchableOpacity>
                </View>
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
    content: {
        backgroundColor: "#FFF",
        width: "85%",
        paddingTop: 24,
        paddingBottom: 24,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    },
    title: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        color: "#1F1F39",
        marginBottom: 24
    },
    text: {
        color: "#858597",
        textAlign: "center",
        justifyContent: "center",
        fontFamily: "Poppins-Regular"
    },
    buttonArea: {
        flexDirection: "row",
        width: "90%",
        marginTop: 8,
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        flex: 1,
        alignItems: "center",
        marginTop: 14,
        marginBottom: 14,
        padding: 8,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSave: {
        backgroundColor: "#3D5CFF",
        borderRadius: 8
    },
    buttonSaveText: {
        color: "#FFFFFF",
        fontFamily: "Poppins-Bold",
        fontSize: 20
    },
    img: {
        width: 100,
        height: 100,
        marginTop: 40,
        marginBottom: 20
    }

})