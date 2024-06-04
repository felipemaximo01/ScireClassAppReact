import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject } from "expo-location";
import {
    setDefaults,
    fromAddress,
} from "react-geocode";
import MapViewDirections from "react-native-maps-directions";


export function Maps({enderecoUsuario,enderecoCurso,handleDirectionsReady }) {

    const [location, setLocation] = useState(null);

    const [latCurso, setLatCurso] = useState('');
    const [lngCurso, setLngCurso] = useState('');


    const [latUsurario, setlatUsuario] = useState('');
    const [lngUsuario, setlngUsuario] = useState('');


    async function requestLocationPermissions() {
        const { granted } = await requestForegroundPermissionsAsync();

        if (granted) {
            const currentPosition = await getCurrentPositionAsync();
            setLocation(currentPosition);
        }
    }

 

    setDefaults({
        key: "AIzaSyDiF1E0Yg6rIcuhXd65AM2piQROCE3RIyE", // Your API key here.
        language: "pt-br", // Default language for responses.
        region: "br", // Default region for responses.
    });

    fromAddress(enderecoCurso)
    .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        setLatCurso(lat);
        setLngCurso(lng);
    });

    fromAddress(enderecoUsuario)
    .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        setlatUsuario(lat);
        setlngUsuario(lng);
    });

    const positionCurso = {
        lat: latCurso,
        lng: lngCurso
    };

    const positionUsuario = {
        lat: latUsurario,
        lng: lngUsuario
    };

    useEffect(() => {
        requestLocationPermissions();
    }, [])

    return (
        <View style={styles.container}>

            {location ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: positionUsuario.lat,
                        longitude: positionUsuario.lng,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: positionUsuario.lat,
                            longitude: positionUsuario.lng,
                        }}
                        title="You are here"
                    />
                    <Marker
                        coordinate={{
                            latitude: positionCurso.lat,
                            longitude: positionCurso.lng,
                        }}
                        title="You are here"
                    />
                    <MapViewDirections
                        origin={{
                            latitude: positionUsuario.lat,
                            longitude: positionUsuario.lng,
                        }}
                        destination={{
                            latitude: positionCurso.lat,
                            longitude: positionCurso.lng,
                        }}
                        apikey="AIzaSyDiF1E0Yg6rIcuhXd65AM2piQROCE3RIyE"
                        strokeWidth={6}
                        strokeColor="#3D5CFF"
                        onReady={handleDirectionsReady}
                    />
                </MapView>
            ) : (
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            )}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width:'100%',
        height:'100%'
    },
    map: {
        flex: 1,
        width: '100%',
        height:'100%'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height:'100%'
    },
})