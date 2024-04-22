import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput, ScrollView, Modal,FileInput } from 'react-native';
import  {RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Link} from 'expo-router'
import Checkbox from 'expo-checkbox';
import useLocalhost from "../hooks/useLocalhost"
import useStorage from '../hooks/useStorage';
import { ModalOK } from '../componentes/modal/modalOK';
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';
import {Picker} from '@react-native-picker/picker';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import * as DocumentPicker from 'expo-document-picker';


SplashScreen.preventAutoHideAsync();

export default function cadastrarCurso(){

    const {getLocalhost} = useLocalhost();
    const [localhost,setLocahost]  = useState("");

    const [modalidade, setModalidade] = useState("ONLINE");
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [link, setLink] = useState("");
    const [aceitouTermos, setAceitouTermos] = useState(false);
    const [telefone, setTelefone] = useState("");
    const [valor,setValor] = useState("");
    const [vagas,setVagas] = useState("");
    const [cep,setCep] = useState("");
    const [numero,setNumero] = useState("")
    const [logradouro, setLogradouro] = useState("")
    const [bairro, setBairro] = useState("")
    const [localidade, setLocalidade] = useState("")
    const [uf, setUf] = useState("");
    const [categoriaId, setCategoriaId] = useState("");

    const [categorias, setCategorias] = useState("")

    const [fetchCategoriasConcluido, setFetchCategoriasConcluido] = useState(false)

    const [modalOKVisible,setModalOKVisible] = useState(false)
    const [modalBADVisible,setModalBADVisible] = useState(false)

    const [textResponse,setTextResponse] = useState("")

    const [modalLoadingVisible, setModalLoadingVisible]= useState(false)

    const {getItem} = useStorage();


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
      async function loadLocalhost(){
        const host = await getLocalhost();
        setLocahost(host);
      }
      loadLocalhost()
    },[])

    useEffect(() => {
        async function getCategorias(){
            if(localhost != ""){
                const token = await getItem("@token")
                fetch(`http://${localhost}:8080/scireclass/categoria`,{
                    method: 'GET',
                        headers:{
                            Authorization: `Bearer ${token}`
                        }
                    }
                ).then(async (response) => {
                    const data = await response.json();
                    if(response.ok){
                        setCategorias(data);
                        setFetchCategoriasConcluido(true);
                    }else{
                        setTextResponse(data.message)
                        setModalBADVisible(true)
                    }
                }).catch((error) => {
                  console.log(error);
                })
        }
        }
        getCategorias();
    },[localhost])

    const handleCadastraCurso = async () =>{

      const id = await getItem("@id");

      if(!nome.trim() || !descricao.trim() || !modalidade.trim() || !link.trim() || !telefone.trim() || !vagas.trim()){
        setTextResponse("Todos os campos precisam ser preenchidos!")
        setModalBADVisible(true)
        return
      }

      if(!aceitouTermos){
        setTextResponse("Para cadastrar um curso é necessário aceitar os termos e condições!")
        setModalBADVisible(true)
        return
      }

      setModalLoadingVisible(true)
      
      const cursoDTO = {
        nome: nome,
        descricao: descricao,
        modalidade:modalidade,
        link:link,
        aceitouTermos: aceitouTermos,
        telefone:telefone,
        ativo: true,
        valor: valor,
        vagas: vagas
      }
      const enderecoDTO = {
        cep: cep,
        numero: numero,
        logradouro: logradouro,
        bairro: bairro,
        localidade: localidade,
        uf: uf
      }
      const categoriaDTO = {
        id: categoriaId,
      }

      const cadastroCursoDTO = {
        cursoDTO: cursoDTO,
        enderecoDTO: enderecoDTO,
        categoriaDTO: categoriaDTO
      }

      fetch(`http://${localhost}:8080/scireclass/curso/save/${id}`,{
        method:"post",
        body: JSON.stringify(cadastroCursoDTO),
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
          setTextResponse("Cadastro do curso realizado com sucesso !")
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

    return(
        <ScrollView>
            <View onLayout={onLayoutRootView} style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Cadastre o seu Curso</Text>
                    <Text style={styles.titleSubText}>Insira os dados abaixo</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.formText}>Modalidade</Text>
                    <RadioButtonGroup  containerStyle={styles.radioGroup}
                        selected={modalidade}
                        onSelected={(value) => setModalidade(value)}
                        radioBackground="#3D5CFF">
                        <RadioButtonItem value="PRESENCIAL" label={<Text style={styles.formText}>Presencial</Text>}/>
                        <RadioButtonItem value="ONLINE" label={<Text style={styles.formText}>Online (Assíncronos)</Text>}/>
                    </RadioButtonGroup>
                    <Text style={styles.formText}>Nome</Text>
                    <TextInput onChangeText={(value) => setNome(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>Descrição</Text>
                    <TextInput onChangeText={(value) => setDescricao(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>Link</Text>
                    <TextInput keyboardType='url' onChangeText={(value) => setLink(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>Telefone</Text>
                    <TextInput keyboardType='phone-pad' onChangeText={(value) => setTelefone(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>Valor</Text>
                    <TextInput keyboardType='numeric' onChangeText={(value) => setValor(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>Vagas</Text>
                    <TextInput keyboardType='number-pad' onChangeText={(value) => setTelefone(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>Categoria</Text>
                    {fetchCategoriasConcluido ?
                    <Picker onValueChange={(itemValue,itemIndex) =>
                        setCategoriaId(itemValue)
                    }>
                        {categorias.map((categoria) => (
                            <Picker.Item label={categoria.nome} value={categoria.id} />
                        ))}
                    </Picker>
                        :
                    <Picker>
                        <Picker.Item label="Carregando..." value="" />
                    </Picker>
                    }
                    <Text style={styles.formText}>CEP</Text>
                    <TextInput keyboardType='phone-pad' value={cep} onBlur={checkCEP} onChangeText={(value) => setCep(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>N° residencial</Text>
                    <TextInput keyboardType='phone-pad' onChangeText={(value) => setNumero(value)} style={styles.formInput}/>
                    <Text style={styles.formText}>Escolha um icone para o seu curso</Text>
                    <View style={{flexDirection:'row'}}>
                        <Checkbox value={aceitouTermos} onValueChange={setAceitouTermos} style={styles.checkBox}/> 
                        <Text style={styles.formText}>Ao cadastrar um curso você tem que concordar com nossos termos e condição.</Text>
                    </View>
                    <TouchableOpacity onPress={handleCadastraCurso} style={styles.formButton}><Text style={styles.buttonText}>Criar Conta</Text></TouchableOpacity>
                </View>
                <Modal visible={modalOKVisible} animationType='fade' transparent={true}>
                  <ModalOK textOK={textResponse} handleClose={() => setModalOKVisible(false)}/>
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