import { useCallback } from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link} from 'expo-router'

SplashScreen.preventAutoHideAsync();

export default function Login(){

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
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>Log in</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.formText}>Seu Email</Text>
                <TextInput style={styles.formInput}/>
                <Text style={styles.formText}>Senha</Text>
                <TextInput style={styles.formInput}/>
                <Link href={""} style={styles.esqueceuASenha}>Esqueceu a senha ?</Link>
                <TouchableOpacity style={styles.formButton}><Text style={styles.buttonText}>Log in</Text></TouchableOpacity>
                <Text style={styles.cadastreText}>Não tem uma conta? <Link href={""} style={styles.linkCadastra}>Sign up</Link></Text>
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
      cadastreText:{
        fontFamily:"Poppins-Regular",
        color:"#858597",
        alignItems:"center",
        justifyContent:"center"
      },
      linkCadastra:{
        color:"#3D5CFF"
      }
})