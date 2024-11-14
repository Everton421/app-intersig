import React, { useEffect, useContext, useState } from "react";
import { View, FlatList, Text, Alert, BackHandler, TouchableOpacity, StatusBar, Image } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { EnviaProduto } from "../enviaProdutos";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Grafico } from "../../components/grafico";
import { useUsuario } from "../../database/queryUsuario/queryUsuario";
import { restartDatabaseService } from "../../services/restartDatabase";
import { useProducts } from "../../database/queryProdutos/queryProdutos";
import { useServices } from "../../database/queryServicos/queryServicos";
import { queryEmpresas } from "../../database/queryEmpresas/queryEmpresas";
 

export const Home = ({navigation}:any) => {
  const { setLogado , setUsuario, usuario}: any = useContext(AuthContext);

  const [ sair , setSair ] = useState<boolean>(false) 
  const [ qtdProdutos , setQtdProdutos ] = useState(0) 
  const [ qtdServicos , setQtdServicos ] = useState(0) 
  const [ cadEmpresa , setCadEmpresa ] = useState() 


  let useQueryUsuario = useUsuario();
 let useQueryProdutos = useProducts();
 let useQueryServices = useServices();
 let useQueryEmpresa = queryEmpresas();

  let  restartDB = restartDatabaseService();

 
useEffect(
  ()=>{
    
    

    async function buscaEmpresa(){
      try{
          let result:any  = await useQueryEmpresa.findBycnpj(usuario.cnpj);
          console.log(result)
          if( result.length > 0 ){
            setCadEmpresa(result[0]) 
          }
      }catch(e){
        console.log(e)
      }
    }
    
    buscaEmpresa()
 
  },[]
)
  

  function alertSair(){
    Alert.alert('Sair', 'Ao sair serão excluidos os dados do aplicativo, será necessario efetuar uma nova sincronização',
       [
        {
          text: 'Cancelar',
          onPress: () => setSair(false),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => setSair(true)}
       ]);

  }

  useEffect( ()=>{
  async function logout(){
    if ( sair === true ){
      setLogado(false)
      setUsuario({})
      await restartDB.restart();
      navigation.navigate('inicio')
      }
    }
  logout()
  },[ sair ])
  
  
 
  const data = [
      { "nome":"vendas",
       "icon":<MaterialCommunityIcons name="cart-variant" size={30} color="#185FED" />
       },
       { "nome":"OS",
         "icon": <FontAwesome5 name="tools" size={25} color="#185FED" />
         },
         { "nome":"usuarios",
          "icon":<FontAwesome name="users" size={24} color="#185FED" />
          }, 
       { "nome":"settings",
       "icon":<FontAwesome5 name="sync-alt" size={24} color="#185FED" />
       }, 
    ];

  const Item = ({ value }: any) => {
    return (
      <TouchableOpacity style={{  margin: 5 }}    onPress={ ()=> navigation.navigate(value.nome) }    >
          <View
            style={{   backgroundColor: "#FFF", margin: 10, borderRadius: 100, width: 55, height: 55, alignItems: "center", justifyContent: "center",  elevation:5  }} >
              {value.icon}

          </View>
          <Text style={{fontSize:15, fontWeight:"bold", textAlign:"center"}}> {value.nome}</Text>
 

      </TouchableOpacity>
      
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EAF4FE" }}>
      <View style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor:'#185FED', elevation:7, padding:5 ,   }}>
          <View style={{ backgroundColor:'#FFF', borderRadius:55, padding:3, margin:3 }}>
            <Image
                    style={{ width:45, height:45, resizeMode: 'stretch',}}
                    source={ 
                     require('../../imgs/intersig120x120.png')
                    }
                   />
          </View>
        
       <Text style={{fontWeight:"bold",color:'#FFF',margin:7}}>
        { cadEmpresa?.nome}
       </Text>

        </View>
      <View style={{margin:10,alignItems:"center"}}>
        <FlatList
          horizontal={true}
          data={data}
          renderItem={({ item }) => <Item value={item} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>

            <View style={{alignItems:"center", width:'100%',  marginTop:15}}>


            <View style={{ flexDirection:"row", width:'100%', alignItems:"center", justifyContent:"center"}}>
                      <TouchableOpacity style={{ marginTop:15, margin:10, backgroundColor:'#FFF', width:'40%', padding:15, borderRadius:10, elevation:2 ,   justifyContent:"space-between", alignItems:"center" }}
                      onPress={()=>{ navigation.navigate('produtos')}} >
                            <View style={{ backgroundColor:'#EAF4FE' , flexDirection:"row",   height:50, width:50, alignItems:"center",justifyContent:"center", borderRadius:7, elevation:3 }}>
                          <Foundation name="book" size={30} color="#185FED" />
                          </View>
                                <Text style={{ fontWeight:"bold", fontSize:15, color:'#333' ,width: '80%' ,textAlign:'center'}} >Produtos</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={{ marginTop:15,margin:10,  backgroundColor:'#FFF', width:'40%',padding:15, borderRadius:10, elevation:2 ,   justifyContent:"space-between", alignItems:"center" }}
                      onPress={()=>{ navigation.navigate('serviços')}} >
                          <View style={{ backgroundColor:'#EAF4FE' , flexDirection:"row",   height:50, width:50, alignItems:"center",justifyContent:"center", borderRadius:7, elevation:3 }}>
                          <Feather name="tool" size={30} color="#185FED" />
                          </View>
                                <Text style={{ fontWeight:"bold", fontSize:15, color:'#333' ,width: '80%' ,textAlign:'center'}} >Serviços</Text>
                      </TouchableOpacity>
                   </View>



                   <TouchableOpacity style={{ backgroundColor:'#FFF', marginTop:15,width:'80%',padding:15, borderRadius:10, elevation:2 , flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}
                    onPress={()=>{ navigation.navigate('clientes')}}
                   >
                         <View style={{ backgroundColor:'#EAF4FE' , flexDirection:"row",   height:50, width:50, alignItems:"center",justifyContent:"center", borderRadius:7, elevation:3 }}>
                            <Feather name="users" size={30} color="#185FED" />
                         </View>
                              <Text style={{ fontWeight:"bold", fontSize:18, color:'#333' ,width: '50%' ,textAlign:'center'}} >clientes</Text>
                              <AntDesign name="caretright" size={24} color="#185FED" />
                    </TouchableOpacity>


                

                 </View>

                 <View style={{  flexDirection:"row",position: 'absolute', bottom: 0, left: 0, right: 0,   backgroundColor: '#185FED',   padding: 10 ,justifyContent:"space-between",  }}>
                     <Text style={{ color:'#FFF', fontSize:20, fontWeight:"bold", width:'50%'}}>
                       { usuario && usuario.nome}
                     </Text>

                       <TouchableOpacity onPress={()=> alertSair()} style={{ flexDirection:"row"}}>
                           <MaterialCommunityIcons name="logout" size={24} color="white" />
                           <Text style={{ color:'#FFF' ,  fontWeight:"bold"}} >Sair</Text>
                       </TouchableOpacity>
                 </View> 
   
    </View>
  );
};
