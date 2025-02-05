import { useContext, useEffect, useState } from "react";
import {Text, Button, FlatList, Image, Modal, TextInput, TouchableOpacity, View } from "react-native";
import { useClients } from "../../database/queryClientes/queryCliente";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexts/auth";

export function Clientes({navigation}){
    
    const [ pesquisa, setPesquisa ] = useState('');
    const [ dados , setDados ] = useState([]);
    const [ cSelecionado, setcSelecionado ] = useState();
    const [ visible, setVisible ] = useState(false);
    
    const useQueryClients = useClients();

  const { usuario }: any = useContext(AuthContext);

    ////////////////

       
     useEffect(()=>{
    
                async function filtrar(){
                    if( pesquisa !== ''){
                        const response:any = await useQueryClients.selectByDescription( pesquisa , 25);
                        if(response.length > 0  ){
                            console.log(response)
                            setDados(response)
                        }
                    }else{
                        const response:any = await useQueryClients.selectAllLimit(25);
                        if(response.length > 0  ){
                            console.log(response)
                            setDados(response)
                        }
                    }  
                }


               filtrar();
    
      },[ pesquisa ])
    ////////////////
  
    function handleSelect(item){
                setcSelecionado(item);
                setVisible(true)
            }
    
            
            function renderItem({item}){
                return(
                    <TouchableOpacity 
                        onPress={ ()=> handleSelect(item) }
                        style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%'}}
                     >
                       <Text style={{ fontWeight:"bold"}}>
                          Codigo: {item.codigo}
                       </Text>
    
                       <Text>
                         {item.nome}
                       </Text>
                       <Text style={{ fontWeight:"bold" }}>
                           CNPJ:  {item.cnpj}
                       </Text>
                    </TouchableOpacity>
                )
            }


            return(
                <View style={{ flex:1 ,    backgroundColor:'#EAF4FE', width:"100%"  }}>
                <View style={{ backgroundColor:'#185FED', }}> 
                   <View style={{   padding:15,  alignItems:"center", flexDirection:"row", justifyContent:"space-between" }}>
                      <TouchableOpacity onPress={  ()=> navigation.goBack()  } style={{ margin:5 }}>
                          <Ionicons name="arrow-back" size={25} color="#FFF" />
                      </TouchableOpacity>
                  
                        
                      <View style={{ flexDirection:"row", marginLeft:10 , gap:2, width:'100%', alignItems:"center"}}>
                          < TextInput 
                              style={{  width:'70%', fontWeight:"bold" ,padding:5, margin:5, textAlign:'center', borderRadius:5, elevation:5, backgroundColor:'#FFF'}}
                              onChangeText={(value)=>setPesquisa(value)}
                              placeholder="pesquisar"
                          /> 
      
                          <TouchableOpacity  //onPress={()=> setShowPesquisa(true)}
                              >
                                  <AntDesign name="filter" size={35} color="#FFF" />
                              </TouchableOpacity>
                          </View>
                   </View>
                       <Text style={{   left:5, bottom:5, color:'#FFF' ,fontWeight:"bold" , fontSize:20}}> Clientes </Text>
                 </View>
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
                                                 <Text style={{ fontWeight:"bold" }} > Codigo: {cSelecionado?.codigo} </Text>
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
                         renderItem={(item)=> renderItem(item)}
                         keyExtractor={(i)=>i.codigo}
                     />

                <TouchableOpacity
                style={{
                    backgroundColor: '#185FED', 
                    width: 50, 
                    height: 50,   
                    borderRadius: 25,  
                    position: "absolute",       
                    bottom: 150,                 
                    right: 30,                   
                    elevation: 10,               
                    alignItems: "center", 
                    justifyContent: "center",
                    zIndex: 999,             // Garante que o botão fique sobre os outros itens
                }}
                onPress={() => {
                    navigation.navigate('cadastro_cliente')
                }}
            >
                <MaterialIcons name="add-circle" size={45} color="#FFF" />
            </TouchableOpacity>
        
                </View>
            )
}
