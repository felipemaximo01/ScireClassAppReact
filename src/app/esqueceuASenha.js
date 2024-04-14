import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput,Modal } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useRouter} from 'expo-router'
import useLocalhost from "./hooks/useLocalhost"
import { ModalOK } from './componentes/modal/modalOK';

SplashScreen.preventAutoHideAsync();

export default function EsqueceuASenha(){

    const router = useRouter();

    const {getLocalhost} = useLocalhost();
    const [localhost,setLocahost]  = useState("");

    const [email,setEmail] = useState("")

    const [modalVisible,setModalVisible] = useState(false)

    const [textResponse,setTextResponse] = useState("")

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

      useEffect(() =>{
        async function loadLocalhost(){
          const host = await getLocalhost();
          setLocahost(host);
        }
        loadLocalhost()
      },[])

      const handleEsqueceuASenha = async () =>{

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if(!email.trim()){
          alert("Todos os campos precisam ser preenchidos!")
          return
        }

        if(reg.test(email) === false){
          alert("Insira um email válido")
          setEmail("")
          return
        }

        fetch(`http://${localhost}:8080/scireclass/usuario/resetSenha/${email}`)
        .then(async (response) => {
          if(!response.ok){
            alert("ERRO")
          }else{
            const responseData = await response.text();
            console.log(responseData) 
            setTextResponse(responseData)
            setModalVisible(true)
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }

    return(
        <View onLayout={onLayoutRootView} style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>Esqueceu A Senha</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.formText}>Seu Email</Text>
                <TextInput value={email} keyboardType='email-address' style={styles.formInput} onChangeText={(value) => setEmail(value)}/>
                <TouchableOpacity onPress={handleEsqueceuASenha} style={styles.formButton}><Text style={styles.buttonText}>Enviar</Text></TouchableOpacity>
            </View>
            <Modal visible={modalVisible} animationType='fade' transparent={true}>
                <ModalOK textOK={textResponse} handleClose={() => setModalVisible(false)}/>
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
      title:{
        backgroundColor: '#F0F0F2',
        width:"100%",
        height:120,
        justifyContent: 'flex-end',
        padding:16
      },
      titleText:{
        fontFamily:'Poppins-Bold',
        fontSize:30,
        color:"#1F1F39"
      },
      form:{
        flex:1,
        backgroundColor:"#FFF",
        padding:16,
        marginTop:12,
        width:"100%",
        height:"100%"
      },
      formText:{
        color:"#858597",
        fontFamily:"Poppins-Regular"
      },
      formButton:{
        marginTop:20,
        marginBottom:20,
        width:"100%",
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#3D5CFF',
        borderRadius: 8
      },
      buttonText:{
        fontFamily:'Poppins-Regular',
        fontSize:20,
        color:'#fff'
      },
      formInput:{
        borderRadius: 8,
        borderColor:"#B8B8D2",
        borderWidth:1,
        height:45,
        marginBottom:20
      },
})