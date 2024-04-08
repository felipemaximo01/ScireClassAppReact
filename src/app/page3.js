import { useCallback } from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link} from 'expo-router'

SplashScreen.preventAutoHideAsync();

export default function Page3() {
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

  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <Image
        source={require("../assets/illustrationPage3.png")}
        style={styles.page}
      />
      <Text style={styles.titlePage}>Crie seu próprio plano de estudo</Text>
      <Text style={styles.textPage}>Estude de acordo com o plano de estudo, para fazer o seu estudo mais motivado</Text>
      <View  style={styles.buttonArea}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cadastre-se</Text>
        </TouchableOpacity>
        <Link href={"/login"} asChild>
          <TouchableOpacity style={styles.buttonEntrar}>
            <Text style={styles.buttonTextEntrar}>Entrar</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding:5
  },
  page:{
    marginTop: 40,
    marginBottom: 60
  },
  titlePage:{
    fontSize:30,
    textAlign:'center',
    fontFamily:'Poppins-Bold'
  },
  textPage:{
    textAlign:'center',
    fontSize:16,
    fontFamily:'Poppins-Regular'
  },
  button:{
    marginTop:60,
    width:"45%",
    height:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#3D5CFF',
    borderRadius: 8
  },
  buttonEntrar:{
    marginTop:60,
    width:"45%",
    height:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FFF',
    borderRadius: 8,
    borderColor:"#3D5CFF",
    borderWidth:2
  },
  buttonText:{
    fontFamily:'Poppins-Regular',
    fontSize:20,
    color:'#fff'
  },
  buttonTextEntrar:{
    fontFamily:'Poppins-Regular',
    fontSize:20,
    color:'#3D5CFF'
  },
  buttonArea:{
    flexDirection:"row",
    width:"90%",
    marginTop:8,
    alignItems:"center",
    justifyContent:"space-between",
},

});