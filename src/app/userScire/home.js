import { useCallback, useState, useEffect,useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Image, Modal,ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter, Link, useFocusEffect } from 'expo-router'
import useStorage from "../hooks/useStorage"
import useLocalhost from "../hooks/useLocalhost"
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';
import * as Progress from 'react-native-progress';
import PagerView from 'react-native-pager-view';
import {StarRatingDisplay} from 'react-native-star-rating-widget';

SplashScreen.preventAutoHideAsync();

export default function Home() {

  const router = useRouter();

  const { getItem } = useStorage();
  const [token, setToken] = useState(null)
  const [id, setId] = useState(null)

  const { getLocalhost } = useLocalhost();
  const [localhost, setLocahost] = useState("");

  const [usuarioDTO, setUsuarioDTO] = useState("");

  const [lastCursos, setLastCursos] = useState([]);

  const [cursosRecomendados, setCursosRecomendados] = useState([]);

  const [modalBADVisible, setModalBADVisible] = useState(false)

  const [modalLoadingVisible, setModalLoadingVisible] = useState(false)

  const [textResponse, setTextResponse] = useState("")

  const [minutosAssitidos, setMinutosAssitidos] = useState(0)

  const pagerRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = 10; // Ajuste para o número total de slides

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

  async function lastCursosUser() {
    if (token !== null && id !== null) {
      setModalLoadingVisible(true)
      fetch(`http://${localhost}:8080/scireclass/matricula/curso/${id}`, {
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
            setLastCursos(responseJson)
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

  };

  useEffect(() => {
    async function jaLogado() {
      const getToken = await getItem("@token")
      const getId = await getItem("@id")
      if ((getToken !== null && getToken !== undefined && getToken !== "")
        && (getId !== null && getId !== undefined && getId !== "")) {
        setToken(getToken)
        setId(getId)
      } else {
        router.replace("/index")
      }
    };
    jaLogado();
  }, [])

  useEffect(() => {
    async function loadLocalhost() {
      const host = await getLocalhost();
      setLocahost(host);
    }
    loadLocalhost()
  }, [])


  async function userById() {
    if (token !== null && id !== null) {
      setModalLoadingVisible(true)
      fetch(`http://${localhost}:8080/scireclass/usuario/findbyid/${id}`, {
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
            setUsuarioDTO(responseJson)
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

  };

  async function getMinutosAssitidos() {
    if (token !== null && id !== null) {
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
            setMinutosAssitidos(responseJson.minutos)
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

  };

  useEffect(() => {
  async function getCursosRecomendados() {
    if (token !== null && id !== null) {
      setModalLoadingVisible(true)
      fetch(`http://${localhost}:8080/scireclass/recomendacao/${id}`, {
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
            setCursosRecomendados(responseJson)
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

  };
  getCursosRecomendados();
},[token,id])

  useFocusEffect(
    useCallback(() => {
      lastCursosUser();
      getMinutosAssitidos();
      userById();
    }, [token, id])
  )

  function carregarQuantidadeAulas(quantidadeAulas) {
    if (quantidadeAulas != null && quantidadeAulas != undefined) {
      if (quantidadeAulas <= 0) {
        return 1
      }
      return quantidadeAulas
    }
    return 1;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPageIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }, 3000); // 3000ms = 3 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  useEffect(() => {
    if (pagerRef.current) {
      pagerRef.current.setPage(pageIndex);
    }
  }, [pageIndex]);

  function carregarNome(nome) {
    if (nome != null && nome != undefined) {
        if (nome.length > 28) {
            return nome.substr(0, 28) + "...";
        }
        return nome
    }
    return "";
}

  return (
    <ScrollView>
      <View onLayout={onLayoutRootView} style={styles.container}>
        <View style={styles.title}>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>Oi, {usuarioDTO.nome}</Text>
            <Text style={styles.subTitleText}>Vamos começar a aprender!</Text>
          </View><Link asChild href={"userScire/conta"}>
            <Pressable><Image source={require("../../assets/userIcon.png")} style={styles.userIcon} /></Pressable></Link>
        </View>
        <View style={[styles.titleContent, styles.elevation]}>
          <View style={styles.textTitleContent}>
            <Text style={styles.textBase}>Aprendi hoje</Text>
            <Link style={styles.linkMeusCursos} href="/userScire/meusCursos">Meus cursos</Link>
          </View>
          <View style={styles.progressClass}>
            <Text style={styles.minDone}>{minutosAssitidos}MIN</Text>
            <Text style={styles.minGoal}>/60min</Text>
          </View>
          <Progress.Bar progress={minutosAssitidos / 60} width={null} height={6} />
        </View>
        <View style={styles.card2}>
          <Text style={styles.cardText}>Descubra por novos cursos!</Text>
            <View style={styles.viewImg}>
              <Link href={"/userScire/procurar"} asChild>
                <TouchableOpacity style={styles.buttonCard}><Text style={styles.textButtonCard}>Iniciar</Text></TouchableOpacity>
              </Link>
              <Image style={styles.imgCard2} source={require("../../assets/cardIcon.png")} />
            </View>
        </View>
        <View style={[{flex: 1, width: "100%",height: 450,marginTop: 16, borderRadius: 12, alignItems:'center', justifyContent: "center"}] }>
          <Text style={styles.titleCarrolsel}>Recomendados para você</Text>
          <PagerView ref={pagerRef} style={[{ flex: 1,width: "100%",height:"100%",alignItems:'center', justifyContent: "center"}]}>
            {cursosRecomendados?.map((curso, i) => (
            <View style={[styles.card,styles.elevation]} key={i}>
              <Image style={styles.imgCard} source={require("../../assets/imagemExCurso.png")} />
              <View style={{padding: 6}}>
                <Text style={styles.titleCurso}>{carregarNome(curso.nome)}</Text>
                <View style={styles.contentTeacher}>
                  <Image style={styles.user} source={require("../../assets/Union.png")} />
                  <Text style={styles.nameTeacher}>{curso.nomeCriador}</Text>
                </View>
                <StarRatingDisplay  style={{marginBottom: 6}} starSize={12} rating={curso.avaliacao}/>
                <Text style={styles.cardTextPrice}>R${curso.valor}</Text>
              </View>
            </View>
            ))}
          </PagerView>
        </View>
        <View style={[styles.lastClass, styles.elevation]}>
          <Text style={styles.titleLastClass}>Progresso</Text>
          {lastCursos?.map((curso, i) => (
            <View key={i} style={styles.lastCourses}>
              <View style={{ flexDirection: "row" }}>
                <Progress.Circle size={25} progress={curso.quantidadeAulasAssistidas / carregarQuantidadeAulas(curso.quantidadeAulas)} thickness={4} borderWidth={0} color='#707070' fill='none' />
                <Text style={styles.nameLastCourse}>{curso.nome}</Text>
              </View>
              <View style={{ flexDirection: "row", }}>
                <Text style={styles.numberDoneLastCourse}>{curso.quantidadeAulasAssistidas}</Text>
                <Text style={styles.numberClassesLastCourse}>/{curso.quantidadeAulas}</Text>
              </View>
            </View>
          ))}
        </View>
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
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card2: {
    backgroundColor: "#CEECFE",
    width: "80%",
    height: 154,
    marginTop: 16,
    borderRadius: 12,
  },
  imgCard2: {
    width: 119,
    height: 135,
    marginTop: 15
  },
  title: {
    backgroundColor: '#3D5CFF',
    width: "100%",
    height: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'relative'
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: "#FFFFFF",
  },
  subTitleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: "#FFFFFF",
  },
  userIcon: {
    height: 49,
    width: 36,
    marginBottom: 50
  },
  titleContent: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    height: 100,
    position: 'relative',
    borderRadius: 8,
    marginTop: -35,
    justifyContent: "center",
    paddingLeft: 12,
    paddingRight: 12
  },
  textTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
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
  linkMeusCursos: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#3D5CFF"
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
  elevation: {
    elevation: 20,
    shadowColor: '#52006A',
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "70%",
    height: "90%",
    borderRadius: 12,
    marginLeft:"15%"
  },
  cardText: {
    fontFamily: "Poppins-Bold",
    color: "#1F1F39",
    fontSize: 18,
    position: "absolute",
    padding: 8,
    zIndex: 1
  },
  imgCard: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  buttonCard: {
    marginTop: 20,
    marginBottom: 20,
    width: 100,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6905',
    borderRadius: 8,
    marginLeft: 32
  },
  textButtonCard: {
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    fontSize: 12
  },
  viewImg: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  lastClass: {
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    width: "90%",
    height: 133,
    backgroundColor: "#FFFFFF",
    padding: 8
  },
  titleLastClass: {
    fontFamily: "Poppins-Bold",
    color: "#1F1F39",
    fontSize: 18,
  },
  lastCourses: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8
  },
  nameLastCourse: {
    fontFamily: "Poppins-Regular",
    color: "#1F1F39",
    fontSize: 14,
    marginLeft: 6,
    marginTop: 2
  },
  numberDoneLastCourse: {
    fontFamily: "Poppins-Regular",
    color: "#1F1F39",
    fontSize: 14
  },
  numberClassesLastCourse: {
    fontFamily: "Poppins-Regular",
    color: "#B8B8D2",
    fontSize: 14
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',

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
  titleCurso: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  nameTeacher: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#B8B8D2",
  },
  cardTextPrice: {
    fontFamily: "Poppins-Bold",
    color: "#3D5CFF",
    fontSize: 18,

  },
  titleCarrolsel:{
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 8
  }
});
