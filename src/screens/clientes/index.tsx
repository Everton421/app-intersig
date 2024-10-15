import { useEffect, useState } from "react";
import {Text, Button, FlatList, Image, Modal, TextInput, TouchableOpacity, View } from "react-native";
import { useClients } from "../../database/queryClientes/queryCliente";

export function Clientes(){
    
    const [ pesquisa, setPesquisa ] = useState(1);
    const [ dados , setDados ] = useState([]);
    const [ cSelecionado, setcSelecionado ] = useState();
    const [ visible, setVisible ] = useState(false);
    
    const useQueryClients = useClients();

    useEffect(()=>{
    
                async function filtrar(){
                    const response = await useQueryClients.selectByDescription( pesquisa , 10);
                    if(response.length > 0  ){
                        console.log(response)
                        setDados(response)
                    }
                }
               filtrar();
    
            },[ pesquisa ])
    
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
                <View style={{ flex:1 , margin:5, alignItems:"center"}}>
                    
                    <TextInput
                        style={{ textAlign:"center", backgroundColor:'#FFF',padding:3,  borderRadius:3, width:'95%', elevation:4}}
                        placeholder="pesquisar"
                       onChangeText={(v)=> setPesquisa(v)}
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
        
                <View style={ { marginTop:4} } > 
                     <FlatList
                         data={dados}
                         renderItem={(item)=> renderItem(item)}
                         keyExtractor={(i)=>i.codigo}
                     />
                    </View>
        
                </View>
            )
}
