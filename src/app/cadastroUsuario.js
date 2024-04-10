import { useCallback, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput } from 'react-native';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link} from 'expo-router'
import useStorage from "./hooks/useStorage"
import Checkbox from 'expo-checkbox';

SplashScreen.preventAutoHideAsync();

export default function CadastraUsuario(){

    const[fontsLoaded,fontError] = useFonts({
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
      });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);
    
    if (!fontsLoaded && !fontError) {
        return null;
    }

    return(
        <View onLayout={onLayoutRootView} style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>Cadastre-se</Text>
                <Text style={styles.titleSubText}>Insira seus dados abaixo e cadastre-se gratuitamente</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.formText}>Tipo Usuário</Text>
                <RadioButtonGroup>
                    <RadioButtonItem value="PROFESSOR" label="Professor"/>
                    <RadioButtonItem value="ALUNO" label="Aluno"/>
                    <Text>Nome</Text>
                    <TextInput></TextInput>
                    <Text>Senha</Text>
                    <TextInput></TextInput>
                    <Text>Seu Email</Text>
                    <TextInput></TextInput>
                    <Text>CEP</Text>
                    <TextInput></TextInput>
                    <Text>N° residencial</Text>
                    <TextInput></TextInput>
                    <Checkbox/> 
                    <Text>Ao criar uma conta você tem que concordar com nossos termos e condição.</Text>
                    <Text style={styles.cadastreText}>Já tem uma conta? <Link href={"/login"} >Log in</Link></Text>
                    <TouchableOpacity><Text>Criar Conta</Text></TouchableOpacity>
                </RadioButtonGroup>
            </View>

        </View>
        
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      },
})