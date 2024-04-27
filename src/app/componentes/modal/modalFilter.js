import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image} from "react-native";
import { useCallback, useEffect, useState } from 'react';
import { InputRange } from "../InputRange";


export function ModalFilter({ handleClose }) {
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([styles.textCategorias]);

    function toggleCategoria(categoria) {
        if (categoriasSelecionadas.includes(categoria)) {
            // Se a categoria já estiver selecionada, remova-a do array de seleções
            setCategoriasSelecionadas(categoriasSelecionadas.filter(cat => cat !== categoria));
        } else {
            // Caso contrário, adicione-a ao array de seleções
            setCategoriasSelecionadas([...categoriasSelecionadas, categoria]);
        }
    }

    // Função para verificar se uma categoria está selecionada
    function isCategoriaSelecionada(categoria) {
        return categoriasSelecionadas.includes(categoria);
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
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
                <View>
                    <Text style={styles.titlePreco}>Preço</Text>
                    <InputRange minValue ={0} maxValue={100} onChangeMin={(v)=>console.log} onChangeMax ={(v)=>console.log}/>
                </View>

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
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
        marginRight: 5,
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 5,
        marginLeft: 20


    },
    textCategoriasSelecionada: {
        marginRight: 5,
        backgroundColor: "#F00",
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