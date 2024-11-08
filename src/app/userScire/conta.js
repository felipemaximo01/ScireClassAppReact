import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Modal, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter, Link } from 'expo-router'
import useStorage from '../hooks/useStorage';

export default function Conta() {

    const router = useRouter();

    const {clearItens} = useStorage();

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

    const sair = async() =>{
        await clearItens();
        router.replace("/");
    }

    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <Text style={styles.title}>Conta</Text>
            <View style={styles.conteinerimg} ><Image style={styles.imagem} source={require("../../assets/userIcon.png")} /></View>
            <Link href={"userScire/certificados"}> <View ><Text style={styles.opcoes}>Certificados</Text></View></Link>
            <Link href={"userScire/editarPerfil"}><View><Text style={styles.opcoes}>Editar conta</Text></View></Link>
            <Link href={"userScire/homeProfessor"}><View><Text style={styles.opcoes}>Configuração de Privacidade</Text></View></Link>
            <Link href={"userScire/cursosCriados"}><View><Text style={styles.opcoes}>Ajuda</Text></View></Link>
            <TouchableOpacity onPress={sair} ><Text style={styles.opcoes}>Sair</Text></TouchableOpacity>

        </View >
    )
}
const styles = StyleSheet.create({
    conteinerimg: {
        width: "100%",
        height: 100,
        justifyContent: "center",
        alignItems: 'center'
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
        backgroundColor: '#FFFFFF'
    },
    opcoes: {
        width: "100%",
        height: "30",
        fontSize: 16,
        marginBottom: 24,
        fontFamily: "Poppins-Regular",

    },
})