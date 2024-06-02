import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, Image, Modal, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter, Link, useFocusEffect } from 'expo-router'
import useStorage from "../hooks/useStorage"
import useLocalhost from "../hooks/useLocalhost"
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';
import * as Progress from 'react-native-progress';

SplashScreen.preventAutoHideAsync();

export default function Mensagem() {

    const [selected, setSelected] = useState('Mensagem');
    const [chats, setChats] = useState([]);

    const router = useRouter();

    const { getLocalhost } = useLocalhost();

    const { getItem } = useStorage();


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


    const getChats = async () => {
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        fetch(`http://${localhost}:8080/scireclass/chat/getChats/${usuarioId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => setChats(data))
            .catch(error => console.error('Error fetching chats:', error));
    }

    const createChat = async () => {
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        try {

            const requestBody = {
                alunoID: usuarioId,
                professorID: '661c4c1a22127a2abaafb3b9'
            };
            const response = await fetch(`http://${localhost}:8080/scireclass/chat/createChat/${usuarioId}/661c4c1a22127a2abaafb3b9`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody)
            }
            );

            console.log('Response status:', response.status);

            if (response.status === 200) {
                console.log("Sucesso", "Chat criado com sucesso");
            }
        } catch (error) {
            console.log("Erro", "Não foi possível criar o chat");
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getChats();
            const intervalId = setInterval(getChats, 1000); // Fetch chats every second

            return () => clearInterval(intervalId);
        }, [])
    );

    const Hours = ({ instant }) => {
        // Converte a string instantânea para um objeto Date
        const date = new Date(instant);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo',
          };
      
        // Formata a data para exibir apenas as horas
        const formattedTime = new Intl.DateTimeFormat('pt-BR', options).format(date); // 'HH:MM'
      
        return (
            <Text style={styles.hourText}>{formattedTime}</Text>
        );
      };

      const goChat = async (chatId) => {
        router.push({pathname: `userScire/chat/${chatId}`, params: chatId})
      }
      

    return (
        <ScrollView style={{ backgroundColor: '#fff' }} onLayout={onLayoutRootView}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Notificações</Text>
                </View>
                <View style={styles.subTitle}>
                    <Pressable><Text style={[styles.subTitleText, selected === 'Mensagem' && styles.selectedText]}>Mensagem</Text></Pressable>
                    <Pressable><Text style={[styles.subTitleText, selected === 'Notificação' && styles.selectedText]}> Notificação</Text></Pressable>
                </View>
                <View style={styles.body}>
                    {chats?.map((chat, i) => (
                        <Pressable onPress={() => goChat(chat.id)} key={i} style={[styles.cardMsg, styles.elevation]}>
                            <View style={{ flexDirection: "row", width: '100%' }}>
                                <View style={styles.cardImg}>
                                    <Image style={styles.img} source={require("../../assets/userIcon.png")} />
                                </View>
                                <View style={styles.headerMsg}>
                                    <Text style={styles.nameMsg}>{chat.usuario}</Text>
                                    <Text style={styles.status}>Online</Text>
                                </View>
                                <View style={styles.hour}>
                                    <Hours instant={chat.dtUltimaMensagem} />
                                </View>
                            </View>
                            <View style={styles.bodyMsg}>
                                <Text style={styles.msgText}>{chat.ultimaMensagem}</Text>
                            </View>

                        </Pressable>
                    ))}
                </View>
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
        padding: 16,
    },
    title: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 8,
        backgroundColor: '#fff',
    },
    titleText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24
    },
    subTitle: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        margin: 8,
        backgroundColor: '#fff',
    },
    subTitleText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    selectedText: {
        borderBottomWidth: 2,
        borderBottomColor: '#3D5CFF',
    },
    body: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
    },
    elevation: {
        elevation: 20,
        shadowColor: '#52006A',
    },
    cardMsg: {
        backgroundColor: "#FFFFFF",
        width: "98%",
        height: 136,
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    cardImg: {
        margin: 8,
        width: 50,
        height: 50
    },
    img: {
        height: 49,
        width: 36,
    },
    headerMsg: {
        margin: 8,
    },
    nameMsg: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold'
    },
    status: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#858597'
    },
    hour: {
        margin: 8,
        alignItems: 'flex-end',
        width: '45%'
    },
    hourText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#858597'
    },
    bodyMsg: {
        margin: 8,
    },
    msgText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#858597'
    }

});