import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import useStorage from "../hooks/useStorage"
import useLocalhost from "../hooks/useLocalhost"
import { ModalOK } from '../componentes/modal/modalOK';
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';
import { useFocusEffect,useRouter } from 'expo-router';



SplashScreen.preventAutoHideAsync();

export default function Favoritos() {
  const router = useRouter();

  const [cursoFav, setCursoFav] = useState([]);

  const { getItem } = useStorage();
  const { getLocalhost } = useLocalhost();

  const [modalBADVisible, setModalBADVisible] = useState(false)
  const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
  const [modalOKVisible, setModalOKVisible] = useState(false)
  const [imageUrl, setImageUrl] = useState("");

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

  useEffect(() => {
    async function loadLocalhost() {
      const host = await getLocalhost();
      setImageUrl(host);
    }
    loadLocalhost()
  }, [])

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
          setCursoFav(data)
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

  const buscar = async (cursoId) => {
    router.push({pathname: `userScire/curso/${cursoId}`, params: cursoId})
  }

  useFocusEffect(
    useCallback(() => {
      getFavoritos();
    }, [])
  )

  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Favoritos</Text>
      </View>
      {cursoFav?.map((curso, i) => (
        <Pressable key={i} onPress={() => buscar(curso.id)} style={[styles.card, styles.elevation]} >
            <View style={styles.viewImagem}>
              <Image style={styles.img} source={{ uri: `http://${imageUrl}:8080/scireclass/imagem/downloadImage?path=${curso.pathThumbnail}` }} />
            </View>
            <View>
              <Text style={styles.titleCurso}>{curso.nome}</Text>
              <View style={styles.contentTeacher}>
                <Image style={styles.user} source={require("../../assets/Union.png")} />
                <Text style={styles.nameTeacher}>{curso.nomeCriador}</Text>
              </View>
              <View style={styles.contentHours}>
                <Text style={styles.textHours}>{curso.minutosTotalCurso} min</Text>
              </View>
            </View>
            <Pressable onPress={() => handlerFavCurso(curso.id)}>
              <Image style={styles.fav} source={require("../../assets/favoritoIcon.png")} />
            </Pressable>
            <View>
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
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  nameTeacher: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#B8B8D2",
  },
  user: {
    height: 10,
    width: 8.5,
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