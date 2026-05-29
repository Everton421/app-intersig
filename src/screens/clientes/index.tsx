import {   useEffect, useState } from "react";
import {Text, Button, FlatList, Image, Modal, TextInput, TouchableOpacity, View } from "react-native";
import { useClients } from "../../database/queryClientes/queryCliente";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { RenderItensClients } from "./components/renderItemsClients/RenderItensClients";
import { defaultColors } from "../../styles/global";
import { CustomHeader } from "../../components/custom-header";
import { EmptyState } from "../../components/empty-state";
import { Fab } from "../../components/fab";

export type client = 
{
    codigo:number,
    cnpj:string,
    nome:string,
    ie:string,
    cep:string,
    cidade:string,
    endereco:string,
    numero:string
}

export function Clientes({navigation}:any){
    
    const [ pesquisa, setPesquisa ] = useState('');
    const [ dados , setDados ] = useState<client[]>([]);
    const [ cSelecionado, setcSelecionado ] = useState<client>();
    const [ visible, setVisible ] = useState(false);
    
    const useQueryClients = useClients();


    ////////////////
     useEffect(()=>{
    
                async function filtrar(){
                    if( pesquisa !== ''){
                        let response:any
                          response = await useQueryClients.selectByDescription( pesquisa , 25);
                        if(response.length > 0  ){
                           // console.log(response)
                            setDados(response)
                        }
                    }else{
                        const response:any = await useQueryClients.selectAllLimit(25);
                        if(response.length > 0  ){
                           // console.log(response)
                            setDados(response)
                        }
                    }  
                }
               filtrar();
    
      },[ pesquisa ])
    ////////////////
  
    function handleSelect(item:client){
                //setcSelecionado(item);
                //setVisible(true)
            navigation.navigate('cadastro_cliente',{ codigo_cliente: item.codigo})
            }       
             
            return(
              <View style={{ flex:1, backgroundColor:'#EAF4FE', width:"100%" }}>
                  <CustomHeader
                      title="Clientes"
                      onBack={() => navigation.goBack()}
                      showSearch
                      searchValue={pesquisa}
                      onSearchChange={(v) => setPesquisa(v)}
                  />
                       
                        <Modal transparent={true} visible={ visible }>
                            <View style={{ width:'100%',height:'100%', alignItems:"center", justifyContent:"center", backgroundColor: 'rgba(50,50,50, 0.5)'}} >
                                
                                <View style={{ width:'96%',height:'97%', backgroundColor:'#E0E0E0', borderRadius:10}} >
                                    
                                        <View style={{ margin:8}}>
                                               <Button
                                                onPress={()=>setVisible(false)}
                                                title="Voltar"
                                            />
                                        </View>
        
                                         <View style={{ margin:10, gap:15, flexDirection:"row"}}>
                                            <Image
                                                style={{ width: 70 , height: 70   }}
                                                source={{
                                                    uri:'https://reactnative.dev/img/tiny_logo.png' 
                                                }}
                                                />
                                             <View style={{ backgroundColor:'#fff', borderRadius:5, height:25, elevation:5 }}>
                                                 <Text style={{ fontWeight:"bold", fontSize:15 ,color:defaultColors.gray}} >
                                                     Codigo: {cSelecionado?.codigo} </Text>
                                             </View>   
        
                                                
                                         </View>
          
                                                <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                  <Text>{cSelecionado?.nome}</Text>
                                                </View>
                                               
                                                <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                    <Text> CNPJ: {cSelecionado?.cnpj} </Text>
                                                </View>
        
                                                 <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                     <Text> IE: {cSelecionado?.ie} </Text>
                                                 </View>
                                                
                                                <View style={{ borderWidth:0.5}}></View>

                                                <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                      <Text>cep: {cSelecionado?.cep}</Text>
                                                 </View>
                                                
                                                 <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                      <Text>cidade: {cSelecionado?.cidade}</Text>
                                                 </View>
                                                <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                     <Text>endereço: {cSelecionado?.endereco}</Text>
                                                </View>

                                                <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                     <Text>numero: {cSelecionado?.numero}</Text>
                                                </View>
                                                
                                 </View>    
                            </View>
                        </Modal>
                   
                     <FlatList
                          data={dados}
                          renderItem={({item})=> RenderItensClients({item, handleSelect})}
                          keyExtractor={(i)=> i.codigo.toString() }
                          ListEmptyComponent={() => <EmptyState icon="people-outline" message="Nenhum cliente encontrado" />}
                     />

             <Fab onPress={() => navigation.navigate('cadastro_cliente')} />
        
                </View>
            )
}
