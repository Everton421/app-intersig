import { useEffect, useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { api } from "../../services/api";
import { useContext } from "react";
import { AuthContext } from '../../contexts/auth'
import { useUsuario } from "../../database/queryUsuario/queryUsuario";

export const Login = ()=>{

const { setLogado ,usuario , setUsuario }:any = useContext(AuthContext)


    const [user, setUser] = useState<any>();
    const [senha, setSenha] = useState<any>();

        const useQueryUsuario = useUsuario();

    async function   buscaUsuario(){
        let user:any = {
            "nome":usuario,
             "senha":senha 
        }

   

          //      try{
          //          const response:any = await useQueryUsuario.signin( user);
          //          console.log('Usuario logado ',response )
//
          //          if(response?.length > 0  ){
          //              setLogado(true)
          //              setUsuario(response[0])
          //          }else{
          //              Alert.alert(`Usuário ${user.nome} nao foi encontrado!`)
          //          }
          //      }catch(err:any){
          //              Alert.alert("erro", err.response.data.error)
          //  }
        }

useEffect(
    ()=>{
        async function   buscaUsuario(){

          
    //        try{
    //         const response = await api.get('/usuarios')
    //         console.log(response.data)
    //             let dados = response.data;
    //             
    //         if(response.status === 200 && dados.length > 0 ){
    //                 for( let u of dados){
//
    //                    let usuario = {
    //                        codigo: u.codigo,
    //                        nome:u.nome,
    //                        senha:u.senha_web
    //                     }
    //                     
    //                         let aux:any =  await useQueryUsuario.selectByCode(usuario.codigo);
    //                            
    //                              if(aux?.length > 0 ){
    //                                  await useQueryUsuario.update(usuario ) 
    //                              }else{
    //                                  await useQueryUsuario.create(usuario)
    //                              }
    //                   }
    //     
    //             //  setLogado(true)
    //           //  setUsuario(response.data)
    //            }else{
    //                console.log(response.data)
    //            }
    //        }catch(err:any){
    //                Alert.alert("erro", err.response.data.error)
    //        }

                 // usuario para teste
                 setUsuario(
                    {
                        "codigo":110,
                        "nome":"teste",
                        "senha":123
                    }
                )
                         setLogado(true)
         }       
         buscaUsuario();

    },[]
)

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