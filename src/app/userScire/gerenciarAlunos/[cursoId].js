import { useCallback, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image, Modal, TextInput,TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useLocalSearchParams } from "expo-router";
import { ModalOK } from '../../componentes/modal/modalOK';
import { ModalBAD } from '../../componentes/modal/modalBAD';
import { ModalLoading } from '../../componentes/modal/modalLoading';
import useLocalhost from "../../hooks/useLocalhost";
import useStorage from "../../hooks/useStorage"
import {Link,useRouter,useFocusEffect} from 'expo-router'


export default function GerenciarAlunos() {

    const { cursoId } = useLocalSearchParams();

    const router = useRouter();

    const { getItem } = useStorage();
    const { getLocalhost } = useLocalhost();

    const [alunos, setAlunos] = useState([])

    const [curso,setCurso] = useState("")

    const [modalBADVisible, setModalBADVisible] = useState(false)
    const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
    const [modalOKVisible, setModalOKVisible] = useState(false)
    const [textResponse, setTextResponse] = useState("")

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../../../assets/fonts/Poppins-Bold.ttf'),
    });
    const [visibleSubstract, setVisibleSubstract] = useState(false)
    const [textInputValue, setTextInputValue] = useState('');
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

        async function alunosById() {
            const localhost = await getLocalhost();
            const token = await getItem("@token");
            setModalLoadingVisible(true)
            fetch(`http://${localhost}:8080/scireclass/matricula/alunosPorCurso/${cursoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    setModalLoadingVisible(false)
                    if (responseJson.message !== undefined) {
                        setTextResponse(responseJson.message)
                        setModalBADVisible(true)
                    } else {
                        setAlunos(responseJson)
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

    

        async function cursoById() {
            const localhost = await getLocalhost();
            const token = await getItem("@token");
            setModalLoadingVisible(true)
            fetch(`http://${localhost}:8080/scireclass/curso/findid/${cursoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    setModalLoadingVisible(false)
                    if (responseJson.message !== undefined) {
                        setTextResponse(responseJson.message)
                        setModalBADVisible(true)
                    } else {
                        setCurso(responseJson)
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }


    function showClearText(text) {
        if (text.length > 0) {
            setVisibleSubstract(true);
        } else {
            setVisibleSubstract(false);
        }
    }

    const clearTextInput = () => {
        setTextInputValue('');
        setVisibleSubstract(false)
    };

    const handleInputChange = (text) => {
        setTextInputValue(text);
        showClearText(textInputValue);
        updateVisibleSubstract(text);
    };
    const updateVisibleSubstract = (text) => {
        if (text && text.trim().length > 0) {
            setVisibleSubstract(true);
        } else {
            setVisibleSubstract(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cursoById();
            alunosById();
        }, [cursoId])
      )

    const handleExcluirCurso = async (cursoId) => {

        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");
        setModalLoadingVisible(true)
        fetch(`http://${localhost}:8080/scireclass/curso/excluir/${cursoId}/${usuarioId}`, {
            method: "delete",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(async (response) =>{
            setModalLoadingVisible(false)
            setTextResponse("Curso excluido com sucesso")
            setModalOKVisible(true)
            
        })

    }

    const handleEditarCurso = async (cursoId) => {

        router.replace(`/userScire/editarCurso/${cursoId}`);
    }

    const handleClose = () => {
        setModalOKVisible(false);
        router.replace("/userScire/homeProfessor");
    };

    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <Text style={styles.title}>{curso.nome}</Text>
            <View style={{padding: 10}}>
                <View>
                    <Pressable style={styles.imgs} ><Image style={styles.imgSearch} source={require("../../../assets/SearchIcon.png")} /></Pressable>
                </View>
                <View >
                    <Pressable style={[styles.imgs, { display: visibleSubstract ? 'flex' : 'none' }]} onPress={clearTextInput}><Image style={styles.imgsubtract} source={require("../../../assets/subtractIcon.png")} />
                    </Pressable>
                </View>
                <TextInput placeholder='O que você proucura ?' style={styles.formInput} onChangeText={handleInputChange} value={textInputValue} />
            </View>
            <ScrollView >
                {alunos?.map((aluno, i) =>(
                <View key={i} style={styles.scroll}>
                    <View style={[styles.cards, styles.elavation]}>
                        <Image style={styles.people} source={require("../../../assets/people.png")} />
                        <Text style={styles.textcard}>{aluno.nome}</Text>
                        <Pressable style={styles.button}><Text style={styles.textButton}>Cancelar Matricula</Text></Pressable>
                    </View>
                </View>
                ))}
            </ScrollView>
            <View style={[styles.viewButton, styles.elevation]}>
                    <TouchableOpacity onPress={() => handleEditarCurso(curso.id)} style={styles.button}>
                        <Text style={styles.textButtonBuy}>Editar Curso</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleExcluirCurso(curso.id)} style={styles.buttonExcluir}>
                        <Text style={styles.textButtonBuy}>Excluir Curso</Text>
                    </TouchableOpacity>
            </View>
            <Modal visible={modalOKVisible} animationType='fade' transparent={true}>
                <ModalOK textOK={textResponse} handleClose={handleClose} />
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
    scroll:{
        justifyContent: 'center',
        alignItems: 'center',
        padding:10
    },
    elevation: {
        elevation: 15,
        shadowColor: '#52006A',
    },
    textButtonBuy: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Poppins-Regular"
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 180,
        height: 50,
        padding: 1,
        borderRadius: 10,
        backgroundColor: "#3D5CFF"
    },
    buttonExcluir: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 180,
        height: 50,
        padding: 1,
        borderRadius: 10,
        backgroundColor: "#CF0E0E"
    },
    
    buttonBuy: {
        backgroundColor: "#3D5CFF",
        width: 236,
        height: 50,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    textButton: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: "#FFF",
        margin: 10
    },
    textcard: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        margin: 10
    },
    people: {
        width: 20,
        height: 23,
        margin: 5,
        marginTop:0,
    },
    cards: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        width: '100%',
        height: 100,
        backgroundColor: "#FFF",
        margin:10,


        borderRadius: 10,
    },
    elavation: {
        elevation: 20,
        shadowColor: '#52006A',

    },

    title: {
        fontFamily: "Poppins-Bold",
        fontSize: 24,
        margin: 10,
    },
    container: {


        width: "100%",
        height: "100%",
        backgroundColor: '#FFFFFF'
    },

    imgSearch: {
        width: 20,
        height: 20,
        position: 'absolute',
        margin: 12,
        zIndex: 3
    },
    imgsubtract: {
        width: 21,
        height: 21,
        position: 'absolute',
        margin: 12,
        right: 0,
        zIndex: 3
    },
    imgs: {
        zIndex: 5
    },
    formInput: {
        borderRadius: 8,
        borderColor: "#B8B8D2",
        borderWidth: 1,
        backgroundColor: "#F0F0F2",
        height: 45,
        marginBottom: 20,
        width: "100%",
        fontFamily: "Poppins-Regular",
        paddingLeft: 50
    },
    viewButton: {
        position: 'relative',
        backgroundColor: "#FFFFFF",
        width: "100%",
        height: 98,
        padding: 12,
        flexDirection: "row",
        justifyContent: 'space-around',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
})