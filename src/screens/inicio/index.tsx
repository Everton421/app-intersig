import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, StatusBar } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export const Inicio = ({navigation}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const imageOpacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1], // Começa invisível e termina visível
    });

    useEffect(() => {
        // Iniciar a animação para subir a view e a imagem
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500, // Duração da animação
            useNativeDriver: true,
        }).start();
    }, []);

    // Interpolar o valor de animação para a posição Y
    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0], // Começa 100 unidades abaixo e termina na posição original
    });

    return (
        <View style={{ flex: 1, backgroundColor: '#EAF4FE' }}>
            

                <Animated.View style={{ width: '100%' ,marginTop: 55,   alignItems: "center",justifyContent:'center', opacity: imageOpacity, transform: [{ translateY }] }}>
                    <Image
                        style={{ width: 95, height: 95, resizeMode: 'stretch' }}
                        source={require('../../imgs/intersig120x120.png')}
                    />
                </Animated.View>

                <Animated.View
                    style={{
                        transform: [{ translateY }],
                        width: '100%',
                        padding: 10,
                        backgroundColor: '#185FED',
                        alignItems: "center",
                        borderTopStartRadius: 30,
                        borderTopEndRadius: 30,
                        marginTop: 55,
                        height: '100%',
                    }}
                >
                    <View style={{ width: '100%', alignItems: "center", marginTop: 25 }}>
                        <TouchableOpacity style={{ alignItems: "center", padding: 10, borderRadius: 20, backgroundColor: '#fff', width: '90%', elevation: 5 }} 
                         onPress={()=> navigation.navigate('registrar_empresa')}  >
                            <Text style={{ color: '#185FED', fontWeight:'bold', width: '100%',textAlign:'center', fontSize:18 }}>Registrar Empresa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ alignItems: "center", padding: 10, borderRadius: 20, backgroundColor: '#FFF', width: '90%', marginTop: 15, elevation: 5 }}
                         onPress={()=> navigation.navigate('login')}  >
                            <Text style={{ color: '#185FED', fontWeight:'bold', width: '100%',textAlign:'center', fontSize:18}}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
        </View>
    );
};


 