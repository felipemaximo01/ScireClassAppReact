import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link,useRouter} from 'expo-router'
import useStorage from "./hooks/useStorage"
import useLocalhost from "./hooks/useLocalHost"
import { ModalBAD } from './componentes/modal/modalBAD';
import { ModalLoading } from './componentes/modal/modalLoading';

SplashScreen.preventAutoHideAsync();

export default function Login(){

    const router = useRouter();

    const {getLocalhost} = useLocalhost();
    const [localhost,setLocahost]  = useState("");

    const [email,setEmail] = useState("")
    const [senha,setSenha] = useState("")
    const {saveItem} = useStorage();

    const [modalBADVisible,setModalBADVisible] = useState(false)

    const [textResponse,setTextResponse] = useState("")

    const [modalLoadingVisible, setModalLoadingVisible]= useState(false)

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

      const handleLoginUsuario = async () =>{

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if(!senha.trim() || !email.trim()){
          textResponse("Todos os campos precisam ser preenchidos!")
          setModalBADVisible(true)
          return
        }

        if(reg.test(email) === false){
          textResponse("Insira um email válido")
          setEmail("")
          setModalBADVisible(true)
          return
        }

        setModalLoadingVisible(true)

        fetch(`http://${localhost}:8080/scireclass/usuario/login/${email}/${senha}`)
        .then((response) => response.json())
        .then(async (responseJson) => {
          setModalLoadingVisible(false)
          if(responseJson.message !== undefined){
            setTextResponse(responseJson.message)
            setModalBADVisible(true)
          }else{
            await saveItem("@token",responseJson.token)
            await saveItem("@id",responseJson.id)
            router.replace("/userScire/home")
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }

    return(
        <View onLayout={onLayoutRootView} style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>Log in</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.formText}>Seu Email</Text>
                <TextInput value={email} keyboardType='email-address' style={styles.formInput} onChangeText={(value) => setEmail(value)}/>
                <Text style={styles.formText}>Senha</Text>
                <TextInput secureTextEntry={true} style={styles.formInput} onChangeText={(value) => setSenha(value)}/>
                <Link href={"/esqueceuASenha"} style={styles.esqueceuASenha}>Esqueceu a senha ?</Link>
                <TouchableOpacity onPress={handleLoginUsuario} style={styles.formButton}><Text style={styles.buttonText}>Log in</Text></TouchableOpacity>
                <Text style={styles.cadastroText}>Não tem uma conta? <Link href={"/cadastroUsuario"} style={styles.linkCadastra}>Sign up</Link></Text>
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
        marginBottom:20,
        fontFamily:"Poppins-Regular",
        paddingLeft:8
      },
      esqueceuASenha:{
        alignItems:'flex-end',
        justifyContent:'flex-end',
        fontFamily:"Poppins-Regular",
        color:"#858597"
      },
      cadastroText:{
        fontFamily:"Poppins-Regular",
        color:"#858597",
        alignItems:"center",
        justifyContent:"center"
      },
      linkCadastra:{
        color:"#3D5CFF"
      }
})