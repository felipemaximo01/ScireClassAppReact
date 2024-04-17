import {Tabs} from 'expo-router'
import { Image,StyleSheet } from 'react-native';

export default function Layout(){
    return(
        <Tabs>
            <Tabs.Screen name='home' options={{title: "Home",
                headerShown:false,
                tabBarIcon:() => {
                    return <Image source={require("../../assets/homeIcon.png")}
                        style={styles.imgHome}/>
                }}}/>
            <Tabs.Screen name='meusCursos' options={{title: "Cursos",
                headerShown:false,
                tabBarIcon:() => {
                    return <Image source={require("../../assets/meusCursosIcon.png")}
                        style={styles.imgCursos}/>
                }}}/>
            <Tabs.Screen name='procurar' options={{title: "Procurar",
                headerShown:false,
                tabBarIcon:() => {
                    return <Image source={require("../../assets/pesquisarIcon.png")}
                        style={styles.imgPesquisar}/>
                }}}/>
            <Tabs.Screen name='mensagem' options={{title: "Mensagens",
                headerShown:false,
                tabBarIcon:() => {
                    return <Image source={require("../../assets/mensagemIcon.png")}
                        style={styles.imgMensagem}/>
                }}}/>
            <Tabs.Screen name='favoritos' options={{title: "Favoritos",
                headerShown:false,
                tabBarIcon:() => {
                    return <Image source={require("../../assets/favoritoIcon.png")}
                        style={styles.imgFavoritos}/>
                }}}/>
        </Tabs>
    )
}

const styles = StyleSheet.create({
    imgHome:{
        width:18.5,
        height:18.5
    },
    imgCursos:{
        width:16,
        height:20
    },
    imgPesquisar:{
        width:17.38,
        height:17.38,
    },
    imgMensagem:{
        width:20,
        height:18
    },
    imgFavoritos:{
        width:20,
        height:18
    },
})