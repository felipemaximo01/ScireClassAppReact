import { useCallback, useState, useEffect } from 'react';
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { ScrollView, View, StyleSheet, Image, Text, Modal, TouchableOpacity, Pressable } from "react-native";
import { useFonts } from 'expo-font';
import useStorage from "../../hooks/useStorage"
import useLocalhost from "../../hooks/useLocalhost"
import { ModalOK } from '../../componentes/modal/modalOK';
import { ModalBAD } from '../../componentes/modal/modalBAD';
import { ModalLoading } from '../../componentes/modal/modalLoading';
import { VideoScreen } from '../../componentes/video.js'
import { Maps } from '../../componentes/maps.js';
import { ModalAvaliacao } from '../../componentes/modal/modalAvaliacao.js';
import analytics from '@react-native-firebase/analytics';

SplashScreen.preventAutoHideAsync();

export default function Curso() {

    const { cursoId } = useLocalSearchParams();

    const [curso, setCurso] = useState([]);

    const [aulas, setAulas] = useState([]);

    const [imagem, setImagem] = useState("");

    const [imageUrl, setImageUrl] = useState("");

    const [videoUrl, setVideoUrl] = useState("")

    const [matricula, setMatricula] = useState(false)

    const [modalBADVisible, setModalBADVisible] = useState(false)
    const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
    const [modalOKVisible, setModalOKVisible] = useState(false)
    const [modalVideoVisible, setModalVideoVisible] = useState(false)
    const [modalAvaliacaoVisible, setModalAvaliacaoVisible] = useState(false)

    const [favoritado, setFavoritado] = useState(false);

    const [textResponse, setTextResponse] = useState("")

    const [online, setOnline] = useState(true)

    const [enderecoUsuario, setEnderecoUsuario] = useState("")
    const [enderecoCurso, setEnderecoCurso] = useState("")

    const { getItem } = useStorage();
    const { getLocalhost } = useLocalhost();

    const [durantionInMinutes, setDurationInMinutes] = useState("")

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
        async function loadLocalhost() {
            const host = await getLocalhost();
            setImageUrl(host);
        }
        loadLocalhost()
    }, [])

    useEffect(() => {
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
                        if (responseJson.modalidade == "ONLINE") {
                            setOnline(true)
                        } else {
                            setOnline(false)
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        cursoById();
    }, [cursoId])

    useEffect(() => {
        async function logCourseView() {

            const usuarioId = await getItem("@id");

            await analytics().logEvent('course_view', {
              course_id: usuarioId,
              user_id: cursoId,
              timestamp: new Date().toISOString(),
            });

            await analytics().setAnalyticsCollectionEnabled(true);
          }

          async function logCourseViewInBackEnd() {

            const usuarioId = await getItem("@id");
            const token = await getItem("@token");
            const localhost = await getLocalhost();

            const userView = {
                usuario : usuarioId,
                curso : cursoId,
                data: new Date().toISOString()
            }
            fetch(`http://${localhost}:8080/scireclass/userview`, {
                method: "post",
                body: JSON.stringify(userView),
                headers:{
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                  }
            }
            )
            .then((response) => response.json() )
            .then(async (responseJson) => {
              setModalLoadingVisible(false)
              if(responseJson.message !== undefined){
              }else{
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          }
          logCourseView();
          logCourseViewInBackEnd();
    }, [cursoId])

    useEffect(() => {
        async function aulaByCursoId() {
            const localhost = await getLocalhost();
            const token = await getItem("@token");
            setModalLoadingVisible(true)
            fetch(`http://${localhost}:8080/scireclass/aula/getlistaulas/${cursoId}`, {
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
                        setAulas(responseJson)
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        aulaByCursoId();
    }, [cursoId])

    useEffect(() => {
        async function imagemByCursoId() {
            const localhost = await getLocalhost();
            const token = await getItem("@token");
            setModalLoadingVisible(true)
            fetch(`http://${localhost}:8080/scireclass/imagem/curso/${cursoId}`, {
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
                        setImagem(responseJson)
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        imagemByCursoId();
    }, [cursoId])

    useEffect(() => {
        const favoritado = async () => {
            const localhost = await getLocalhost();
            const token = await getItem("@token");
            const usuarioId = await getItem("@id");
            fetch(`http://${localhost}:8080/scireclass/usuario/cursoFavoritado/${usuarioId}/${cursoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setFavoritado(data);
                } else if (data.message !== undefined) {
                    setTextResponse(data.message)
                    setModalBADVisible(true)
                }
            }).catch((error) => {
                console.log(error);
            })
        };
        favoritado();
    }, [cursoId])

    const matriculado = async () => {
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");
        fetch(`http://${localhost}:8080/scireclass/matricula/findalunoandcurso/${usuarioId}/${cursoId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setMatricula(true);
            } else if (data.message !== undefined) {
                setMatricula(false)
            }
        }).catch((error) => {
            console.log(error);
        })
    };

    useEffect(() => {
        matriculado();
    }, [cursoId])

    const handlerFavCurso = async () => {

        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");
        setModalLoadingVisible(true)
        fetch(`http://${localhost}:8080/scireclass/usuario/favorita/${usuarioId}/${cursoId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(async (response) => {
            const data = await response.json();
            setModalLoadingVisible(false)
            if (response.ok) {
                if (favoritado === false) {
                    setFavoritado(true)
                    setTextResponse("Favoritado com sucesso")
                    setModalOKVisible(true)
                } else if (favoritado === true) {
                    setFavoritado(false)
                    setTextResponse("O curso foi removido da sua lista de favoritos")
                    setModalOKVisible(true)
                }
            } else if (data.message !== undefined) {
                setTextResponse(data.message)
                setModalBADVisible(true)
            }
        })
    }

    const handlerBuyCurso = async () => {

        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");
        setModalLoadingVisible(true)
        fetch(`http://${localhost}:8080/scireclass/matricula/save/${usuarioId}/${cursoId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(async (response) => {
            const data = await response.json();
            setModalLoadingVisible(false)
            if (response.ok) {
                if (online) {
                    setTextResponse("Matricula realizada com sucesso! N° de matricula: " + data.numeroMatricula)
                    matriculado();
                } else if (!online) {
                    setTextResponse("Foi solicitado um pedido de matricula ao professor, verifiquei sua caixa de mensagens!")
                }
                setModalOKVisible(true)
            } else if (data.message !== undefined) {
                setTextResponse(data.message)
                setModalBADVisible(true)
            }
        })
    }

    const handleButtonVideo = async (aulaId) => {

        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        fetch(`http://${localhost}:8080/scireclass/aula/matricula/${usuarioId}/${aulaId}`, {
            method: "post",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setVideoUrl(`http://${localhost}:8080/scireclass/video/downloadvideo?path=${data.path}`)
                    setModalVideoVisible(true)
                } else {
                    setTextResponse(data.message);
                    setModalBADVisible(true);
                }

            }).catch((error) => {
                console.error('Error:', error);
            })


    }

    async function getEnderecoUsuario() {

        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        fetch(`http://${localhost}:8080/scireclass/endereco/usuario/${usuarioId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setEnderecoUsuario(data)
                } else {
                    setTextResponse(data.message);
                    setModalBADVisible(true);
                }
            }).catch((error) => {
                console.error('Error:', error);
            })

    }

    async function getEnderecoCurso() {

        const localhost = await getLocalhost();
        const token = await getItem("@token");

        fetch(`http://${localhost}:8080/scireclass/endereco/curso/${cursoId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setEnderecoCurso(data)
                } else {
                    setTextResponse(data.message);
                    setModalBADVisible(true);
                }
            }).catch((error) => {
                console.error('Error:', error);
            })

    }
    const handleDirectionsReady = (result) => {
        setDurationInMinutes(result.duration);
    };

    const handleCloseVideo = () => {
        setModalVideoVisible(false);
        setVideoUrl("")
    };

    const handlerAvaliacaoCurso = () => {
        setModalAvaliacaoVisible(true);
    };

    useEffect(() => {
        getEnderecoCurso();
        getEnderecoUsuario();
    }, [!online])

    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            {online ?
                <View style={styles.viewImage}>
                    <Image style={styles.img} source={{ uri: `http://${imageUrl}:8080/scireclass/imagem/downloadImage?path=${imagem.path}` }} />
                </View> :
                <View style={styles.mapContainer}>
                    <Maps enderecoUsuario={`${enderecoUsuario.logradouro}, ${enderecoUsuario.numero} - ${enderecoUsuario.bairro} - ${enderecoUsuario.localidade}`}
                        enderecoCurso={`${enderecoCurso.logradouro}, ${enderecoCurso.numero} - ${enderecoCurso.bairro} - ${enderecoCurso.localidade}`}

                        handleDirectionsReady={handleDirectionsReady} />
                </View>
            }
            <ScrollView style={styles.body}>
                <View>
                    <View style={styles.titleCurso}>
                        <Text style={styles.textTitleCurso}>{curso.nome}</Text><Text style={styles.priceTitleCurso}>R${curso.valor}</Text>
                    </View>
                    <View style={styles.statsCurso}>
                        {online ?
                            <Text style={styles.timeCurso}>Duracao - {curso.quantidadeAulas} Lições</Text>
                            : null}
                        <Text style={styles.avaliacaoCurso}>Avalliação:</Text>
                    </View>
                    {!online ?
                        <View style={styles.enderecoBody}>
                            <Text style={styles.textDistace}>{Math.floor(durantionInMinutes)} minutos de distância</Text>
                            <View style={styles.userEndereco}>
                                <Text style={styles.textEndereco}>{enderecoUsuario.logradouro}, {enderecoUsuario.numero} - {enderecoUsuario.bairro} - {enderecoUsuario.localidade}</Text>
                                <Text style={styles.subtextEndereco}>Casa</Text>
                            </View>
                            <View style={styles.userEndereco}>
                                <Text style={styles.textEndereco}>{enderecoCurso.logradouro}, {enderecoCurso.numero} - {enderecoCurso.bairro} - {enderecoCurso.localidade}</Text>
                                <Text style={styles.subtextEndereco}>Curso</Text>
                            </View>
                        </View> : null
                    }
                    <View style={styles.aboutCurso}>
                        <Text style={styles.titleAbout}>Sobre este curso</Text>
                        <Text style={styles.textAbout}>{curso.descricao}</Text>
                    </View>
                    {aulas?.map((aula, i) => (
                        <View key={i} style={[styles.aulaCurso, styles.alignItemsCenter]}>
                            <View style={styles.leftContent}>
                                <Text style={styles.numberAula}>{aula.ordem + 1}</Text>
                                <View>
                                    <Text style={styles.titleAula}>{aula.nome}</Text>
                                    <Text style={styles.duracaoAula}>{aula.duracao} mins</Text>
                                </View>
                            </View>
                            {matricula ?
                                <Pressable onPress={() => handleButtonVideo(aula.id)} style={styles.buttonPlay}>
                                    <Image style={styles.buttonImg} source={require("../../../assets/buttonPlay.png")} />
                                </Pressable> :
                                <Image style={styles.buttonImg} source={require("../../../assets/locked.png")} />
                            }
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={[styles.viewButton, styles.elevation]}>
                <TouchableOpacity onPress={handlerFavCurso} style={styles.buttonFav}>{!favoritado ?
                    <Image source={require("../../../assets/favoritoIconNot.png")} style={styles.iconButtonFav} />
                    :
                    <Image source={require("../../../assets/favoritoIcon.png")} style={styles.iconButtonFav} />}
                </TouchableOpacity>
                {!matricula ?
                    <TouchableOpacity onPress={handlerBuyCurso} style={styles.buttonBuy}>
                        {online ?
                            <Text style={styles.textButtonBuy}>Comprar agora</Text>
                            :
                            <Text style={styles.textButtonBuy}>Tenho Interesse</Text>
                        }
                    </TouchableOpacity>
                    :

                    <TouchableOpacity onPress={handlerAvaliacaoCurso} style={styles.buttonBuy}>
                        <Text style={styles.textButtonBuy}>Avaliar</Text>
                    </TouchableOpacity>

                }
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
            <Modal visible={modalAvaliacaoVisible} animationType='fade' transparent={true}>
                <ModalAvaliacao cursoId={cursoId} handleClose={() => setModalAvaliacaoVisible(false)}  />
            </Modal>
            <Modal visible={modalVideoVisible} animationType='fade' transparent={true}>
                <VideoScreen onClose={handleCloseVideo} videoPath={videoUrl} />
            </Modal>

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
    viewImage: {
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        height: 276,
        position: "relative",

    },
    img: {
        width: "100%",
        height: "100%"
    },
    body: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: "#FFFFFF",
        width: "100%",
        height: 536,
        position: "relative",
        marginTop: "-5%",
        padding: 8
    },
    titleCurso: {
        justifyContent: 'space-around',
        flexDirection: "row",
        margin: 8
    },
    textTitleCurso: {
        color: "#1F1F39",
        fontFamily: "Poppins-Bold",
        fontSize: 20,
        maxWidth: "90%"
        
    },
    priceTitleCurso: {
        color: "#3D5CFF",
        fontFamily: "Poppins-Bold",
        fontSize: 20
    },
    statsCurso: {
        margin: 8,
    },
    timeCurso: {
        color: "#858597",
        fontFamily: "Poppins-Regular",
        fontSize: 12
    },
    avaliacaoCurso: {
        color: "#858597",
        fontFamily: "Poppins-Regular",
        fontSize: 12
    },
    aboutCurso: {
        margin: 8
    },
    titleAbout: {
        color: "#1F1F39",
        fontFamily: "Poppins-Bold",
        fontSize: 16
    },
    textAbout: {
        color: "#858597",
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        marginBottom: 8
    },
    aulaCurso: {
        margin: 8,
        flexDirection: "row",
        justifyContent: "space-between", // Isso alinha os itens ao longo do eixo principal (horizontal) e coloca espaço entre eles
        alignItems: "center"
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    numberAula: {
        color: "#B8B8D2",
        fontFamily: "Poppins-Regular",
        fontSize: 24,
        marginRight: 20
    },
    titleAula: {
        color: "#1F1F39",
        fontFamily: "Poppins-Regular",
        fontSize: 14
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
    buttonFav: {
        backgroundColor: "#FFEBF0",
        height: 50,
        width: 89,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonBuy: {
        backgroundColor: "#3D5CFF",
        width: 236,
        height: 50,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    textButtonBuy: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Poppins-Regular"
    },
    iconButtonFav: {
        width: 20,
        height: 18
    },
    elevation: {
        elevation: 15,
        shadowColor: '#52006A',
    },
    duracaoAula: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#B8B8D2'
    },
    buttonImg: {
        width: 44.13,
        height: 44
    },
    mapContainer: {
        height: 276, // Adjust height as needed
        width: '100%',
        position: "relative",
    },
    enderecoBody: {
        justifyContent: 'flex-start',
        padding: 8
    },
    textDistace: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: '#1F1F39'
    },
    userEndereco: {
        margin: 8
    },
    cursoEndereco: {
        margin: 8
    },
    textEndereco: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: '#1F1F39'
    },
    subtextEndereco: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#858597'
    }


})