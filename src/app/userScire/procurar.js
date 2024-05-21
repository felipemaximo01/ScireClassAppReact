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
import { useRouter, useFocusEffect } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function Procurar() {
  const router = useRouter();

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

  const [filters, setFilters] = useState({
    categorias: [],
    precoMin: 0,
    precoMax: 1000,
    duracao: '',
    distancia: 0,
  });

  const [cursos, setCursos] = useState([])

  const [cursosFav, setCursosFav] = useState([]);

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

  async function loadLocalhost() {
    const host = await getLocalhost();
    setImageUrl(host);
  }

  async function getCursos() {
    setModalLoadingVisible(true)
    const localhost = await getLocalhost();
    const token = await getItem("@token");

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
    }).catch((error) => {
      console.error('Error:', error);
      setModalLoadingVisible(false)
    });
  }

  async function getFavoritos() {
    setModalLoadingVisible(true)
    const localhost = await getLocalhost();
    const token = await getItem("@token");
    const usuarioId = await getItem("@id");

    fetch(`http://${localhost}:8080/scireclass/curso/favoritos/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        const data = await response.json();
        setModalLoadingVisible(false)
        if (response.ok) {
          setCursosFav(data)
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



  function filterShow() {
    setModalFilterVisible(true)
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

  async function filterCurso() {
    const localhost = await getLocalhost();
    const token = await getItem("@token");

    const cursoFilterDTO = {
      nomeCurso: textInputValue,
      categoriasID: filters.categorias,
      precoMin: filters.precoMin,
      precoMax: filters.precoMax,
      duracao: filters.duracao,
      distancia: filters.distancia,
    }

    fetch(`http://${localhost}:8080/scireclass/curso/filter`, {
      method: "post",
      body: JSON.stringify(cursoFilterDTO),
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        const data = await response.json()
        if (response.ok) {
          setCursos(data);
        } else if (data.message !== undefined) {
          setTextResponse(data.message)
          setModalBADVisible(true)
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const updateVisibleSubstract = (text) => {
    if (text && text.trim().length > 0) {
      setVisibleSubstract(true);
    } else {
      setVisibleSubstract(false);
    }
  };

  useEffect(() => {
    filterCurso(); // Chame a função de filtro quando o texto for alterado
  }, [textInputValue, filters]);

  useFocusEffect(
    useCallback(() => {
      getCursos();
      getFavoritos();
    }, [])
  )

  useEffect(() => {
    loadLocalhost()
  }, [])

  const buscar = async (cursoId) => {
    router.push({ pathname: `userScire/curso/${cursoId}`, params: cursoId })
  }

  async function handlerFavCurso(cursoId) {
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
        getFavoritos()
      } else if (data.message !== undefined) {
        setTextResponse(data.message)
        setModalBADVisible(true)
      }
    }).catch((error) => {
      console.error('Error:', error);
      setModalLoadingVisible(false)
    });
  }

  function renderFavoriteIcon(cursoId) {
    const isFavorite = cursosFav.some(cursoFav => cursoFav.id === cursoId);
    return (
      <Image
        style={styles.imgFavNot}
        source={isFavorite ? require("../../assets/favoritoIcon.png") : require("../../assets/iconButtonFav.png")}
      />
    );
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
                <Pressable onPress={filterShow} style={styles.imgs} >
                  <Image style={styles.imgFilter} source={require("../../assets/filterIcon.png")} />
                </Pressable>
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
              <View>
                <Pressable onPress={() => handlerFavCurso(curso.id)}>
                {renderFavoriteIcon(curso.id)}
                </Pressable>
                <Image style={styles.imgCard} source={{ uri: `http://${imageUrl}:8080/scireclass/imagem/downloadImage?path=${curso.pathThumbnail}` }} />
                <Text style={styles.cardTextTitle}>{curso.nome}</Text>
                <Text style={styles.cardText}>{curso.nomeCriador}</Text>
                <Text style={styles.cardTextPrice}>R${curso.valor}</Text>
                <View style={styles.horas}>
                  <Text style={styles.horasText} >{curso.minutosTotalCurso} min</Text>
                </View>
              </View></Pressable>))}
        </View>
        <Modal visible={modalFilterVisible} animationType='slide' transparent={true}>
          <ModalFilter handleClose={() => setModalFilterVisible(false)} onApplyFilters={setFilters} initialFilters={filters} />
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
    position: 'relative',
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