import { useCallback, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image, Modal, TextInput,TouchableOpacity, Button} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useLocalSearchParams } from "expo-router";
import { ModalOK } from '../../componentes/modal/modalOK';
import { ModalBAD } from '../../componentes/modal/modalBAD';
import { ModalLoading } from '../../componentes/modal/modalLoading';
import useLocalhost from "../../hooks/useLocalhost";
import useStorage from "../../hooks/useStorage"
import {Link,useRouter,useFocusEffect} from 'expo-router'
import { RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';


export default function EditarCurso() {

    const { cursoId } = useLocalSearchParams();

    const router = useRouter();

    const { getItem } = useStorage();
    const { getLocalhost } = useLocalhost();

    const [enderecoCurso, setEnderecoCurso] = useState("")

    const [curso,setCurso] = useState("")
    const [categoriaId, setCategoriaId] = useState("");
    const [categorias, setCategorias] = useState([])
    const [cep, setCep] = useState("");

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [link, setLink] = useState("");
    const [telefone, setTelefone] = useState("");
    const [valor, setValor] = useState("");
    const [vagas, setVagas] = useState("");
    const [numero, setNumero] = useState("")
    const [logradouro, setLogradouro] = useState("")
    const [bairro, setBairro] = useState("")
    const [localidade, setLocalidade] = useState("")
    const [uf, setUf] = useState("");


    const [modalBADVisible, setModalBADVisible] = useState(false)
    const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
    const [modalOKVisible, setModalOKVisible] = useState(false)
    const [textResponse, setTextResponse] = useState("")

    const [modalidade, setModalidade] = useState("ONLINE");

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../../../assets/fonts/Poppins-Bold.ttf'),
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

    
  async function getCategorias() {
    const localhost = await getLocalhost();
    const token = await getItem("@token")
    fetch(`http://${localhost}:8080/scireclass/categoria`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    ).then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        setCategorias(data);
      } else {
        setTextResponse(data.message)
        setModalBADVisible(true)
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  async function getEnderecoCurso() {

    const localhost = await getLocalhost();
    const token = await getItem("@token");

    fetch(`http://${localhost}:8080/scireclass/endereco/curso/${cursoId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setEnderecoCurso(data)
                setCep(data.cep)
                setNumero(data.numero)
            } else {
                setTextResponse(data.message);
                setModalBADVisible(true);
            }
        }).catch((error) => {
            console.error('Error:', error);
        })

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

  const selectImage = async () => {
    const doc = await DocumentPicker.getDocumentAsync({
      type: 'image/*'
    });
    if (!doc.canceled) {
      let base64Image = await FileSystem.readAsStringAsync(doc.assets[0].uri, { encoding: 'base64' })
      console.log(base64Image)
      setImage(base64Image)
    }
  }



    useEffect(() => {
        async function cursoById() {
            const localhost = await getLocalhost();
            const token = await getItem("@token");
            setModalLoadingVisible(true)
            fetch(`http://${localhost}:8080/scireclass/curso/findid/${cursoId}`, {
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
                        setCurso(responseJson)
                        setVagas(responseJson.vagas+"")
                        setValor(responseJson.valor+"")
                        setCategoriaId(responseJson.categoria)
                        setNome(responseJson.nome)
                        setDescricao(responseJson.descricao)
                        setLink(responseJson.link)
                        setTelefone(responseJson.telefone)
                        if(responseJson.modalalidade == "ONLINE"){
                            setModalidade("ONLINE")
                        }else if (responseJson.modalalidade == "PRESENCIAL"){
                            setModalidade("PRESENCIAL")
                        }
                        console.log("TRISTEZa")
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        cursoById();
    }, [cursoId])

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


    const handleClose = () => {
        setModalOKVisible(false);
        router.replace("/userScire/homeProfessor");
    };

    useFocusEffect(
        useCallback(() => {
          getCategorias();
          getEnderecoCurso();
        },[])
      )

      const handleEditaCurso = async () => {

        if (!nome.trim() || !descricao.trim() || !link.trim() || !telefone.trim() || !vagas.trim() || !categoriaId.trim()) {
          setTextResponse("Todos os campos precisam ser preenchidos!")
          setModalBADVisible(true)
          return
        }
    
        setModalLoadingVisible(true)
    
        const cursoDTO = {
          nome: nome,
          descricao: descricao,
          modalidade: modalidade,
          link: link,
          aceitouTermos: true,
          telefone: telefone,
          ativo: true,
          valor: valor,
          vagas: vagas
        }
        const enderecoDTO = {
          cep: cep,
          numero: numero,
          logradouro: logradouro,
          bairro: bairro,
          localidade: localidade,
          uf: uf
        }
        const categoriaDTO = {
          id: categoriaId
        }
    
        const cadastroCursoDTO = {
          cursoDTO: cursoDTO,
          enderecoDTO: enderecoDTO,
          categoriaDTO: categoriaDTO,
        }
    
        const token = await getItem("@token")
        const localhost = await getLocalhost();
        const id = await getItem("@id");
        fetch(`http://${localhost}:8080/scireclass/curso/alter/${curso.id}`, {
          method: "PUT",
          body: JSON.stringify(cadastroCursoDTO),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then((response) => response.json())
          .then(async (responseJson) => {
            setModalLoadingVisible(false)
            if (responseJson.message !== undefined) {
              setTextResponse(responseJson.message)
              setModalBADVisible(true)
            } else {
                router.replace(`/userScire/gerenciarAlunos/${curso.id}`)
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            setModalLoadingVisible(false)
          });
      }

    return (
        <ScrollView>
          <View onLayout={onLayoutRootView} style={styles.container}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Cadastre o seu Curso</Text>
              <Text style={styles.titleSubText}>Insira os dados abaixo</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.formText}>Modalidade</Text>
              <RadioButtonGroup containerStyle={styles.radioGroup}
                selected={modalidade}
                onSelected={(value) => setModalidade(value)}
                radioBackground="#3D5CFF">
                <RadioButtonItem value="PRESENCIAL" label={<Text style={styles.formText}>Presencial</Text>} />
                <RadioButtonItem value="ONLINE" label={<Text style={styles.formText}>Online (Assíncronas)</Text>} />
              </RadioButtonGroup>
              <Text style={styles.formText}>Nome</Text>
              <TextInput value={nome} onChangeText={(value) => setNome(value)} style={styles.formInput} />
              <Text style={descricao}>Descrição</Text>
              <TextInput value={curso.descricao} onChangeText={(value) => setDescricao(value)} style={styles.formInput} />
              <Text style={styles.formText}>Link</Text>
              <TextInput value={link} keyboardType='url' onChangeText={(value) => setLink(value)} style={styles.formInput} />
              <Text style={styles.formText}>Telefone</Text>
              <TextInput value={telefone} keyboardType='phone-pad' onChangeText={(value) => setTelefone(value)} style={styles.formInput} />
              <Text style={styles.formText}>Valor</Text>
              <TextInput value={valor} keyboardType='numeric' onChangeText={(value) => setValor(value)} style={styles.formInput} />
              <Text style={styles.formText}>Vagas</Text>
              <TextInput value={vagas} keyboardType='number-pad' onChangeText={(value) => setVagas(value)} style={styles.formInput} />
              <Text style={styles.formText}>Categoria</Text>
              <Picker selectedValue={categoriaId} onValueChange={(itemValue, itemIndex) => { setCategoriaId(itemValue) }}>
                <Picker.Item label="Escolha uma categoria" value="" />
                {categorias?.map((categoria, i) => (
                  <Picker.Item label={categoria.nome} value={categoria.id} key={i} />
                ))}
              </Picker>
              <Text style={styles.formText}>CEP</Text>
              <TextInput keyboardType='phone-pad' value={cep} onBlur={checkCEP} onChangeText={(value) => setCep(value)} style={styles.formInput} />
              <Text style={styles.formText}>N° residencial</Text>
              <TextInput value={numero} keyboardType='phone-pad' onChangeText={(value) => setNumero(value)} style={styles.formInput} />
              <TouchableOpacity onPress={handleEditaCurso} style={styles.formButton}><Text style={styles.buttonText}>Editar um curso</Text></TouchableOpacity>
            </View>
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