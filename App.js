import { useCallback } from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Routes} from './src/componentes/Routes'

SplashScreen.preventAutoHideAsync();

export default function App() {
  return(
    <Routes/>
  )
}
