import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function Conta() {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <Text style={styles.title}>Conta</Text>
            <View style={styles.conteinerimg} ><Image style={styles.imagem} source={require("../../assets/userIcon.png")} /></View>
            <View ><Text style={styles.opcoes}>Certificados</Text></View>
            <View><Text style={styles.opcoes}>Editar conta</Text></View>
            <View><Text style={styles.opcoes}>Configuração de Privacidade</Text></View>
            <View><Text style={styles.opcoes}>Ajuda</Text></View>


        </View>
    )
}
const styles = StyleSheet.create({
    conteinerimg: {
        width: "100%",
        height: 100,
        justifyContent:"center",
        alignItems:'center'
    },
    imagem: {
        height: 79,
        width: 66,
    },
    title: {
        fontFamily: "Poppins-Bold",
        fontSize: 24
    },
    container: {
        width: "100%",
        height: "100%",
        padding: 16,
        backgroundColor:'#FFFFFF'
    },
    opcoes: {
        width: "100%",
        height: "30",
        fontSize: 16,
        marginBottom:24,
        fontFamily: "Poppins-Regular",

    },
})