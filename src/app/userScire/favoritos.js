import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, Image, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter, Link } from 'expo-router'
import useStorage from "../hooks/useStorage"
import useLocalhost from "../hooks/useLocalhost"
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';
import * as Progress from 'react-native-progress';
import { useFocusEffect } from '@react-navigation/native';



SplashScreen.preventAutoHideAsync();

export default function Favoritos(){
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

      return(
      <View onLayout={onLayoutRootView} style={styles.container}> 
        <View style={styles.title}> 
         <Text style={styles.titleText}>Favoritos</Text>
        </View>
        
        <View style={[styles.card,styles.elevation]}>
         <View style={styles.viewImagem}> 
            <Image style={styles.img} source={require("../../assets/blankImage.png")}/>
         </View>
         <View> 
            <Text style={styles.titleCurso}>Titulo do Curso</Text>
            <View style={styles.contentTeacher}>
            <Image style={styles.user} source={require("../../assets/Union.png")}/>
            <Text style={styles.nameTeacher}>Nome do professor</Text>
            </View>
            <View style={styles.contentHours}>
                <Text style={styles.textHours}>10 Horas</Text>
            </View>
         </View>
            <Pressable> 
                <Image style={styles.fav} source={require("../../assets/iconButtonFav.png")}/>
            </Pressable>
        <View>

        </View>
        </View>
    
      </View>)
}
const styles = StyleSheet.create({ container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  elevation: {
    elevation: 20,
    shadowColor: '#52006A',
  },
    card: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    height: 100,
    borderRadius: 8,
    flexDirection: "row",
    padding: 12,
    marginTop: 8,
  },
  title:{
    width: "100%",
    alignItems: "center",
    justifyContent:"center",
    margin: 20,
  },
  titleText:{
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  viewImagem:{
    height: 68,
    width: 68,
    borderRadius:8,
    marginRight: 16,
  },
  img:{
    height: 68,
    width: 68,
  },
  titleCurso:{
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  nameTeacher:{
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#B8B8D2",
  },
  user:{
    height:10,
    width: 8.5,
    marginRight: 4,
    marginTop: 4,
  },
  contentTeacher:{
    flexDirection: "row",
  },
  contentHours:{
    borderRadius: 30,
    backgroundColor: "#FFEBF0",
    justifyContent:"center",
    alignItems:"center",
    height: 15,
    width: 57,
  },
  textHours:{
    color: "#FF6905",
    fontSize: 10,
    fontFamily: "Poppins-Regular",
  },
  fav:{
    height:17.83,
    width:20,
    right: -70,
  },

})