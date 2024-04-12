import { useCallback, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link,Redirect} from 'expo-router'
import useStorage from "./hooks/useStorage"

SplashScreen.preventAutoHideAsync();

export default function Login(){

    const [email,setEmail] = useState("")
    const [senha,setSenha] = useState("")
    const {saveItem} = useStorage();

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

      const handleLoginUsuario = async () =>{
        fetch(`http://192.168.100.16:8080/scireclass/usuario/login/${email}/${senha}`)
        .then((response) => response.json())
        .then(async (responseJson) => {
          if(responseJson.message !== undefined){
            alert(responseJson.message)
          }else{
            await saveItem("@token",responseJson.token)
            return <Redirect href="/userScire/home" />;
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
                <TextInput style={styles.formInput} onChangeText={(value) => setEmail(value)}/>
                <Text style={styles.formText}>Senha</Text>
                <TextInput secureTextEntry={true} style={styles.formInput} onChangeText={(value) => setSenha(value)}/>
                <Link href={""} style={styles.esqueceuASenha}>Esqueceu a senha ?</Link>
                <TouchableOpacity onPress={handleLoginUsuario} style={styles.formButton}><Text style={styles.buttonText}>Log in</Text></TouchableOpacity>
                <Text style={styles.cadastroText}>Não tem uma conta? <Link href={"/cadastroUsuario"} style={styles.linkCadastra}>Sign up</Link></Text>
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