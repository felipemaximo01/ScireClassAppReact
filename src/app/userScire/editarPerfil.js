import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Link, useFocusEffect, useRouter } from 'expo-router'
import Checkbox from 'expo-checkbox';
import useLocalhost from "../hooks/useLocalhost"
import useStorage from '../hooks/useStorage';
import { ModalOK } from '../componentes/modal/modalOK';
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';

SplashScreen.preventAutoHideAsync();

export default function EditarPerfil() {

    const router = useRouter();

    const { getLocalhost } = useLocalhost();
    const { getItem } = useStorage();

    const [perfil, setPerfil] = useState("ALUNO");

    const [nome, setNome] = useState("");

    const [enderecoId, setEnderecoId] = useState("")
    const [cep, setCep] = useState("")
    const [numero, setNumero] = useState("")
    const [logradouro, setLogradouro] = useState("")
    const [bairro, setBairro] = useState("")
    const [localidade, setLocalidade] = useState("")
    const [uf, setUf] = useState("")

    const [modalOKVisible, setModalOKVisible] = useState(false)
    const [modalBADVisible, setModalBADVisible] = useState(false)

    const [textResponse, setTextResponse] = useState("")

    const [modalLoadingVisible, setModalLoadingVisible] = useState(false)


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
        async function getUserPerfil() {
            const getPerfil = await getItem("@perfil")
            if (getPerfil !== null && getPerfil !== undefined && getPerfil !== "") {
                setPerfil(getPerfil)
            }
        };
        getUserPerfil();
    }, [])


    async function getUsuarioById() {
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        setModalLoadingVisible(true)
        fetch(`http://${localhost}:8080/scireclass/usuario/findbyid/${usuarioId}`, {
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
                    setNome(responseJson.nome)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    async function getEnderecoByUsuario() {
        const localhost = await getLocalhost();
        const token = await getItem("@token");
        const usuarioId = await getItem("@id");

        setModalLoadingVisible(true)
        fetch(`http://${localhost}:8080/scireclass/endereco/usuario/${usuarioId}`, {
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
                    setEnderecoId(responseJson.id)
                    setNumero(responseJson.numero)
                    setCep(responseJson.cep)
                    setLogradouro(responseJson.logradouro)
                    setBairro(responseJson.bairro)
                    setLocalidade(responseJson.localidade)
                    setUf(responseJson.uf)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleEditaUsuario = async () => {

        if (!nome.trim() || !cep.trim() || !numero.trim()) {
            setTextResponse("Todos os campos precisam ser preenchidos!")
            setModalBADVisible(true)
            return
        }

        const token = await getItem("@token");
        const usuarioId = await getItem("@id");
        const localhost = await getLocalhost();

        setModalLoadingVisible(true)

        const usuarioDTO = {
            id: usuarioId,
            nome: nome
        }
        const enderecoDTO = {
            id: enderecoId,
            cep: cep,
            numero: numero,
            logradouro: logradouro,
            bairro: bairro,
            localidade: localidade,
            uf: uf
        }

        const cadastroDTO = {
            usuarioDTO: usuarioDTO,
            enderecoDTO: enderecoDTO
        }

        fetch(`http://${localhost}:8080/scireclass/usuario/v1/edita`, {
            method: "put",
            body: JSON.stringify(cadastroDTO),
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
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
                    setTextResponse("Cadastro Realizado Com Sucesso, para ativar sua conta verifique a sua caixa de emails.")
                    setModalOKVisible(true)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const checkCEP = () => {
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (!data.erro) {
                        setLogradouro(data.logradouro);
                        setBairro(data.bairro);
                        setLocalidade(data.localidade);
                        setUf(data.uf);
                    } else {
                        alert("CEP inválido. Por favor, verifique o CEP inserido.");
                        setCep("")
                    }
                })
        } else {
            alert("CEP inválido. Por favor, verifique o CEP inserido.");
            setCep("")
        }
    }

    const handleClose = () => {
        setModalOKVisible(false);
        if (perfil == "ALUNO") {
            router.replace("/userScire/home");
        } else {
            router.replace("/userScire/homeProfessor");
        }
    };

    useFocusEffect(
        useCallback(() => {
          getUsuarioById();
          getEnderecoByUsuario();
        },[])
      )

    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>
            <View onLayout={onLayoutRootView} style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Editar Usuário</Text>
                    <Text style={styles.titleSubText}>Insira seus dados abaixo e edite seu usuário.</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.formText}>Nome</Text>
                    <TextInput value={nome} onChangeText={(value) => setNome(value)} style={styles.formInput} />
                    <Text style={styles.formText}>CEP</Text>
                    <TextInput value={cep} keyboardType='phone-pad' onBlur={checkCEP} onChangeText={(value) => setCep(value)} style={styles.formInput} />
                    <Text style={styles.formText}>N° residencial</Text>
                    <TextInput value={numero} keyboardType='phone-pad' onChangeText={(value) => setNumero(value)} style={styles.formInput} />
                    <TouchableOpacity onPress={handleEditaUsuario} style={styles.formButton}><Text style={styles.buttonText}>Editar</Text></TouchableOpacity>
                </View>
                <Modal visible={modalOKVisible} animationType='fade' transparent={true}>
                    <ModalOK textOK={textResponse} handleClose={handleClose} />
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
    title: {
        backgroundColor: '#F0F0F2',
        width: "100%",
        height: 120,
        justifyContent: 'flex-end',
        padding: 16
    },
    titleText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: "#1F1F39"
    },
    titleSubText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: "#B8B8D2"
    },
    form: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 16,
        marginTop: 3,
        width: "100%",
        height: "100%"
    },
    formText: {
        color: "#858597",
        fontFamily: "Poppins-Regular"
    },
    formInput: {
        borderRadius: 8,
        borderColor: "#B8B8D2",
        borderWidth: 1,
        height: 45,
        marginBottom: 20,
        fontFamily: "Poppins-Regular",
        paddingLeft: 8
    },
    loginText: {
        fontFamily: "Poppins-Regular",
        color: "#858597",
        alignItems: "center",
        justifyContent: "center"
    },
    linklogin: {
        color: "#3D5CFF"
    },
    checkBox: {
        marginRight: 6
    },
    formButton: {
        marginTop: 20,
        marginBottom: 20,
        width: "100%",
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3D5CFF',
        borderRadius: 8
    },
    buttonText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 20,
        color: '#fff'
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-around",

    }
})