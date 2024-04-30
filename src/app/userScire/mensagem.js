import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, Image, Modal, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter, Link } from 'expo-router'
import useStorage from "../hooks/useStorage"
import useLocalhost from "../hooks/useLocalhost"
import { ModalBAD } from '../componentes/modal/modalBAD';
import { ModalLoading } from '../componentes/modal/modalLoading';
import * as Progress from 'react-native-progress';

export default function Mensagem() {
    return (
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <Text>Mensagens</Text>
                </View>
                <View>
                    <Text>Chats</Text>
                    <Text>Notificação</Text>
                </View>
                <View>
                    <Pressable>
                        <View>
                            <Image />
                            <Text>Name</Text>
                            <Text>Last Mensagem</Text>
                            <Text>16:32</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
});