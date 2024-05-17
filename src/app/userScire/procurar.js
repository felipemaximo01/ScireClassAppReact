import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, Modal, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import useLocalhost from "../hooks/useLocalhost";
import { ModalFilter } from '../componentes/modal/modalFilter';
import { ModalOK } from '../componentes/modal/modalOK';
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';
import useStorage from "../hooks/useStorage"
import { useNavigation } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

export default function Procurar() {
  const navigation = useNavigation();

  const { getLocalhost } = useLocalhost();
  const { getItem } = useStorage();
  const [visibleSubstract, setVisibleSubstract] = useState(false)
  const [textInputValue, setTextInputValue] = useState('');
  const [modalFilterVisible, setModalFilterVisible] = useState(false)
  const [imageUrl, setImageUrl] = useState("");

  const [modalBADVisible, setModalBADVisible] = useState(false)
  const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
  const [modalOKVisible, setModalOKVisible] = useState(false)
  const [textResponse, setTextResponse] = useState("")

  const [cursos, setCursos] = useState([])

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

  useEffect(() => {
    async function loadLocalhost() {
      const host = await getLocalhost();
      setImageUrl(host);
    }
    loadLocalhost()
  }, [])

  function filterShow() {
    setModalFilterVisible(true)
  }

  function showClearText(text) {
    if (text && text.trim().length > 0) {
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

  useEffect(() => {
    async function getCursos() {
      const localhost = await getLocalhost();
      const token = await getItem("@token");

      setModalLoadingVisible(true)

      fetch(`http://${localhost}:8080/scireclass/curso`, {
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
      })
    }
    getCursos();
  }, [])

  const buscar = async (cursoId) => {
    navigation.navigate('curso', {cursoId: cursoId})
  }
  const favoritar = async () => {
    console.log("fav")
  }

  return (
    <ScrollView>
      <View onLayout={onLayoutRootView} style={styles.form}>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Procurar</Text>
            <View >
              <View>
                <Pressable style={styles.imgs} ><Image style={styles.imgSearch} source={require("../../assets/SearchIcon.png")} /></Pressable>
              </View>
              <View >
                <Pressable style={[styles.imgs, { display: visibleSubstract ? 'flex' : 'none' }]} onPress={clearTextInput}><Image style={styles.imgsubtract} source={require("../../assets/subtractIcon.png")} />
                </Pressable></View>
              <View>
                <Pressable onPress={filterShow} style={styles.imgs} ><Image style={styles.imgFilter} source={require("../../assets/filterIcon.png")} /></Pressable>
              </View>
              <TextInput placeholder='O que você proucura ?' style={styles.formInput} onChangeText={handleInputChange} value={textInputValue} />
            </View>
            <Text style={styles.cardsText}>Descubra por novos cursos!</Text></View>
          <View style={styles.filtro}>
            <Pressable >
              <Text style={styles.textButton}>Novo</Text>
            </Pressable>
            <Pressable >
              <Text style={styles.textButton}>Popular</Text>
            </Pressable >
            <Pressable >
              <Text style={styles.textButton}>Mais vendidos</Text>
            </Pressable >
          </View>
          {cursos?.map((curso, i) => (
          <Pressable key={i} onPress={() => buscar(curso.id)} style={[styles.card, styles.elevation]}>
          <View   >
          <Pressable onPress={favoritar}><Image style={styles.imgFavNot} source={require("../../assets/favoritoIconNot.png")}></Image></Pressable>
              <Image  style={styles.imgCard} source={{ uri: `http://${imageUrl}:8080/scireclass/imagem/downloadImage?path=${curso.pathThumbnail}` }} />
              <Text style={styles.cardTextTitle}>{curso.nome}</Text>
              <Text style={styles.cardText}>{curso.nomeCriador}</Text>
              <Text style={styles.cardTextPrice}>R${curso.valor}</Text>
              <View style={styles.horas}>
                <Text style={styles.horasText} >{curso.minutosTotalCurso} min</Text>
              </View>
          </View></Pressable>))}
         
         
        </View>
        <Modal visible={modalFilterVisible} animationType='slide' transparent={true}>
          <ModalFilter handleClose={() => setModalFilterVisible(false)} />
        </Modal>
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
  horas: {
    position: "absolute",
    right: 100,
    bottom: 6,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#FFEBF0",
    zIndex: 5,
    alignItems: "center",
    padding: 2,
  },
  horasText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    textAlign: "center",
    color: "#FF6905"
  },
  imgs: {
    zIndex: 5
  },
  imgFavNot: {
    width: 27,
    height: 25,
    position: 'absolute',
    margin: 0,
    right: 0,
    zIndex: 3
  },
  filtro: {
    flexDirection: "row",

  },
  imgsubtract: {
    width: 21,
    height: 21,
    position: 'absolute',
    margin: 12,
    right: 30,
    zIndex: 3
  },
  imgFilter: {
    width: 20,
    height: 20,
    position: 'absolute',
    margin: 12,
    right: 0,
    zIndex: 3
  },
  imgSearch: {
    width: 20,
    height: 20,
    position: 'absolute',
    margin: 12,
    zIndex: 3
  },
  title: {
    backgroundColor: '#FFF',
    width: "100%",
    height: 100,
    justifyContent: 'center',
    padding: 0
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    textAlign: 'center',
    color: "#1F1F39",
    marginTop: "5%"
  },
  form: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: 0,
    width: "100%",
    height: "100%"
  },
  formText: {
    color: "#858597",
    fontFamily: "Poppins-Regular",
    marginTop: 35


  },
  textButton: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 50,
    position: "relative",
    color: '#000',
    margin: 10
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#fff'
  },
  formInput: {
    borderRadius: 8,
    borderColor: "#B8B8D2",
    borderWidth: 1,
    backgroundColor: "#F0F0F2",
    height: 45,
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
    paddingLeft: 50
  },


  cardTextPrice: {
    fontFamily: "Poppins-Bold",
    color: "#3D5CFF",
    fontSize: 18,
    position: "absolute",
    padding: 8,
    marginLeft: 100,
    marginTop: 40,
    zIndex: 1
  },
  card: {
    backgroundColor: "#FFF",
    width: "100%",
    height: 110,
    marginTop: 10,
    borderRadius: 10,
    position:'relative',
    padding: 20
  },
  elevation: {
    elevation: 20,
    shadowColor: '#52006A',
  },
  cardTextTitle: {
    fontFamily: "Poppins-Bold",
    color: "#1F1F39",
    fontSize: 15,
    position: "absolute",
    padding: 5,
    marginLeft: 100,
    marginTop: -10,
    zIndex: 1
  },
  cardsText: {
    fontFamily: "Poppins-Bold",
    color: "#1F1F39",
    fontSize: 18,
    position: "relative",
    padding: 8,


  },
  cardText: {
    fontFamily: "Poppins-Bold",
    color: "#B8B8D2",
    fontSize: 10,
    position: "absolute",
    textAlign: "center",
    padding: 8,
    marginLeft: 100,
    marginTop: 15,

  },
  imgCard: {
    width: 80,
    height: 80,
    top: -5

  },



})