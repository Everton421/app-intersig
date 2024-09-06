import { useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { api } from "../../services/api";
import { useContext } from "react";
import { AuthContext } from '../../contexts/auth'

export const Login = ()=>{

const { setLogado ,usuario , setUsuario }:any = useContext(AuthContext)

    const [user, setUser] = useState<any>();
    const [senha, setSenha] = useState<any>();

    async function   buscaUsuario(){

     try{
         const response = await api.post('/auth',{"nome":usuario, "senha":senha})
         console.log(response.data)
         if(response.status === 200 ){
             setLogado(true)
             setUsuario(response.data)
         }
     }catch(err:any){
             Alert.alert("erro", err.response.data.error)
   }
}

    return(

        <View style={{flex: 1, backgroundColor:'#e9ecf1', alignItems:'center',justifyContent:'center'}}>

            <Image
            source={require('../../imgs/intersig120x120.png')}
            />

            <TextInput
            style={{ 
                width:'70%', margin:10,padding:10, borderRadius:10,
                 backgroundColor:"#FFF",elevation:5    
                }}
            onChangeText={(value:any)=> setUsuario(value)}
            placeholder="usuario"
            />
            <TextInput
             style={{ 
                width:'70%', margin:10,padding:10, borderRadius:10,
                 backgroundColor:"#FFF",elevation:5 
                }}
             onChangeText={(value:any)=> setSenha(value)}
              placeholder="senha"
              textContentType="password"
              
            />

            <TouchableOpacity style={{margin:10,backgroundColor:'blue', width:'40%', borderRadius:10, alignItems:'center', padding:5,elevation:7}}
                onPress={()=>buscaUsuario()}
            >
                    <Text style={{color:"#FFF"}}>
                            logar
                    </Text>
            </TouchableOpacity>
        </View>
    )
}