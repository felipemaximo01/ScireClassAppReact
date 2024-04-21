import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, Image, Modal, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Link, useRouter } from 'expo-router';
import useLocalhost from "../hooks/useLocalHost";
import { Rating } from '@mui/material';




export default function Procurar() {
  const router = useRouter();

  const { getLocalhost } = useLocalhost();
  const [localhost, setLocahost] = useState("");

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
  });

  const buscar = async () => {
    fetch(`http://${localhost}:8080/scireclass/usuario/login/`)
      .then((response) => response.json())
      .then(async (responseJson) => {
        setModalLoadingVisible(false)
        if (responseJson.message !== undefined) {
          setTextResponse(responseJson.message)
          setModalBADVisible(true)
        } else {
          await saveItem("@token", responseJson.token)
          await saveItem("@id", responseJson.id)
          router.replace("/userScire/home")
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Procurar</Text>
            <View >
              <View>
                <Pressable style={styles.imgs} ><Image style={styles.imgSearch} source={require("../../assets/SearchIcon.png")} /></Pressable>
              </View>
              <View>
              <Pressable style={styles.imgs} ><Image style={styles.imgsubtract} source={require("../../assets/subtractIcon.png")} /></Pressable>
                
              </View>

              <View>
                <Pressable style={styles.imgs} ><Image style={styles.imgFilter} source={require("../../assets/filterIcon.png")} /></Pressable>

              </View>
              <TextInput placeholder='O que você proucura ?' style={styles.formInput} />

            </View>

            <Text style={styles.cardsText}>Descubra por novos cursos!</Text></View>
          <View style={styles.filtro}>
            <Pressable >
              <Text style={styles.textButton}>Novo</Text>

            </Pressable>
            <Pressable >
              <Text style={styles.textButton}>Popular</Text>
            </Pressable >
            <Pressable >
              <Text style={styles.textButton}>Mais vendidos</Text>
            </Pressable >
          </View>

          <View style={[styles.card, styles.elevation]} >
            <Image style={styles.imgFavNot} source={require("../../assets/favoritoIconNot.png")}></Image>
            <Image style={styles.imgCard} source={require("../../assets/cardIcon.png")} />

            <Text style={styles.cardTextTitle}>Nome do curso</Text>
            <Text style={styles.cardText}>Nome do professor</Text>


          </View>
          



        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  imgs: {
    zIndex: 5
  },
  imgFavNot:{
    width: 27,
    height: 25,
    position: 'absolute',
    margin: 15,
    right: 0,
    zIndex: 3
  },
  filtro: {
    flexDirection: "row",

  },
  imgsubtract: {
    width: 20,
    height: 20,
    position: 'absolute',
    margin: 12,
    right: 30,
    zIndex: 3
  },
  imgFilter: {
    width: 20,
    height: 20,
    position: 'absolute',
    margin: 12,
    right: 0,
    zIndex: 3
  },
  imgSearch: {
    width: 20,
    height: 20,
    position: 'absolute',
    margin: 12,
    zIndex: 3
  },
  title: {
    backgroundColor: '#FFF',
    width: "100%",
    height: 100,
    justifyContent: 'center',
    padding: 0
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    textAlign: 'center',
    color: "#1F1F39",
    marginTop: 30
  },
  form: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: 0,
    width: "100%",
    height: "100%"
  },
  formText: {
    color: "#858597",
    fontFamily: "Poppins-Regular",
    marginTop: 35


  },
  textButton: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 50,
    position: "relative",
    color: '#000',
    margin: 10
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#fff'
  },
  formInput: {
    borderRadius: 8,
    borderColor: "#B8B8D2",
    borderWidth: 1,
    backgroundColor: "#F0F0F2",
    height: 45,
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
    paddingLeft: 50
  },



  card: {
    backgroundColor: "#FFF",
    width: "100%",
    height: 110,
    marginTop: 10,
    borderRadius: 10,
    padding: 20
  },
  elevation: {
    elevation: 20,
    shadowColor: '#52006A',
  },
  cardTextTitle: {
    fontFamily: "Poppins-Bold",
    color: "#1F1F39",
    fontSize: 12,
    position: "absolute",
    padding: 8,
    marginLeft: 130,
    marginTop: 5,
    zIndex: 1
  },
  cardsText: {
    fontFamily: "Poppins-Bold",
    color: "#1F1F39",
    fontSize: 18,
    position: "relative",
    padding: 8,


  },
  cardText: {
    fontFamily: "Poppins-Bold",
    color: "#B8B8D2",
    fontSize: 10,
    position: "absolute",
    textAlign: "center",
    padding: 8,
    marginLeft: 130,
    marginTop: 30,

  },
  imgCard: {
    width: 80,
    height: 80,

  },


})