import AsyncStorage from "@react-native-async-storage/async-storage"

const useStorage = () => {

    const getItem = async(key) => {
        try{
            const token = await AsyncStorage.getItem(key);
            return token || null;
        }catch(e){
            console.log(e)
            return null
        }
    }

    const saveItem = async(key,value) => {
        try{
            await AsyncStorage.setItem(key,value)
        }catch(e){
            console.log(e)
        }
    }

    return{
        getItem,
        saveItem,
    }
}

export default useStorage;