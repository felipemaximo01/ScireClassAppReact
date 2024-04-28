import { useCallback, useState, useEffect } from 'react';
import { SplashScreen } from "expo-router";
import { ScrollView, View,StyleSheet, Image, Text,Modal,TouchableOpacity } from "react-native";
import { useFonts } from 'expo-font';
import useStorage from "../hooks/useStorage"
import useLocalhost from "../hooks/useLocalhost"
import { ModalOK } from '../componentes/modal/modalOK';
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';

SplashScreen.preventAutoHideAsync();

export default function Curso({cursoId}){

    const [curso,setCurso] = useState();

    const [modalBADVisible,setModalBADVisible] = useState(false)
    const [modalLoadingVisible, setModalLoadingVisible]= useState(false)
    const [modalOKVisible,setModalOKVisible] = useState(false)

    const [textResponse,setTextResponse] = useState("")

    const [fetchConcluida, setFetchConcluida] = useState(false)

    const {getItem} = useStorage();
    const {getLocalhost} = useLocalhost();

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
        async function cursoById(){
            const localhost = await getLocalhost();
            const token = await getItem("@token");

            cursoId = '662e09bf311c630d666e764a';
            setModalLoadingVisible(true)
            fetch(`http://${localhost}:8080/scireclass/curso/findid/${cursoId}`,{
                headers:{
                Authorization: `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
            setModalLoadingVisible(false)
            if(responseJson.message !== undefined){
                setTextResponse(responseJson.message)
                setModalBADVisible(true)
                setFetchConcluida(true)
            }else{
                setCurso(responseJson)
                setFetchConcluida(true)
            }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
        }
            cursoById();
        },[])

    return(
            <View onLayout={onLayoutRootView} style={styles.container}>
                {fetchConcluida ?
                <>
                <View style={styles.viewImage}>
                    <Image style={styles.img} source={require("../../assets/testeTelaCurso.jpg")}/>
                </View>
                <ScrollView style={styles.body}>
                    <View>
                        <View style={styles.titleCurso}>
                            <Text style={styles.textTitleCurso}>{curso.nome}</Text><Text style={styles.priceTitleCurso}>R${curso.valor}</Text>
                        </View>
                        <View style={styles.statsCurso}>
                            <Text style={styles.timeCurso}>Duracao - Quantidade De Aulas</Text>
                            <Text style={styles.avaliacaoCurso}>Avalliação:</Text>
                        </View>
                        <View style={styles.aboutCurso}>
                            <Text style={styles.titleAbout}>Sobre este curso</Text>
                            <Text style={styles.textAbout}>{curso.descricao}</Text>
                        </View>
                        <View style={styles.aulaCurso}>
                            <Text style={styles.numberAula}>01</Text>
                            <Text style={styles.titleAula}>Bem-vindo ao Curso</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.viewButton}>
                    <TouchableOpacity style={styles.buttonFav}><Image source={require("../../assets/iconButtonFav.png")} style={styles.iconButtonFav}/></TouchableOpacity>
                    <TouchableOpacity style={styles.buttonBuy}><Text style={styles.textButtonBuy}>Comprar agora</Text></TouchableOpacity>
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
                </> :                 
                <Modal visible={modalLoadingVisible} animationType='fade' transparent={true}>
                  <ModalLoading/>
                </Modal>}
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    viewImage:{
        alignItems:'center',
        justifyContent:'center',
        width:"100%",
        height:276,
        position:"relative",

    },
    img:{
        width:"100%",
        height:"100%"
    },
    body:{
        borderTopLeftRadius:8,
        borderTopRightRadius:8,
        backgroundColor:"#FFFFFF",
        width:"100%",
        height:536,
        position:"relative",
        marginTop:"-5%",
        padding:8
    },
    titleCurso:{
        justifyContent:'space-around',
        flexDirection:"row",
        margin:8
    },
    textTitleCurso:{
        color:"#1F1F39",
        fontFamily:"Poppins-Bold",
        fontSize:20
    },
    priceTitleCurso:{
        color:"#3D5CFF",
        fontFamily:"Poppins-Bold",
        fontSize:20
    },
    statsCurso:{
        margin:8,
    },
    timeCurso:{
        color:"#858597",
        fontFamily:"Poppins-Regular",
        fontSize:12
    },
    avaliacaoCurso:{
        color:"#858597",
        fontFamily:"Poppins-Regular",
        fontSize:12
    },
    aboutCurso:{
        margin:8
    },
    titleAbout:{
        color:"#1F1F39",
        fontFamily:"Poppins-Bold",
        fontSize:16
    },
    textAbout:{
        color:"#858597",
        fontFamily:"Poppins-Regular",
        fontSize:12,
        marginBottom:8
    },
    aulaCurso:{
        margin:8,
        flexDirection:"row"
    },
    numberAula:{
        color:"#B8B8D2",
        fontFamily:"Poppins-Regular",
        fontSize:24,
        marginRight:20
    },
    titleAula:{
        color:"#1F1F39",
        fontFamily:"Poppins-Regular",
        fontSize:14
    },
    viewButton:{
        backgroundColor:"#FFFFFF",
        width:"100%",
        height:98,
        position:"relative",
        flexDirection:"row",
        justifyContent:'space-around',
    },
    buttonFav:{
        backgroundColor:"#FFEBF0",
        height:50,
        width:89,
        borderRadius:8,
        alignItems:"center",
        justifyContent:"center"
    },
    buttonBuy:{
        backgroundColor:"#3D5CFF",
        width:236,
        height:50,
        borderRadius:8,
        alignItems:"center",
        justifyContent:"center"
    },
    textButtonBuy:{
        color:"#FFFFFF",
        fontSize:16,
        fontFamily:"Poppins-Regular"
    },
    iconButtonFav:{
        width:20,
        height:18
    }


})