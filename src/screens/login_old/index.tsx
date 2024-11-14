import { useEffect, useState } from "react";
import { Alert, Button, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native"
import { api } from "../../services/api";
import { useContext } from "react";
import { AuthContext } from '../../contexts/auth'
import { useUsuario } from "../../database/queryUsuario/queryUsuario";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native-gesture-handler";


export const Login_old = ( { navigation })=>{

const { setLogado ,usuario , setUsuario }:any = useContext(AuthContext)

    const [user, setUser] = useState<any>();
    const [ usuarioSelecionado, setUsuarioSelecionado ] = useState();
    const [senha, setSenha] = useState<any>();
    const [ usuariosMobile, setUsuariosMobile ] = useState<Usuario[]>();
    const [ visibleSelectUser, setVisibleSelectUser ] = useState<boolean>(false);

    const useQueryUsuario = useUsuario();

 
    async function   logar(){
        let user:any = {
            "nome":usuarioSelecionado.nome,
             "senha":senha 
        }
                 try{
                     const response:any = await useQueryUsuario.signin( user);
 
                     if(response?.length > 0  ){
                     console.log('Usuario logado ',response )

                         setLogado(true)
                         setUsuario(response[0])
                     }else{
                         Alert.alert(`Usuário ${user.nome} nao foi encontrado!`)
                     }
                 }catch(err:any){
                         Alert.alert("erro", err.response.data.error)
             }
        }
 
     type Usuario =  {
            codigo:number,
            nome: String,
            senha: String,
        }

        async function   buscaUsuariosDosistema(){

            try{
             const response = await api.get('/usuarios')
             console.log(response.data)
                 let dados = response.data;
                 
             if(response.status === 200 && dados.length > 0 ){
                     for( let u of dados){

                        let usuario = {
                            codigo: u.codigo,
                            nome:u.nome,
                            senha:u.senha_web
                         }
                         
                             let aux:any =  await useQueryUsuario.selectByCode(usuario.codigo);
                                
                                  if(aux?.length > 0 ){
                                      await useQueryUsuario.update(usuario ) 
                                  }else{
                                      await useQueryUsuario.create(usuario)
                                  }
                                                       }
                }else{
                    console.log(response.data)
                }
            }catch(err:any){
                    Alert.alert("erro", err.response.data.error)
            }

 
        }  


useEffect(
    ()=>{
        async function   buscaUsuario(){

             try{
              const response = await api.get('/usuarios')
              console.log(response.data)
                  let dados = response.data;
                  
              if(response.status === 200 && dados.length > 0 ){
                      for( let u of dados){
 
                         let usuario = {
                             codigo: u.codigo,
                             nome:u.nome,
                             senha:u.senha_web
                          }
                          
                              let aux:any =  await useQueryUsuario.selectByCode(usuario.codigo);
                                 
                                   if(aux?.length > 0 ){
                                       await useQueryUsuario.update(usuario ) 
                                   }else{
                                       await useQueryUsuario.create(usuario)
                                   }
                        }
                  //  setLogado(true)
                //  setUsuario(response.data)
                 }else{
                     console.log(response.data)
                 }
             }catch(err:any){
                     Alert.alert("erro", err.response.data.error)
             }

                 // usuario para teste
              //   setUsuario(
              //      {
              //          "codigo":110,
              //          "nome":"teste",
              //          "senha":123
              //      }
              //  )
              //           setLogado(true)
         }       
         buscaUsuario();

         
    },[]
)


useEffect(()=>{
    async function filtraUsuarios(){
        let response : any  = await useQueryUsuario.selectAll();
        if(response?.length > 0 ) setUsuariosMobile(response)
            console.log(response)
 }

 filtraUsuarios();

},[ visibleSelectUser ] )
    

function selecionaUsuario(item){
        setVisibleSelectUser(false)
        setUsuarioSelecionado(item)
    }


const t = ({item}) => {
                return(

                    <TouchableOpacity 
                        style={{ marginLeft:14, backgroundColor:'#FFF',padding:5, margin:2 , borderRadius:5 , elevation:2}}
                        onPress={()=> selecionaUsuario(item) } >
                     <Text style={{ margin:3}} >
                         {item.nome}
                     </Text>
                    </TouchableOpacity>
                )              
}
    return(

        <View style={{ flex: 1, backgroundColor: "#EAF4FE" }}>
 
                 <View style={{ alignItems:"flex-end" ,marginTop:20, padding:10 }} >
                        <TouchableOpacity style={{ width:50, height:30   }} onPress={ ()=> navigation.navigate('api_config')} >
                        <Feather name="settings" size={30} color="#524D4F" />
                     </TouchableOpacity>
                 </View>


            <View style={{ width:"100%",height:"80%", backgroundColor:'#EAF4FE', alignItems:'center',justifyContent:'center'}}>
                    
                    <Image
                    source={require('../../imgs/intersig120x120.png')}
                    />

                    
                    
                    <TouchableOpacity style={{   width:'70%', margin:10,padding:10, borderRadius:10, backgroundColor:"#FFF",elevation:2 }} 
                    onPress={()=> { visibleSelectUser?  setVisibleSelectUser(false) :  setVisibleSelectUser(true) } }
                     >
                    
                    {   visibleSelectUser ? (
                       <View style={ { flexDirection:'row'}} >
                      <AntDesign name="down" size={24} color="#5E5E5E" />
                      {  usuarioSelecionado  !== undefined && (  <Text style={{ fontWeight:'bold'}} >{usuarioSelecionado?.nome} </Text>) }
                      </View>

                    ) : (
                        <View style={ { flexDirection:'row'}} >
                        <AntDesign name="right" size={24} color="#5E5E5E" />
                      
                        {  usuarioSelecionado  !== undefined ? (  <Text style={{ fontWeight:'bold'}}>  {usuarioSelecionado?.nome} </Text>) : (  <Text>Login </Text>)  }
                      </View>
                    )
                    }
                    </TouchableOpacity>

                          
                          {visibleSelectUser &&
                                 
                                      <View style={{
                                            margin: 10, backgroundColor: '#EAF4FE', borderRadius: 10, width: '96%',
                                            height: '30%' ,
                                            shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25,
                                            shadowRadius: 4,
                                            
                                        }}>

                                           {
                                            usuariosMobile?.length > 0 
                                            ?
                                            <FlatList
                                            data={ usuariosMobile }
                                            renderItem={t}
                                           />
                                           :<View>
                                             <Text> Nenhum Usuario Resgistrado </Text>
                                                <Button title="buscar usuarios" onPress={()=> buscaUsuariosDosistema()}/>    
                                           </View>
                                           }      
                                             
                                    </View>
                                }
                        {  usuarioSelecionado  !== undefined && (  
                            <TextInput
                                style={{
                                    width:'70%', margin:10,padding:10, borderRadius:10, backgroundColor:"#FFF",elevation:2 
                                }}
                                placeholder="Senha"
                                onChangeText={(v)=>setSenha(v) }
                            />
                        ) }

                    <TouchableOpacity style={{margin:10,backgroundColor:'#524D4F', width:'40%', borderRadius:10, alignItems:'center', padding:5,elevation:7}}
                        onPress={()=> logar()}
                     >
                            <Text style={{color:"#FFF"}}>
                                    logar
                            </Text>
                    </TouchableOpacity>
              </View>

        </View>

)
}