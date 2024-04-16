import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput, Pressable,Image,Modal } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useRouter} from 'expo-router'
import useStorage from "../hooks/useStorage"
import useLocalhost from "../hooks/useLocalhost"
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';

SplashScreen.preventAutoHideAsync();

export default function Home(){

    const router = useRouter();

    const {getItem} = useStorage();
    const [token,setToken] = useState(null)
    const [id,setId] = useState(null)

    const {getLocalhost} = useLocalhost();
    const [localhost,setLocahost]  = useState("");

    const [usuarioDTO, setUsuarioDTO] = useState("");

    const [modalBADVisible,setModalBADVisible] = useState(false)

    const [modalLoadingVisible, setModalLoadingVisible]= useState(false)

    const [textResponse,setTextResponse] = useState("")
    

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

      useEffect(() =>{
        async function jaLogado(){
          const getToken = await getItem("@token")
          const getId = await getItem("@id")
          if((getToken !== null && getToken !== undefined && getToken !== "") 
                && (getId !== null && getId !== undefined && getId !== "")){
            setToken(getToken)
            setId(getId)
          }else{
            router.replace("/index")
          }
        };
        jaLogado();
      },[])

      useEffect(() =>{
        async function loadLocalhost(){
          const host = await getLocalhost();
          setLocahost(host);
        }
        loadLocalhost()
      },[])
      
      useEffect(() =>{
        async function userById(){
          if(token !== null && id !== null){
          setModalLoadingVisible(true)
          fetch(`http://${localhost}:8080/scireclass/usuario/findbyid/${id}`,{
            headers:{
              Authorization: `Bearer ${token}`
            }
          })
            .then((response) => response.json())
            .then(async (responseJson) => {
          setModalLoadingVisible(false)
          if(responseJson.message !== undefined){
            setTextResponse(responseJson.message)
            setModalBADVisible(true)
          }else{
            setUsuarioDTO(responseJson)
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }

        };
        userById();
      },[token,id])

      return(
        <View onLayout={onLayoutRootView} style={styles.container}>
            <View style={styles.title}>
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Oi, {usuarioDTO.nome}</Text>
                    <Text style={styles.subTitleText}>Vamos começar a aprender!</Text>
                </View>
                <Pressable><Image source={require("../../assets/userIcon.png")} style={styles.userIcon}/></Pressable>
            </View>
            <Modal visible={modalBADVisible} animationType='fade' transparent={true}>
                <ModalBAD textOK={textResponse} handleClose={() => setModalBADVisible(false)}/>
            </Modal>
            <Modal visible={modalLoadingVisible} animationType='fade' transparent={true}>
                <ModalLoading/>
            </Modal>
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
  title: {
      backgroundColor: '#3D5CFF',
      width: "100%",
      height: 160,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
  },
  textContainer: {
      flexDirection: 'column', // Para garantir que os textos fiquem em coluna
      alignItems: 'flex-start', // Alinhar os textos à esquerda
  },
  titleText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 30,
      color: "#FFFFFF",
      marginBottom: 8, // Espaçamento entre os textos
  },
  subTitleText: {
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      color: "#FFFFFF",
  },
  userIcon: {
      height: 49,
      width: 36,
  }
});
