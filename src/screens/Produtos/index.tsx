import { View , Text, TextInput, FlatList, Modal, Button, Image} from "react-native";
import { useProducts } from "../../database/queryProdutos/queryProdutos";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";


export function Produtos (){
  const useQueryProdutos = useProducts();
const [ pesquisa, setPesquisa ] = useState(1);
const [ dados , setDados ] = useState();
const [ pSelecionado, setpSelecionado ] = useState();
const [ visible, setVisible ] = useState(false);


useEffect(()=>{

            async function filtrar(){
                const response = await useQueryProdutos.selectByDescription(pesquisa, 10);

                if(response.length > 0  ){
                    console.log(response)
                    setDados(response)
                }
            }

           filtrar();

        },[ pesquisa ])

        function handleSelect(item){
                setpSelecionado(item);
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
                     {item.descricao}
                   </Text>
                   <Text style={{ fontWeight:"bold"}}>
                     R$ {item.preco}
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
                                         <Text style={{ fontWeight:"bold" }} > Codigo: {pSelecionado?.codigo} </Text>
                                     </View>   

                                     <View style={{ backgroundColor:'#fff', borderRadius:5, height:25, elevation:5 }}>
                                       <Text> R$ {pSelecionado?.preco.toFixed(2)} </Text>
                                     </View>   
                                 </View>
  
                                        <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                          <Text>{pSelecionado?.descricao}</Text>
                                        </View>
                                       
                                        <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                            <Text> Estoque: {pSelecionado?.estoque} </Text>
                                        </View>

                                         <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                             <Text>SKU: {pSelecionado?.sku}</Text>
                                         </View>
                                         <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                             <Text>GTIN: {pSelecionado?.num_fabricante}</Text>
                                         </View>

                                        <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                             <Text>Referencia: {pSelecionado?.num_original}</Text>
                                        </View>
                                             
                                       <View style={{ flexDirection:"row", justifyContent:"space-between"}} > 
                                            <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                 <Text>Marca: {pSelecionado?.marca}</Text>
                                            </View>
                                            <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                 <Text>Grupo: {pSelecionado?.grupo}</Text>
                                            </View>
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