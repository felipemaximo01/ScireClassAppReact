import { useCallback,useEffect,useState } from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link,Redirect } from 'expo-router'
import AppIntroSlider from 'react-native-app-intro-slider';
import useStorage from './hooks/useStorage';


const slides = [
  {
    key:'1',
    title: 'Uma Grande variedade de cursos',
    text: 'Diversos cursos para você encontre seu caminho para aprender',
    image: require("../assets/illustrationPage1.png"),
    mostraBotao:false
  },
  {
    key:'2',
    title: 'Rápido e fácil aprendizado',
    text: 'Aprendizagem fácil e rápida a qualquer momento para ajudá-le melhorar várias habilidades',
    image: require("../assets/illustrationPage2.png"),
    mostraBotao:false
  },
  {
    key:'3',
    title: 'Crie seu próprio plano de estudo',
    text: 'Estude de acordo com o plano de estudo, para fazer o seu estudo mais motivado',
    image: require("../assets/illustrationPage3.png"),
    mostraBotao:true
  }
]

SplashScreen.preventAutoHideAsync();

export default function Page1() {
  const [showHome,setShowHome] = useState(false);
  const {getItem} = useStorage();

  useEffect(() =>{
    async function jaLogado(){
      const getToken = await getItem("@token")
      const getId = await getItem("@id")
      if((getToken !== null && getToken !== undefined && getToken !== "")
          && (getId !== null && getId !== undefined && getId !== "")){
        setShowHome(true)
      }else{
        setShowHome(false)
      }
    };
    jaLogado();
  },[])

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



  

  function renderSlides({item}){
    return(
      <View onLayout={onLayoutRootView} style={styles.container}>
      <Image
        source={item.image}
        style={styles.page}
      />
      <Text style={styles.titlePage}>{item.title}</Text>
      <Text style={styles.textPage}>{item.text}</Text>
      {item.mostraBotao ? <View  style={styles.buttonArea}>
        <Link href={"/cadastroUsuario"} asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Cadastre-se</Text>
          </TouchableOpacity>
        </Link>
        <Link href={"/login"} asChild>
          <TouchableOpacity style={styles.buttonEntrar}>
            <Text style={styles.buttonTextEntrar}>Entrar</Text>
          </TouchableOpacity>
        </Link>
      </View> : ""}
    </View>
    )
  }

  if(showHome){
    return <Redirect href="/userScire/home" />;
  }else{
    return (
        <AppIntroSlider
          renderItem={renderSlides}
          data={slides}
          activeDotStyle={{
            backgroundColor:"#3D5CFF",
            width:30
          }}
          renderNextButton={() => {}}
          renderDoneButton={() => {}}
        />
    );
  }
  
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
    marginTop:30,
    width:"45%",
    height:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#3D5CFF',
    borderRadius: 8
  },
  buttonEntrar:{
    marginTop:30,
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
    marginTop:2,
    alignItems:"center",
    justifyContent:"space-between",
},

});
