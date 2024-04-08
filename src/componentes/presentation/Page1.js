import { useCallback } from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export function Page1({navigation}) {
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

  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <Image
        source={require("../../assets/illustrationPage1.png")}
        style={styles.page}
      />
      <Text style={styles.titlePage}>Uma Grande variedade de cursos</Text>
      <Text style={styles.textPage}>Diversos cursos para você encontre seu caminho para aprender</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Page2')}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
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
    marginTop: 60,
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
    margin:60,
    width:"80%",
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
  }

});
