import {Tabs} from 'expo-router'
import { Image,StyleSheet } from 'react-native';

export default function Layout(){
    return(
        <Tabs>
            <Tabs.Screen name='home' options={{title: "Home",
                headerShown:false,
                tabBarIcon:() => {
                    return <Image source={require("../../assets/homeIcon.png")}
                        style={styles.img}/>
                }}}/>
            <Tabs.Screen name='cursos' options={{title: "Cursos",
                headerShown:false}}/>
            <Tabs.Screen name='procurar' options={{title: "Procurar",
                headerShown:false}}/>
            <Tabs.Screen name='mensagem' options={{title: "Mensagens",
                headerShown:false}}/>
            <Tabs.Screen name='favoritos' options={{title: "Favoritos",
                headerShown:false}}/>
        </Tabs>
    )
}

const styles = StyleSheet.create({
    img:{
        width:18.5,
        height:18.5
    }
})