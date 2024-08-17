import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Modal,Platform } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import useStorage from "../hooks/useStorage"
import useLocalhost from "../hooks/useLocalhost"
import { ModalOK } from '../componentes/modal/modalOK';
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';
import { useFocusEffect, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';

SplashScreen.preventAutoHideAsync();

export default function Favoritos() {
    const router = useRouter();

    const [matriculas, setMatriculas] = useState([]);

    const { getItem } = useStorage();
    const { getLocalhost } = useLocalhost();

    const [modalBADVisible, setModalBADVisible] = useState(false)
    const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
    const [modalOKVisible, setModalOKVisible] = useState(false)

    const [textResponse, setTextResponse] = useState("")

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

    async function getMatriculasFinalizadas() {
        setModalLoadingVisible(true)
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        fetch(`http://${localhost}:8080/scireclass/matricula/findfim/${usuarioId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                setModalLoadingVisible(false)
                if (response.ok) {
                    setMatriculas(data)
                } else if (data.message !== undefined) {
                    setTextResponse(data.message)
                    setModalBADVisible(true)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setModalLoadingVisible(false)
            });
    }

    const download = async (matriculaId) => {
        try {
            setModalLoadingVisible(true)
            const localhost = await getLocalhost();
            const token = await getItem("@token");

            const response = await fetch(`http://${localhost}:8080/scireclass/certificado/create/${matriculaId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permissão negada para acessar a biblioteca de mídia');
                    setModalLoadingVisible(false);
                    return;
                }
    
                const blob = await response.blob();
                const fileReaderInstance = new FileReader();
                fileReaderInstance.readAsDataURL(blob);
                fileReaderInstance.onload = async () => {
                    const base64data = fileReaderInstance.result;
                    const fileUri = `${FileSystem.documentDirectory}seu_pdf_${matriculaId}.pdf`;
    
                    await FileSystem.writeAsStringAsync(fileUri, base64data.split(',')[1], {
                        encoding: FileSystem.EncodingType.Base64
                    });
    
                    const asset = await MediaLibrary.createAssetAsync(fileUri);
                    await MediaLibrary.createAlbumAsync('Download', asset, false);
    
                    if (Platform.OS === 'android') {
                        const uri = await FileSystem.getContentUriAsync(fileUri);
                        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                            data: uri,
                            flags: 1,
                            type: 'application/pdf'
                        });
                    } else {
                        await Sharing.shareAsync(fileUri);
                    }
    
                    setModalLoadingVisible(false);
                };
            }else {
                setModalLoadingVisible(false)
                console.error('Erro ao gerar o PDF');
            }
        } catch (error) {
            console.error('Erro ao baixar o PDF:', error);
            setModalLoadingVisible(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            getMatriculasFinalizadas();
        }, [])
    )


    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>Certificados</Text>
            </View>
            {matriculas?.map((matricula, i) => (
                <Pressable key={i} onPress={() => download(matricula.id)} style={[styles.card, styles.elevation]} >
                    <View>
                        <Text style={styles.titleCurso}>{matricula.nomeCurso}</Text>
                        <View style={styles.contentTeacher}>
                            <Image style={styles.user} source={require("../../assets/Union.png")} />
                            <Text style={styles.nameTeacher}>{matricula.nomeProfessor}</Text>
                        </View>
                    </View>
                </Pressable>
            ))}
            <Modal visible={modalOKVisible} animationType='fade' transparent={true}>
                <ModalOK textOK={textResponse} handleClose={() => setModalOKVisible(false)} />
            </Modal>
            <Modal visible={modalBADVisible} animationType='fade' transparent={true}>
                <ModalBAD textOK={textResponse} handleClose={() => setModalBADVisible(false)} />
            </Modal>
            <Modal visible={modalLoadingVisible} animationType='fade' transparent={true}>
                <ModalLoading />
            </Modal>
        </View>)
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    elevation: {
        elevation: 20,
        shadowColor: '#52006A',
    },
    card: {
        backgroundColor: "#FFFFFF",
        width: "90%",
        height: 100,
        borderRadius: 8,
        flexDirection: "row",
        padding: 12,
        marginTop: 12,
        alignItems: 'center'
    },
    title: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
    },
    titleText: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
    },
    viewImagem: {
        height: 68,
        width: 68,
        borderRadius: 8,
        marginRight: 16,
    },
    img: {
        height: 68,
        width: 68,
        borderRadius: 8,
    },
    titleCurso: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
    },
    nameTeacher: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#B8B8D2",
    },
    user: {
        height: 12,
        width: 10.5,
        marginRight: 4,
        marginTop: 4,
    },
    contentTeacher: {
        flexDirection: "row",
    },
    contentHours: {
        borderRadius: 30,
        backgroundColor: "#FFEBF0",
        justifyContent: "center",
        alignItems: "center",
        height: 15,
        width: 57,
    },
    textHours: {
        color: "#FF6905",
        fontSize: 10,
        fontFamily: "Poppins-Regular",
    },
    fav: {
        height: 17.83,
        width: 20,
        marginLeft: "60%"
    },


})