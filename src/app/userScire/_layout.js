import { useState, useEffect } from 'react';
import { Tabs } from 'expo-router'
import { Image, StyleSheet } from 'react-native';
import useStorage from "../hooks/useStorage"

export default function Layout() {

    const { getItem } = useStorage();

    const [perfil, setPerfil] = useState("")
    const [aluno, setAluno] = useState(null)
    const [professor, setProfessor] = useState(null)

    useEffect(() => {
        async function getUserPerfil() {
            const getPerfil = await getItem("@perfil")
            if (getPerfil !== null && getPerfil !== undefined && getPerfil !== "") {
                setPerfil(getPerfil)
            }
        };
        getUserPerfil();
    }, [])

    useEffect(() => {
        function setProfile() {
            if (perfil == "ALUNO") {
                setAluno("/userScire/favoritos")
            } else if (perfil == "PROFESSOR") {
                setProfessor("/userScire/cadastrarCurso")
            }
        }
        setProfile()
    }, [perfil])

    return (
        <Tabs screenOptions={({ route }) => ({
            headerShown: false, tabBarHideOnKeyboard: true, tabBarStyle: {
                display: route.name === 'curso/[cursoId]' ? 'none' : 'flex'
            }
        })}>
            <Tabs.Screen name='home' options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: () => {
                    return <Image source={require("../../assets/homeIcon.png")}
                        style={styles.imgHome} />
                }
            }} />
            <Tabs.Screen name='meusCursos' options={{
                title: "Cursos",
                headerShown: false,
                tabBarIcon: () => {
                    return <Image source={require("../../assets/meusCursosIcon.png")}
                        style={styles.imgCursos} />
                }
            }} />
            <Tabs.Screen name='procurar' options={{
                title: "Procurar",
                headerShown: false,
                tabBarIcon: () => {
                    return <Image source={require("../../assets/pesquisarIcon.png")}
                        style={styles.imgPesquisar} />
                }
            }} />
            <Tabs.Screen name='mensagem' options={{
                title: "Mensagens",
                headerShown: false,
                tabBarIcon: () => {
                    return <Image source={require("../../assets/mensagemIcon.png")}
                        style={styles.imgMensagem} />
                }
            }} />
            <Tabs.Screen name='favoritos' options={{
                title: "Favoritos",
                headerShown: false,
                href: aluno,
                tabBarIcon: () => {
                    return <Image source={require("../../assets/favoritoIcon.png")}
                        style={styles.imgFavoritos} />
                }
            }} />
            <Tabs.Screen name='cadastrarCurso' options={{
                title: "Cadastrar Curso",
                headerShown: false,
                href: professor,
                tabBarIcon: () => {
                    return <Image source={require("../../assets/favoritoIcon.png")}
                        style={styles.imgFavoritos} />
                }
            }} />
            <Tabs.Screen name='curso/[cursoId]' options={{
                title: "Curso",
                headerShown: false,
                href:null
            }} />
             <Tabs.Screen name='conta' options={{
                title: "Conta",
                headerShown: false,
                href:null
            }} />
        </Tabs>
    )
}

const styles = StyleSheet.create({
    imgHome: {
        width: 18.5,
        height: 18.5
    },
    imgCursos: {
        width: 16,
        height: 20
    },
    imgPesquisar: {
        width: 17.38,
        height: 17.38,
    },
    imgMensagem: {
        width: 20,
        height: 18
    },
    imgFavoritos: {
        width: 20,
        height: 18
    },
})