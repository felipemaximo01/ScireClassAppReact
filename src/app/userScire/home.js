import { useCallback, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link} from 'expo-router'
import useStorage from "../hooks/useStorage"

SplashScreen.preventAutoHideAsync();

export default function Home(){

    const[fontsLoaded,fontError] = useFonts({
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

      return(
        <View onLayout={onLayoutRootView} style={styles.container}><Text>HOME</Text></View>
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