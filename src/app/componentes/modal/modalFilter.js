import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from "react-native";
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Slider from "@react-native-community/slider";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated'
import useStorage from "../../hooks/useStorage"
import useLocalhost from "../../hooks/useLocalhost";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

export function ModalFilter({ handleClose, onApplyFilters, initialFilters }) {

    const { getLocalhost } = useLocalhost();
    const { getItem } = useStorage();

    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState(initialFilters.categorias || []);
    const [fromValue, setFromValue] = useState(initialFilters.precoMin);
    const [toValue, setToValue] = useState(initialFilters.precoMax);
    const [value, setValue] = useState(initialFilters.distancia);
    const [duracaoSelecionada, setDuracaoSelecionada] = useState(initialFilters.duracao);

    useEffect(() => {
        setCategoriasSelecionadas(initialFilters.categorias || []);
        setFromValue(initialFilters.precoMin);
        setToValue(initialFilters.precoMax);
        setValue(initialFilters.distancia);
        setDuracaoSelecionada(initialFilters.duracao);
    }, [initialFilters]);

    const [categorias, setCategorias] = useState([])

    function toggleCategoria(categoria) {
        if (categoriasSelecionadas.includes(categoria)) {
            // Se a categoria já estiver selecionada, remova-a do array de seleções
            setCategoriasSelecionadas(categoriasSelecionadas.filter(cat => cat !== categoria));
        } else {
            // Caso contrário, adicione-a ao array de seleções
            setCategoriasSelecionadas([...categoriasSelecionadas, categoria]);
        }
    }
    function selecionarDuracao(duracao) {
        setDuracaoSelecionada(duracaoSelecionada === duracao ? '' : duracao);
    }
    // Função para verificar se uma categoria está selecionada
    function isCategoriaSelecionada(categoria) {
        return categoriasSelecionadas.includes(categoria);
    }

    function aplicarFiltro() {
        onApplyFilters({
            categorias: categoriasSelecionadas,
            precoMin: fromValue,
            precoMax: toValue,
            duracao: duracaoSelecionada,
            distancia: value,
        });
        handleClose();
    }

    function limparFiltro() {
        setCategoriasSelecionadas([]);
        setFromValue(0);
        setToValue(1000);
        setValue(0);
        setDuracaoSelecionada('');
        onApplyFilters({
            categorias: [],
            precoMin: 0,
            precoMax: 1000,
            duracao: '',
            distancia: 0,
        });
        handleClose();
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

    useFocusEffect(
        useCallback(() => {
            getCategorias();
        }, [])
    )

    const handleValuesChange = (values) => {
        setFromValue(values[0]);
        setToValue(values[1]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Pressable onPress={handleClose} style={styles.imgs} ><Image style={styles.imgCard} source={require("../../../assets/close.png")} /></Pressable>
                <Text style={styles.title}>Filtro de pesquisa</Text>
                <View style={styles.areaCategoria}><Text style={styles.textCategoria}>Categorias</Text></View>
                <View style={styles.categorias}>
                    {categorias?.map((categoria, i) => (
                        <Pressable key={i} onPress={() => toggleCategoria(categoria.id)}>
                            <Text style={[styles.textCategorias, isCategoriaSelecionada(categoria.id) && styles.textCategoriasSelecionada]}>
                                {categoria.nome}
                            </Text>
                        </Pressable>
                    ))}
                </View>
                <View style={styles.viewDuracao}>
                    <Text style={styles.titlePreco}>Duração</Text>
                    <View style={styles.alinhamento}>
                        <Pressable onPress={() => selecionarDuracao('3-8')}>
                            <Text style={[styles.duracao, duracaoSelecionada === '3-8' && styles.duracaoSelecionada]}>
                                3-8 horas
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => selecionarDuracao('8-14')}>
                            <Text style={[styles.duracao, duracaoSelecionada === '8-14' && styles.duracaoSelecionada]}>
                                8-14 horas
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => selecionarDuracao('14-20')}>
                            <Text style={[styles.duracao, duracaoSelecionada === '14-20' && styles.duracaoSelecionada]}>
                                14-20 horas
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => selecionarDuracao('20-24')}>
                            <Text style={[styles.duracao, duracaoSelecionada === '20-24' && styles.duracaoSelecionada]}>
                                20-24 horas
                            </Text>
                        </Pressable>
                    </View>
                </View>
                <View>
                    <Text style={styles.titlePreco}>Preço</Text>
                </View>
                <GestureHandlerRootView style={styles.interact}>
                    <View style={{ paddingLeft: 16 }}>
                        <MultiSlider values={[fromValue, toValue]}
                            min={0}
                            max={1000}
                            step={10}
                            sliderLength={360}
                            onValuesChange={handleValuesChange}
                            markerStyle={{
                                height: 22,
                                width: 22,
                                borderRadius: 11,
                                backgroundColor: '#FFFFFF',
                                borderWidth: 2,
                                borderColor: '#3D5CFF'
                            }}
                            trackStyle={{
                                height: 4, // Adjust the height of the track
                            }}
                            selectedStyle={{ backgroundColor: '#3D5CFF' }}
                            unselectedStyle={{ backgroundColor: '#B8B8D2' }}
                        />
                        <View style={styles.precos}><Text style={styles.textopreco}> R${fromValue} - </Text>
                            <Text style={styles.textopreco}>R${toValue}</Text></View>
                    </View>
                    <View style={{ paddingLeft: 16 }}>
                        <Text style={styles.titlePreco}>Distância</Text>
                        <MultiSlider
                            values={[value]}
                            min={0}
                            max={50}
                            step={1}
                            sliderLength={360}
                            onValuesChange={values => setValue(values[0])}
                            markerStyle={{
                                height: 22,
                                width: 22,
                                borderRadius: 11,
                                backgroundColor: '#FFFFFF',
                                borderWidth: 2,
                                borderColor: '#3D5CFF'
                            }}
                            trackStyle={{
                                height: 4, // Adjust the height of the track
                            }}
                            selectedStyle={{ 
                                backgroundColor: '#3D5CFF',
                              }}
                            unselectedStyle={{ 
                                backgroundColor: '#B8B8D2',
                            }}
                        />
                        <View>
                            <Text style={styles.textopreco}>{value} Km</Text></View>
                    </View>
                    <View style={styles.buttonAreaFilter}>
                        <TouchableOpacity style={[styles.buttonFilter, styles.buttonSaveClear]} onPress={limparFiltro}>
                            <Text style={styles.buttonSaveTextClear}>Limpar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttonFilter, styles.buttonSaveFilter]} onPress={aplicarFiltro}>
                            <Text style={styles.buttonSaveTextFilter}>Aplicar Filtro</Text>
                        </TouchableOpacity>
                    </View>
                </GestureHandlerRootView>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    buttonAreaFilter: {
        flexDirection: "row",
        width: "100%",
        marginTop: 25,
        justifyContent: "space-around"
    },
    buttonFilter: {
        alignItems: "center",
        marginTop: 14,
        marginBottom: 14,
        padding: 8,
        justifyContent: 'center',
    },
    buttonSaveFilter: {
        backgroundColor: "#3D5CFF",
        borderRadius: 8,
        width: 236,
        height: 50,
    },
    buttonSaveClear: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#3D5CFF",
        height: 50,
        width: 89,
    },
    buttonSaveTextFilter: {
        color: "#FFFFFF",
        fontFamily: "Poppins-Regular",
        fontSize: 16,
    },
    buttonSaveTextClear: {
        color: "#3D5CFF",
        fontFamily: "Poppins-Regular",
        fontSize: 16,
    },
    imgCard: {
        marginLeft: 5,
        width: 20,
        height: 20,
    },

    alinhamento: {
        flexDirection: "row",
        marginLeft: 20
    },
    duracao: {
        fontFamily: 'Poppins-Regular',
        color: '#1F1F39',
        marginBottom: 10,
        marginRight: 5,
        padding: 4,
        backgroundColor: "#F4F3FD",
        borderRadius: 10,
        borderColor: '#1F1F39',
    },
    duracaoSelecionada: {
        fontFamily: 'Poppins-Regular',
        color: '#1F1F39',
        marginBottom: 10,
        backgroundColor: "#3D5CFF",
        marginRight: 5,
        padding: 4,
        borderRadius: 10,
        borderColor: '#1F1F39',
    },
    viewduração: {
        marginLeft: 10,
        marginTop: 500,
        position: "absolute"
    },
    distaceview: {
        marginTop: 80
    },
    textopreco: {
        fontFamily: "Poppins-Regular",
        textAlign: 'center'
    },
    precos: {
        flexDirection: "row",
        justifyContent:'center'
    },
    interact: {
        height: "100%",
        width: "100%"
    },
    titlePreco: {
        fontFamily: "Poppins-Regular",
        color: "#1F1F39",
        margin: 5,
        fontSize: 16,
    },
    areaCategoria: {
        left: 0
    },
    textCategoria: {
        fontFamily: "Poppins-Regular",
        color: "#1F1F39",
        margin: 5,
        fontSize: 16
    },
    textCategorias: {
        fontSize: 16,
        marginRight: 5,
        backgroundColor: "#F4F3FD",
        borderRadius: 10,
        padding: 5,
        marginLeft: 20
    },
    textCategoriasSelecionada: {
        fontSize: 16,
        marginRight: 5,
        backgroundColor: "#3D5CFF",
        borderRadius: 10,
        padding: 5,
        marginLeft: 20
    },
    categorias: {
        flexDirection: "row",
        margin: 5
    },
    container: {
        backgroundColor: "rgba(24,24,24,0.6)",
        flex: 1,
    },
    content: {
        backgroundColor: "#FFF",
        width: "100%",
        height: "100%",
        marginTop: "15%",
        paddingTop: 20,
        paddingBottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 30
    },
    title: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        color: "#1F1F39",
        marginBottom: 24,
        textAlign: "center"
    },
    text: {
        color: "#858597",
        justifyContent: "center",
        fontFamily: "Poppins-Regular"
    },

    button: {
        flex: 1,
        alignItems: "center",
        marginTop: 14,
        marginBottom: 14,
        padding: 8,
        height: 50,
        justifyContent: 'center',
    },
    buttonSave: {
        backgroundColor: "#FF0909",
        borderRadius: 8
    },
    buttonSaveText: {
        color: "#FFFFFF",
        fontFamily: "Poppins-Bold",
        fontSize: 20
    },
    img: {
        width: 100,
        height: 100,
        marginTop: 40,
        marginBottom: 20
    }
})