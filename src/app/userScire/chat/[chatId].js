import { useCallback, useState,useRef,useEffect } from 'react';
import { TouchableOpacity, Image, View, ScrollView, Modal ,TextInput, Text, StyleSheet, Pressable } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import useStorage from "../../hooks/useStorage"
import useLocalhost from "../../hooks/useLocalhost"
import { useFonts } from 'expo-font';
import { Link, useFocusEffect } from 'expo-router';
import {useLocalSearchParams} from "expo-router"
import { ModalOK } from '../../componentes/modal/modalOK';
import { ModalBAD } from '../../componentes/modal/modalBAD';
import { ModalLoading } from '../../componentes/modal/modalLoading';

SplashScreen.preventAutoHideAsync();

export default function Chat() {

    const scrollViewRef = useRef();


    const { chatId } = useLocalSearchParams();

    const [mensagens, setMensagens] = useState([])

    const [perfil, setPerfil] = useState("")

    const [chat,setChat] = useState("");

    const { getItem } = useStorage();
    const { getLocalhost } = useLocalhost();

    const [modalBADVisible, setModalBADVisible] = useState(false)
    const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
    const [modalOKVisible, setModalOKVisible] = useState(false)

    const [textResponse, setTextResponse] = useState("")

    const [textMensagem, setTextMensagem] = useState("")

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../../../assets/fonts/Poppins-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    useEffect(() => {
        async function getUserPerfil() {
            const getPerfil = await getItem("@perfil")
            if (getPerfil !== null && getPerfil !== undefined && getPerfil !== "") {
                setPerfil(getPerfil)
            }
        };
        getUserPerfil();
    }, [])

    async function getChat(){
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        setModalLoadingVisible(true)
        fetch(`http://${localhost}:8080/scireclass/chat/${chatId}/${usuarioId}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(async (response) =>{
            const data = await response.json();
            if(response.ok){
                setChat(data);
                setModalLoadingVisible(false)
            }else{
                setTextResponse(data.message)
                setModalBADVisible(true)
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    async function getMensagens(){
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        fetch(`http://${localhost}:8080/scireclass/chat/getMessage/${chatId}/${usuarioId}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(async (response) =>{
            const data = await response.json();
            if(response.ok){
                setMensagens(data);
            }else{
                setTextResponse(data.message)
                setModalBADVisible(true)
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    async function sendMensagem(){

        if(!textMensagem.trim()){
            return
        }

        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        const mensagemDTO = {
            id: null,
            mensagens: textMensagem,
            instante: null,
            nome: null,
            mine: true
        }

        fetch(`http://${localhost}:8080/scireclass/chat/send/${chatId}/${usuarioId}`,{
            method:'post',
            headers:{
                "Content-type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(mensagemDTO)
        })
        .then(async (response) =>{
            const data = await response.json();
            if(response.ok){
                setTextMensagem("");
                getMensagens();
            }else{
                setTextResponse(data.message)
            }
        })
    }

    async function ativaMatricula(){

        const localhost = await getLocalhost();
        const token = await getItem("@token");
        setModalLoadingVisible(true)

        fetch(`http://${localhost}:8080/scireclass/matricula/ativa/${chat.cursoId}/${chat.usuarioId}/${chatId}`,{
            method:'post',
            headers:{
                "Content-type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(async (response) =>{
            const data = await response.json();
            setModalLoadingVisible(false)
            if(response.ok){
                setTextResponse("Matricula ativa com sucesso!")
                setModalOKVisible(true)
            }else{
                setTextResponse(data.message)
            }
        })
    }

    useFocusEffect(
        useCallback(() => {
            getChat();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            getMensagens();
            const intervalId = setInterval(getMensagens, 1000); // Fetch chats every second

            return () => clearInterval(intervalId);
        }, [])
    );

    const Hours = ({ instant }) => {
        // Converte a string instantânea para um objeto Date
        const date = new Date(instant);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo',
          };
      
        // Formata a data para exibir apenas as horas
        const formattedTime = new Intl.DateTimeFormat('pt-BR', options).format(date); // 'HH:MM'
      
        return (
            <Text style={styles.hour}>{formattedTime}</Text>
        );
      };

    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <View style={styles.title}>
                <Link href="/userScire/mensagem" asChild>
                    <Pressable>
                        <Image style={{width:32, height:24}}  source={require("../../../assets/backButton.png")}/>
                    </Pressable>
                </Link>
                <Image style={styles.img} source={require("../../../assets/fundo.png")} />
                <Text style={styles.namePerson}>{chat.usuario}</Text>   
                {perfil == "PROFESSOR" ?
                <TouchableOpacity style={{marginLeft: 20}} onPress={ativaMatricula}>
                    <Text style={{fontFamily:'Poppins-Bold', color:'#fff'}}>Ativar Matricula</Text>
                </TouchableOpacity> : null
                }
            </View>
            <ScrollView ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            style={{width:'100%'}}>
                {mensagens?.map((mensagem, i) => (
                    <View key={i} style={ mensagem.mine ? styles.msgFrom : styles.msgTo}>
                        <Text style={mensagem.mine ? styles.textFrom : styles.textTo}>{mensagem.mensagens}</Text>
                        <Hours instant={mensagem.instante} />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <TextInput placeholder='Mensagem' value={textMensagem} style={styles.input} onChangeText={(value) => setTextMensagem(value)}></TextInput>
                <TouchableOpacity onPress={sendMensagem}>
                    <Image style={{width:40,height:40}} source={require("../../../assets/sendMensagem.png")}/>
                </TouchableOpacity>
            </View>
            <Modal visible={modalOKVisible} animationType='fade' transparent={true}>
                <ModalOK textOK={textResponse} handleClose={() => setModalOKVisible(false)} />
            </Modal>
            <Modal visible={modalBADVisible} animationType='fade' transparent={true}>
                <ModalBAD textOK={textResponse} handleClose={() => setModalBADVisible(false)} />
            </Modal>
            <Modal visible={modalLoadingVisible} animationType='fade' transparent={true}>
                <ModalLoading />
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
    title: {
        width: '100%',
        height: 125,
        backgroundColor: '#3D5CFF',
        alignItems: 'center',
        padding: 32,
        flexDirection: 'row'

    },
    img: {
        height: 56,
        width: 56,
        margin: 8
    },
    namePerson: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        margin: 8,
    },
    msgFrom:{
        alignItems:'flex-end',
        padding:16,
    },
    msgTo:{
        alignItems:'flex-start',
        padding:16,
    },
    textFrom:{
        fontSize:12,
        fontFamily:'Poppins-Regular',
        backgroundColor:'#CEECFE',
        padding:8,
        borderTopLeftRadius:12,
        borderBottomLeftRadius:12,
        borderBottomRightRadius:12
    },
    textTo:{
        fontSize:12,
        fontFamily:'Poppins-Regular',
        backgroundColor:'#F2F7FB',
        padding:8,
        borderTopRightRadius:12,
        borderBottomLeftRadius:12,
        borderBottomRightRadius:12
    },
    hour:{
        color:'#C4C4C4',
        fontSize:10,
        fontFamily:'Poppins-Bold',
        margin:4
    },
    footer:{
        width:'100%',
        height:70,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    input:{
        width:'80%',
        backgroundColor:'#F3F6F6',
        height:40,
        borderRadius:12,
        padding:8,
        marginRight: 8
    }
})