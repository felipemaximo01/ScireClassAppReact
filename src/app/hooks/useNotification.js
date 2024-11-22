import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

const useNotification = () => {
    messaging().onMessage(async (remoteMessage) => {
        if (remoteMessage) {
            console.log('Foreground notification received:', remoteMessage);

            const { title, body } = remoteMessage.notification || remoteMessage.data;

            Alert.alert(title || "Notificação", body || "Você recebeu uma nova mensagem.");
            
        }
    });
};

export default useNotification;