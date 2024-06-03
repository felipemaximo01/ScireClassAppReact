import * as React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

export function VideoScreen({ onClose, videoPath }) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [showButton, setShowButton] = React.useState(false);

    React.useEffect(() => {
        // Altera a orientação para paisagem quando o componente é montado
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

        // Restaura a orientação para padrão quando o componente é desmontado
        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);

    const handlePress = () => {
        setShowButton(!showButton);
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                        uri: videoPath
                    }}
                    useNativeControls={true}
                    resizeMode="contain"
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
                {showButton && (
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        position: 'absolute',
        backgroundColor: '#ffffff',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        flex: 1,
        position: 'absolute',
        backgroundColor: 'black',
        width: Dimensions.get('window').height,
        height: Dimensions.get('window').width,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
    },
}); 