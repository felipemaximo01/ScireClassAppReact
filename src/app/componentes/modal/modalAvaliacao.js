import { useCallback, useState, useEffect } from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Pressable, Modal} from "react-native";
import StarRating from 'react-native-star-rating-widget';
import useStorage from "../../hooks/useStorage"
import useLocalhost from "../../hooks/useLocalhost"
import { ModalOK } from '../../componentes/modal/modalOK';
import { ModalBAD } from '../../componentes/modal/modalBAD';
import { ModalLoading } from '../../componentes/modal/modalLoading';


export function ModalAvaliacao({handleClose, cursoId}) {

    const [modalBADVisible, setModalBADVisible] = useState(false)
    const [modalLoadingVisible, setModalLoadingVisible] = useState(false)
    const [modalOKVisible, setModalOKVisible] = useState(false)

    const [textResponse, setTextResponse] = useState("")

    const { getItem } = useStorage();
    const { getLocalhost } = useLocalhost();

    const [rating, setRating] = useState(0);

    async function handleButtonAvaliar(){
        const localhost = await getLocalhost();
        const token = await getItem("@token");

        const cursoDTO = {
            id: cursoId,
            avaliacao: rating
        }

        fetch(`http://${localhost}:8080/scireclass/curso/avaliar`, {
            method:'post',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(cursoDTO)
        }).then(async (response) => {
            const data = await response.json();
            if(response.ok){
                setTextResponse("Avaliação enviada com sucesso!")
                setModalOKVisible(true);
                handleClose();
            }else{
                setTextResponse(data.message)
                setModalBADVisible(true);
                handleClose();
            }
        }).catch((error) => {
            console.error('Error:', error);
          });
    }

    return(
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Avaliar</Text>
                <StarRating
                    rating={rating}
                    onChange={setRating}
                />
                <View  style={styles.buttonArea}>
                    <TouchableOpacity style={styles.button} onPress={handleClose}>
                        <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleButtonAvaliar}>
                        <Text style={styles.buttonSaveText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
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
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"rgba(24,24,24,0.6)",
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    content:{
        backgroundColor:"#FFF",
        width:"85%",
        paddingTop:24,
        paddingBottom:24,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:8
    },
    title:{
        fontSize:20,
        fontFamily:'Poppins-Bold',
        color:"#000",
        marginBottom:24
    },
    innerPassword:{
        backgroundColor: "#0e0e0e",
        width:"90%",
        padding:14,
        borderRadius:8
    },
    text:{
        color:"#FFF",
        textAlign:"center",
        justifyContent:"center",
        fontFamily:'Poppins-Regular'
    },
    buttonArea:{
        flexDirection:"row",
        width:"90%",
        marginTop:8,
        alignItems:"center",
        justifyContent:"space-between"
    },
    button:{
        flex:1,
        alignItems:"center",
        marginTop:14,
        marginBottom:14,
        padding:8
    },
    buttonSave:{
        backgroundColor:"#3D5CFF",
        borderRadius:8
    },
    buttonSaveText:{
        color:"#FFF",
        fontFamily:'Poppins-Bold'
    },
    buttonText:{
        color:"#000000",
        fontFamily:'Poppins-Bold'
    }

  })