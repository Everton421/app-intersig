import { TextInput,Text, Button, TouchableOpacity, View, Image } from "react-native";
import useApi from "../../services/api";
import { useEffect } from "react";
import axios from "axios";
 
 

export const Teste = ()=>{

const api = useApi()

    async function teste(){
        let aux = await api.get('/teste')
        console.log(aux.data)
    }
    async function teste2(){
        const t = await  axios.get('https://viacep.com.br/ws/01001000/json/');
        console.log(t.data)
    }
    useEffect(()=>{
        teste()
    },[])
    return (
        <View style={{ flex: 1, backgroundColor: "#EAF4FE"  }}>
                      
                        <TouchableOpacity   style={{   margin:10}}>
                        </TouchableOpacity>

  
     
      </View>
    )
}