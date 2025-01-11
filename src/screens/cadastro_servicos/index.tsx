import { useCallback, useEffect, useState } from "react"
import { Alert, Button, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import useApi from "../../services/api"

export const Cadastro_produto = ({navigation}:any) => {

    const [ aplicacao , setAplicacao ] = useState([]);
    
    const [ valor, setValor ] = useState<boolean>(false)
 
    const api = useApi();


    return (
        <View style={{ flex: 1 }}>
            
 
        </View>
    )
}