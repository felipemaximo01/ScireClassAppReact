import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, Image, Modal, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import * as Progress from 'react-native-progress';
SplashScreen.preventAutoHideAsync();

export default function MeusCursos() {
    const [cursos,setCursos]=useState([]);
    
    
    


    // Função para obter uma cor com base no índice
    
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


      function carregarNome(nome){
        if(nome!=null && nome!=undefined){
            if(nome.length>17){
                var quebraString =nome.substr(0,12)+"..."
                return quebraString;
            }
            return nome
        }
        return "";

      }
    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <View style={styles.titlepage}>
                <Text style={styles.titlepagetext}>
                    Meus cursos
                </Text>
            </View>
            <View style={[styles.titleContent, styles.elevation]}>
                <View style={styles.textTitleContent}>
                    <Text style={styles.textBase}>Aprendi hoje</Text>

                </View>
                <View style={styles.progressClass}>
                    <Text style={styles.minDone}>{0}MIN</Text>
                    <Text style={styles.minGoal}>/60min</Text>
                </View>
                <Progress.Bar progress={0 / 60} width={null} height={6} />
            </View>
            <ScrollView>
                <View style={styles.cursosstyleconteiner}>
                    <View style={[styles.cursosstyle, styles.elevation]}>
                        <Text style={styles.cursotitulo}>{carregarNome("Titulo do curso")} </Text>
                        <View style={styles.progressbarContainer}>
                            <Progress.Bar progress={0 / 60} width={null} height={6} />
                        </View>

                        <View style={styles.textConteiner}>
                            <Text style={styles.textcard}>Completado</Text>
                            <Text style={styles.textcardprogress}>0/40</Text>
                            <View style={styles.circulo}>
                                <Pressable style={styles.playContainer}>
                                    <Image style={styles.imgPlay} source={require("../../assets/play.png")} />

                                </Pressable>
                            </View>

                        </View>

                    </View>
                </View>

            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    textcardprogress: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20
    },
    playContainer: {
        alignItems: "center",
        justifyContent: "center"

    },
    circulo: {
        position: "absolute",
        right: 0,
        height: 45,
        width: 45,
        marginTop: 30,
        backgroundColor: "#FF6905",
        borderRadius: 25,
    },
    imgPlay: {
        height: 50,
        width: 50,
        right: 0,
        top: -2
    },
    progressbarContainer: {
        marginTop: "10%",
    },
    textConteiner: {
        marginTop: "10%",
    },
    textcard: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
    cursotitulo: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16
    },
    cursosstyleconteiner: {
      
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
    },

    cursosstyle: {
        borderRadius: 25,
        paddingTop: 25,
        padding: 10,
        height: 182,
        width: 160,
        margin: 10,
        backgroundColor: "white",
        
    },
    elevation: {
        elevation: 20
    },
    titlepagetext: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,

      
    },
    titlepage: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:"center",
        marginTop:"5%",
        padding: 10,
        
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleContent: {
        backgroundColor: "#FFFFFF",
        width: "90%",
        height: 100,
        position: 'relative',
        borderRadius: 8,
        margin: 20,
        justifyContent: "center",
        paddingLeft: 12,
        paddingRight: 12
    },
    progressClass: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    textBase: {
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        color: "#858597"
    },
    minDone: {
        fontFamily: "Poppins-Bold",
        fontSize: 20,
        color: "#1F1F39",
        marginRight: 4
      },
      minGoal: {
        fontFamily: "Poppins-Regular",
        fontSize: 10,
        color: "#858597",
        marginTop: 8
      },
})