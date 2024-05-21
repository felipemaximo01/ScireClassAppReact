import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, Image, Modal, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import useStorage from "../hooks/useStorage"
import useLocalhost from "../hooks/useLocalhost"
import { ModalOK } from '../componentes/modal/modalOK';
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';

import * as Progress from 'react-native-progress';
SplashScreen.preventAutoHideAsync();

export default function MeusCursos() {
    const { getItem } = useStorage();
    const { getLocalhost } = useLocalhost();
    const router = useRouter();

    const [cursos, setCursos] = useState([]);

    const [modalBADVisible, setModalBADVisible] = useState(false)
    const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
    const [modalOKVisible, setModalOKVisible] = useState(false)

    const [textResponse, setTextResponse] = useState("")

    const [minutosAssitidos, setMinutosAssistidos] = useState(0)

    const [fontsLoaded, fontError] = useFonts({
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

    function carregarNome(nome) {
        if (nome != null && nome != undefined) {
            if (nome.length > 17) {
                return nome.substr(0, 12) + "...";
            }
            return nome
        }
        return "";
    }

    async function getCursosMatriculados() {
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const id = await getItem("@id");

        setModalLoadingVisible(true)
        fetch(`http://${localhost}:8080/scireclass/matricula/curso/all/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                setModalLoadingVisible(false)
                if (response.ok) {
                    setCursos(data);
                } else if (data.message !== undefined) {
                    setTextResponse(data.message)
                    setModalBADVisible(true)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    };

    async function getMinutosAssitidos() {
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const id = await getItem("@id");
        setModalLoadingVisible(true)
        fetch(`http://${localhost}:8080/scireclass/minutosAssistidos/${id}`, {
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
                    setMinutosAssistidos(responseJson.minutos)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    useFocusEffect(
        useCallback(() => {
            getCursosMatriculados();
        }, []))

    useFocusEffect(
        useCallback(() => {
            getMinutosAssitidos();
        }, []))

    const goToCurso = async (cursoId) => {

        router.push({ pathname: `userScire/curso/${cursoId}`, params: cursoId })
    }

    function carregarQuantidadeAulas(quantidadeAulas) {
        if (quantidadeAulas != null && quantidadeAulas != undefined) {
            if (quantidadeAulas <= 0) {
                return 1
            }
            return quantidadeAulas
        }
        return 1;
    }

    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <View style={styles.titlepage}>
                <Text style={styles.titlepagetext}>
                    Meus cursos
                </Text>
            </View>
            <View style={[styles.titleContent, styles.elevation]}>
                <View style={styles.textTitleContent}>
                    <Text style={styles.textBase}>Aprendi hoje</Text>
                </View>
                <View style={styles.progressClass}>
                    <Text style={styles.minDone}>{0}MIN</Text>
                    <Text style={styles.minGoal}>/60min</Text>
                </View>
                <Progress.Bar progress={minutosAssitidos / 60} width={null} height={6} />
            </View>
            <ScrollView>
                <View style={styles.cursosstyleconteiner}>
                    {cursos?.map((curso, i) => (
                        <View key={i} style={[styles.cursosstyle, styles.elevation]}>
                            <Text style={styles.cursotitulo}>{carregarNome(curso.nome)} </Text>
                            <View style={styles.progressbarContainer}>
                                <Progress.Bar progress={curso.quantidadeAulasAssistidas / carregarQuantidadeAulas(curso.quantidadeAulas)} width={null} height={6} />
                            </View>
                            <View style={styles.textConteiner}>
                                <Text style={styles.textcard}>Completado</Text>
                                <Text style={styles.textcardprogress}>{curso.quantidadeAulasAssistidas}/{curso.quantidadeAulas}</Text>
                                <View style={styles.circulo}>
                                    <Pressable onPress={() => goToCurso(curso.id)} style={styles.playContainer}>
                                        <Image style={styles.imgPlay} source={require("../../assets/play.png")} />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
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
    textcardprogress: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20
    },
    playContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    circulo: {
        position: "absolute",
        right: 0,
        height: 45,
        width: 45,
        marginTop: 30,
        backgroundColor: "#FF6905",
        borderRadius: 25,
    },
    imgPlay: {
        height: 50,
        width: 50,
        right: 0,
        top: -2
    },
    progressbarContainer: {
        marginTop: "10%",
    },
    textConteiner: {
        marginTop: "10%",
    },
    textcard: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
    cursotitulo: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16
    },
    cursosstyleconteiner: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
        width: '100%',
        height: '100%'
    },

    cursosstyle: {
        borderRadius: 25,
        paddingTop: 25,
        padding: 10,
        height: 183,
        width: 161,
        margin: 10,
        backgroundColor: "white",
    },
    elevation: {
        elevation: 20
    },
    titlepagetext: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
    },
    titlepage: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        marginTop: "5%",
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleContent: {
        backgroundColor: "#FFFFFF",
        width: "90%",
        height: 100,
        position: 'relative',
        borderRadius: 8,
        margin: 20,
        justifyContent: "center",
        paddingLeft: 12,
        paddingRight: 12
    },
    progressClass: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    textBase: {
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        color: "#858597"
    },
    minDone: {
        fontFamily: "Poppins-Bold",
        fontSize: 20,
        color: "#1F1F39",
        marginRight: 4
    },
    minGoal: {
        fontFamily: "Poppins-Regular",
        fontSize: 10,
        color: "#858597",
        marginTop: 8
    },
})