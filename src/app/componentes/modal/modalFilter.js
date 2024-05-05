import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from "react-native";
import { useCallback, useEffect, useState } from 'react';

import RangeSlider, { Slider } from 'react-native-range-slider-expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated'

export function ModalFilter({ handleClose }) {
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([styles.textCategorias]);
    const [fromValue, setFromValue] = useState(0);
    const [toValue, setToValue] = useState(1000);
    const [value, setValue] = useState(0);
    const [duracaoSelecionada, setDuracaoSelecionada] = useState('');

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


    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <Pressable onPress={handleClose} style={styles.imgs} ><Image style={styles.imgCard} source={require("../../../assets/close.png")} /></Pressable>
                <Text style={styles.title}>Filtro de pesquisa</Text>
                <View style={styles.areaCategoria}><Text style={styles.textCategoria}>Categorias</Text></View>

                <View style={styles.categorias}>

                    <Pressable onPress={() => toggleCategoria('Desing')}>
                        <Text style={[styles.textCategorias, isCategoriaSelecionada('Desing') && styles.textCategoriasSelecionada]}>
                            Desing
                        </Text>
                    </Pressable>
                    <Pressable onPress={() => toggleCategoria('Pintura')}>
                        <Text style={[styles.textCategorias, isCategoriaSelecionada('Pintura') && styles.textCategoriasSelecionada]}>
                            Pintura
                        </Text>
                    </Pressable>
                    {/* Adicione mais Pressables para outras categorias conforme necessário */}
                </View>

                <View style={styles.viewDuracao}>
                    <Text style={styles.titlePreco}>Duração</Text>
                    <View style={styles.alinhamento}>
                        <Pressable onPress={() => selecionarDuracao('3-8 horas')}>
                            <Text style={[styles.duracao, duracaoSelecionada === '3-8 horas' && styles.duracaoSelecionada]}>
                                3-8 horas
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => selecionarDuracao('8-14 horas')}>
                            <Text style={[styles.duracao, duracaoSelecionada === '8-14 horas' && styles.duracaoSelecionada]}>
                                8-14 horas
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => selecionarDuracao('14-20 horas')}>
                            <Text style={[styles.duracao, duracaoSelecionada === '14-20 horas' && styles.duracaoSelecionada]}>
                                14-20 horas
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => selecionarDuracao('20-24 horas')}>
                            <Text style={[styles.duracao, duracaoSelecionada === '20-24 horas' && styles.duracaoSelecionada]}>
                                20-24 horas
                            </Text>
                        </Pressable>
                    </View>
                </View>
                
                <View>
                    <Text style={styles.titlePreco}>Preço</Text>



                </View>
                <GestureHandlerRootView style={styles.interact}>
                    <View>

                        <RangeSlider min={0} max={10000} step={10}
                            fromValueOnChange={value => setFromValue(value)}
                            toValueOnChange={value => setToValue(value)}
                            initialFromValue={0}

                            inRangeBarColor='#3D5CFF'
                            outOfRangeBarColor='gray'
                            fromKnobColor='#3D5CFF'
                            toKnobColor="#3D5CFF"
                        />
                        <View style={styles.precos}><Text style={styles.textopreco}> R${fromValue} - </Text>
                            <Text style={styles.textopreco}>R${toValue}</Text></View>

                    </View>

                    <View style={styles.distaceview}>
                        <Text style={styles.titlePreco}>Distância</Text>
                        <Slider min={0} max={50} step={1}
                            valueOnChange={value => setValue(value)}
                            initialValue={0}
                            knobColor='#3D5CFF'

                            inRangeBarColor='gray'
                            outOfRangeBarColor='#3D5CFF'
                        />
                        <View style={styles.precos}>
                            <Text style={styles.textopreco}>{value} Km</Text></View>
                    </View>

                    <View style={styles.buttonAreaFilter}>
                    <TouchableOpacity style={[styles.buttonFilter, styles.buttonSaveClear]} onPress={handleClose}>
                        <Text style={styles.buttonSaveTextClear}>Limpar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonFilter, styles.buttonSaveFilter]} onPress={handleClose}>
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
        flexDirection:"row",
        width:"100%",
        marginTop:60,
        

        justifyContent:"space-between"
        
    },
    buttonFilter: {
        flex:1,
        alignItems:"center",
        marginTop:14,
        marginBottom:14,
        padding:8,
        height:50,
        margin:10,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonSaveFilter: {
        backgroundColor: "#3D5CFF",
        borderRadius: 8,
    
    },
    buttonSaveClear: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        borderWidth:1,
    
    },
    buttonSaveTextFilter: {
        color: "#FFFFFF",
        fontFamily: "Poppins-Bold",
        fontSize: 20,
        
    },
    buttonSaveTextClear: {
        color: "#000",
        fontFamily: "Poppins-Bold",
        fontSize: 20,
        
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
        backgroundColor: "gray",
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
    },
    precos: {
        flexDirection: "row",
        paddingLeft: "40%"
    },
    interact: {
        height: "100%",
        width: "100%"
    },
    titlePreco: {
        fontFamily: "Poppins-Bold",
        color: "#1F1F39",
        margin: 5
    },
    areaCategoria: {
        left: 0
    },
    textCategoria: {
        fontFamily: "Poppins-Bold",
        color: "#1F1F39",
        margin: 5
    },
    textCategorias: {
        fontSize: 16,
        marginRight: 5,
        backgroundColor: "gray",
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
        alignItems: 'center',
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