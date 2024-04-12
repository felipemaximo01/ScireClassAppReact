import { useCallback, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput, ScrollView } from 'react-native';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link, Redirect} from 'expo-router'
import Checkbox from 'expo-checkbox';

SplashScreen.preventAutoHideAsync();

export default function CadastraUsuario(){

    const [perfil, setPerfil] = useState("");
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [email, setEmail] = useState("");
    const [aceitouTermos, setAceitouTermos] = useState(false);
    const [cep,setCep] = useState("")
    const [numero,setNumero] = useState("")

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

    const handleCadastraUsuario = async () =>{
      
      const usuarioDTO = {
        nome: nome,
        senha:senha,
        email:email,
        aceitouTermos: aceitouTermos,
        perfil:perfil,
        ativo: false
      }
      const enderecoDTO = {
        cep: cep,
        numero: numero
      }

      const json = {
        usuarioDTO: usuarioDTO,
        enderecoDTO: enderecoDTO
      }

      fetch(`http://192.168.100.16:8080/scireclass/usuario/save`,{
        method:"post",
        body: JSON.stringify(json),
        headers:{
          "Content-type": "application/json",
          Accept: "application/json"
        }
      })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if(responseJson.message !== undefined){
          alert(responseJson.message)
        }else{
          alert("Cadastro Realizado Com Sucesso, para ativar sua conta verifique a sua caixa de emails.")
          return (<Redirect href="/login" />)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }

    return(
        <ScrollView>
            <View onLayout={onLayoutRootView} style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Cadastre-se</Text>
                    <Text style={styles.titleSubText}>Insira seus dados abaixo e cadastre-se gratuitamente</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.formText}>Tipo Usuário</Text>
                    <RadioButtonGroup containerStyle={styles.radioGroup}
                        selected={perfil}
                        onSelected={(value) => setPerfil(value)}
                        radioBackground="#3D5CFF">
                        <RadioButtonItem value="PROFESSOR" label={<Text style={styles.formText}>Professor</Text>}/>
                        <RadioButtonItem value="ALUNO" label={<Text style={styles.formText}>Aluno</Text>}/>
                    </RadioButtonGroup>
                    <Text style={styles.formText}>Nome</Text>
                    <TextInput onChangeText={(value) => setNome(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>Senha</Text>
                    <TextInput secureTextEntry={true} onChangeText={(value) => setSenha(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>Seu Email</Text>
                    <TextInput onChangeText={(value) => setEmail(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>CEP</Text>
                    <TextInput onChangeText={(value) => setCep(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>N° residencial</Text>
                    <TextInput onChangeText={(value) => setNumero(value)} style={styles.formInput}/>
                    <View style={{flexDirection:'row'}}>
                        <Checkbox value={aceitouTermos} onValueChange={setAceitouTermos} style={styles.checkBox}/> 
                        <Text style={styles.formText}>Ao criar uma conta você tem que concordar com nossos termos e condição.</Text>
                    </View>
                    <Text style={styles.loginText}>Já tem uma conta? <Link href={"/login"} style={styles.linklogin}>Log in</Link></Text>
                    <TouchableOpacity onPress={handleCadastraUsuario} style={styles.formButton}><Text style={styles.buttonText}>Criar Conta</Text></TouchableOpacity>
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
      titleSubText:{
        fontFamily:'Poppins-Regular',
        fontSize:12,
        color:"#B8B8D2"
      },
      form:{
        flex:1,
        backgroundColor:"#FFF",
        padding:16,
        marginTop:3,
        width:"100%",
        height:"100%"
      },
      formText:{
        color:"#858597",
        fontFamily:"Poppins-Regular"
      },
      formInput:{
        borderRadius: 8,
        borderColor:"#B8B8D2",
        borderWidth:1,
        height:45,
        marginBottom:20
      },
      loginText:{
        fontFamily:"Poppins-Regular",
        color:"#858597",
        alignItems:"center",
        justifyContent:"center"
      },
      linklogin:{
        color:"#3D5CFF"
      },
      checkBox:{
        marginRight:6
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
      radioGroup:{
        flexDirection:'row',
        alignItems:"center",
        justifyContent:"space-around",
        
      }
})