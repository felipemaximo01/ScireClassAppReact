import { useCallback, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image, Modal, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';


export default function GerenciarAlunos() {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
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

    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <Text style={styles.title}>Nome do curso</Text>
            <View >
                <View>
                    <Pressable style={styles.imgs} ><Image style={styles.imgSearch} source={require("../../assets/SearchIcon.png")} /></Pressable>
                </View>
                <View >
                    <Pressable style={[styles.imgs, { display: visibleSubstract ? 'flex' : 'none' }]} onPress={clearTextInput}><Image style={styles.imgsubtract} source={require("../../assets/subtractIcon.png")} />
                    </Pressable>
                </View>
                <TextInput placeholder='O que você proucura ?' style={styles.formInput} onChangeText={handleInputChange} value={textInputValue} />
            </View>
            <ScrollView >
                <View style={styles.scroll}>
                    <View style={[styles.cards, styles.elavation]}>
                        <Image style={styles.people} source={require("../../assets/people.png")} />
                        <Text style={styles.textcard}>Nome do aluno</Text>
                        <Pressable style={styles.button}><Text style={styles.textButton}>Cancelar Matricula</Text></Pressable>
                    </View>
                   

                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    scroll:{
        justifyContent: 'center',
        alignItems: 'center',
        padding:10
    },


    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 180,
        height: 50,
        padding: 1,
        borderRadius: 10,
        backgroundColor: "#3D5CFF"
    },
    textButton: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: "#FFF",
        margin: 10
    },
    textcard: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        margin: 10
    },
    people: {
        width: 20,
        height: 23,
        margin: 5,
        marginTop:0,
    },
    cards: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        width: '100%',
        height: 100,
        backgroundColor: "#FFF",
        margin:10,


        borderRadius: 10,
    },
    elavation: {
        elevation: 20,
        shadowColor: '#52006A',

    },

    title: {
        fontFamily: "Poppins-Bold",
        fontSize: 24,
        margin: 10,
    },
    container: {


        width: "100%",
        height: "100%",
        padding: 10,
        backgroundColor: '#FFFFFF'
    },

    imgSearch: {
        width: 20,
        height: 20,
        position: 'absolute',
        margin: 12,
        zIndex: 3
    },
    imgsubtract: {
        width: 21,
        height: 21,
        position: 'absolute',
        margin: 12,
        right: 0,
        zIndex: 3
    },
    imgs: {
        zIndex: 5
    },
    formInput: {
        borderRadius: 8,
        borderColor: "#B8B8D2",
        borderWidth: 1,
        backgroundColor: "#F0F0F2",
        height: 45,
        marginBottom: 20,
        width: "100%",
        fontFamily: "Poppins-Regular",
        paddingLeft: 50
    },
})