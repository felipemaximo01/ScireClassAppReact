import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput, ScrollView, Modal,ActivityIndicator } from 'react-native';
import  {RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link,useRouter} from 'expo-router'
import Checkbox from 'expo-checkbox';
import useLocalhost from "./hooks/useLocalhost"
import { ModalOK } from './componentes/modal/modalOK';
import { ModalBAD } from './componentes/modal/modalBAD';
import { ModalLoading } from './componentes/modal/modalLoading';

SplashScreen.preventAutoHideAsync();

export default function CadastraUsuario(){

    const router = useRouter();

    const {getLocalhost} = useLocalhost();
    const [localhost,setLocahost]  = useState("");

    const [perfil, setPerfil] = useState("ALUNO");
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [email, setEmail] = useState("");
    const [aceitouTermos, setAceitouTermos] = useState(false);
    const [cep,setCep] = useState("")
    const [numero,setNumero] = useState("")
    const [logradouro, setLogradouro] = useState("")
    const [bairro, setBairro] = useState("")
    const [localidade, setLocalidade] = useState("")
    const [uf, setUf] = useState("")

    const [modalOKVisible,setModalOKVisible] = useState(false)
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

    const handleCadastraUsuario = async () =>{

      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

      if(!nome.trim() || !senha.trim() || !email.trim() || !cep.trim() || !numero.trim()){
        setTextResponse("Todos os campos precisam ser preenchidos!")
        setModalBADVisible(true)
        return
      }

      if(reg.test(email) === false){
        setTextResponse("Insira um email válido!")
        setEmail("")
        setModalBADVisible(true)
        return
      }

      if(!aceitouTermos){
        setTextResponse("Para criar uma conta é necessário aceitar os termos e condições!")
        setModalBADVisible(true)
        return
      }

      setModalLoadingVisible(true)
      
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
        numero: numero,
        logradouro: logradouro,
        bairro: bairro,
        localidade: localidade,
        uf: uf
      }

      const cadastroDTO = {
        usuarioDTO: usuarioDTO,
        enderecoDTO: enderecoDTO
      }

      fetch(`http://${localhost}:8080/scireclass/usuario/save`,{
        method:"post",
        body: JSON.stringify(cadastroDTO),
        headers:{
          "Content-type": "application/json",
          Accept: "application/json"
        }
      })
      .then((response) => response.json() )
      .then(async (responseJson) => {
        setModalLoadingVisible(false)
        if(responseJson.message !== undefined){
          setTextResponse(responseJson.message)
          setModalBADVisible(true)
        }else{
          setTextResponse("Cadastro Realizado Com Sucesso, para ativar sua conta verifique a sua caixa de emails.")
          setModalOKVisible(true)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }

    const checkCEP = () =>{
      if(cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(res => res.json())
          .then(data => {
            if (!data.erro) {
              setLogradouro(data.logradouro);
              setBairro(data.bairro);
              setLocalidade(data.localidade);
              setUf(data.uf);
            } else {
                alert("CEP inválido. Por favor, verifique o CEP inserido.");
                setCep("")
            }
          })
      } else {
        alert("CEP inválido. Por favor, verifique o CEP inserido.");
        setCep("")
      }
    }

    const handleClose = () => {
      setModalOKVisible(false);
      router.replace("/login");
  };

    return(
        <ScrollView>
            <View onLayout={onLayoutRootView} style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Cadastre-se</Text>
                    <Text style={styles.titleSubText}>Insira seus dados abaixo e cadastre-se gratuitamente</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.formText}>Tipo Usuário</Text>
                    <RadioButtonGroup  containerStyle={styles.radioGroup}
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
                    <Text value={email} style={styles.formText}>Seu Email</Text>
                    <TextInput keyboardType='email-address' onChangeText={(value) => setEmail(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>CEP</Text>
                    <TextInput keyboardType='phone-pad' value={cep} onBlur={checkCEP} onChangeText={(value) => setCep(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>N° residencial</Text>
                    <TextInput keyboardType='phone-pad' onChangeText={(value) => setNumero(value)} style={styles.formInput}/>
                    <View style={{flexDirection:'row'}}>
                        <Checkbox value={aceitouTermos} onValueChange={setAceitouTermos} style={styles.checkBox}/> 
                        <Text style={styles.formText}>Ao criar uma conta você tem que concordar com nossos termos e condição.</Text>
                    </View>
                    <Text style={styles.loginText}>Já tem uma conta? <Link href={"/login"} style={styles.linklogin}>Log in</Link></Text>
                    <TouchableOpacity onPress={handleCadastraUsuario} style={styles.formButton}><Text style={styles.buttonText}>Criar Conta</Text></TouchableOpacity>
                </View>
                <Modal visible={modalOKVisible} animationType='fade' transparent={true}>
                  <ModalOK textOK={textResponse} handleClose={handleClose}/>
                </Modal>
                <Modal visible={modalBADVisible} animationType='fade' transparent={true}>
                  <ModalBAD textOK={textResponse} handleClose={() => setModalBADVisible(false)}/>
                </Modal>
                <Modal visible={modalLoadingVisible} animationType='fade' transparent={true}>
                  <ModalLoading/>
                </Modal>
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
        marginBottom:20,
        fontFamily:"Poppins-Regular",
        paddingLeft:8
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