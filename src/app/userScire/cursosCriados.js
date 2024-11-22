import { useCallback, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image, Modal, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter, Link,useFocusEffect } from 'expo-router'
import { ModalOK } from '../componentes/modal/modalOK';
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';
import useLocalhost from "../hooks/useLocalhost";
import useStorage from "../hooks/useStorage";


export default function CursosCriados() {
    const router = useRouter();
    
  const [cursos, setCursos] = useState([])

  const { getLocalhost } = useLocalhost();
  const { getItem } = useStorage();

  const [modalBADVisible, setModalBADVisible] = useState(false)
  const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
  const [modalOKVisible, setModalOKVisible] = useState(false)
  const [textResponse, setTextResponse] = useState("")
  const [imageUrl, setImageUrl] = useState("");

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
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

    async function loadLocalhost() {
        const host = await getLocalhost();
        setImageUrl(host);
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

    async function getCursos() {
        setModalLoadingVisible(true)
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");
    
        fetch(`http://${localhost}:8080/scireclass/curso/criador/${usuarioId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(async (response) => {
          const data = await response.json();
          setModalLoadingVisible(false)
          if (response.ok) {
            setCursos(data)
          } else {
            setTextResponse(data.message)
            setModalBADVisible(true)
          }
        }).catch((error) => {
          console.error('Error:', error);
          setModalLoadingVisible(false)
        });
      }

      useFocusEffect(
        useCallback(() => {
          getCursos();
        }, [])
      )

      
  function carregarNome(nome) {
    if (nome != null && nome != undefined) {
        if (nome.length > 16) {
            return nome.substr(0, 15) + "...";
        }
        return nome
    }
    return "";
}

useEffect(() => {
    loadLocalhost()
  }, [])

  
  const buscar = async (cursoId) => {
    router.push({pathname: `userScire/gerenciarAlunos/${cursoId}`, params: cursoId})
  }

    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <Text style={styles.title}>Meus Curso</Text>
            <View >
                <View>
                    <Pressable style={styles.imgs} ><Image style={styles.imgSearch} source={require("../../assets/SearchIcon.png")} /></Pressable>
                </View>
                <View >
                    <Pressable style={[styles.imgs, { display: visibleSubstract ? 'flex' : 'none' }]} onPress={clearTextInput}><Image style={styles.imgsubtract} source={require("../../assets/subtractIcon.png")} />
                    </Pressable>
                </View>
                <TextInput placeholder='O que você proucura ?' style={styles.formInput} onChangeText={handleInputChange} value={textInputValue} />
            </View>
            <ScrollView style={{height: '100%', width:'100%'}}>
                <View style={styles.scroll}>
                    {cursos?.map((curso, i) => (
                    <Pressable  style={[styles.cards, styles.elavation]} key={i} onPress={() => buscar(curso.id)}>
                            <Image style={styles.imgblank} source={{ uri: `http://${imageUrl}:8080/scireclass/imagem/downloadImage?path=${curso.pathThumbnail}` }} />
                            <View style={styles.nometempo}>
                                <Text style={styles.textcard}>{carregarNome(curso.nome)}</Text>
                                <Text style={styles.tempo}>{curso.minutosTotalCurso} min</Text>
                            </View>
                            <View style={styles.alunos}>
                                <Image style={styles.people} source={require("../../assets/people.png")} />
                                <Text style={styles.textcard}>{curso.numeroDeMatricuals}/{curso.vagas}</Text>
                            </View>
                    </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    nometempo: {
        width:"50%",
        padding: 10,
    },
    tempo: {
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        textAlign: 'center',
        margin: 10,
        width: 70,
        borderRadius: 10,
        backgroundColor: "#FFEBF0",
        color: "#FF6905s"
    },
    alunos: {
        flexDirection: 'row',
        width:"30%",
        justifyContent:"flex-end"
    },
    imgblank: {
        width: 70,
        height: 70
    },
    scroll: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: '100%',
        width:'100%'
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
    textButton: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: "#FFF",
        margin: 10
    },
    textcard: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        margin: 5
    },
    people: {
        width: 20,
        height: 23,


    },
    cards: {
        padding: 16,
        alignItems: 'center',
        flexDirection: "row",
        width: '100%',
        height: 100,
        backgroundColor: "#FFF",
        borderRadius: 10,
        marginBottom: 16
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
        padding: 10,
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
})