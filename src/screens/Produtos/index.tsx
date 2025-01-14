import { View , Text, TextInput, FlatList, Modal, Button, Image} from "react-native";
import { useProducts } from "../../database/queryProdutos/queryProdutos";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect  } from "@react-navigation/native";

export function Produtos ( {navigation} ){
  const useQueryProdutos = useProducts();
const [ pesquisa, setPesquisa ] = useState();
const [ dados , setDados ] = useState();
const [ pSelecionado, setpSelecionado ] = useState();
const [ visible, setVisible ] = useState(false);


useEffect(()=>{

            async function filtrar(){
                const response = await useQueryProdutos.selectByDescription(pesquisa, 10);

                if(response.length > 0  ){
                    setDados(response)
                }
            }

           filtrar();

        },[ pesquisa ])
///////
useFocusEffect(
            ()=>{
                async function filtrar(){
                    const response = await useQueryProdutos.selectAll();
    
                    if(response.length > 0  ){
                        setDados(response)
                    }
                }
    
               filtrar();
            } 
        )
///////

        function handleSelect(item){
                setpSelecionado(item);
            setVisible(true)
        }

        
        function renderItem({item}){
            return(
                <TouchableOpacity 
                    onPress={ ()=> handleSelect(item) }
                    style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%' }}
                 >
                   <Text style={{ fontWeight:"bold"}}>
                      Codigo: {item.codigo}
                   </Text>

                   <Text>
                     {item.descricao}
                   </Text>
                <View style={{ flexDirection:"row", justifyContent:"space-between", margin:3}}>  
                    <Text style={{ fontWeight:"bold"}}>
                      R$ {item.preco.toFixed(2)}
                    </Text>
                    <Text style={{ fontWeight:"bold"}}>
                       estoque: {item.estoque}
                    </Text>
                </View>
                </TouchableOpacity>
            )
        }
      
     return  (

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
                 <Text style={{   left:5, bottom:5, color:'#FFF' ,fontWeight:"bold" , fontSize:20}}> Produtos </Text>
           </View>
             
                <Modal transparent={true} visible={ visible }>
                    <View style={{ width:'100%',height:'100%', alignItems:"center", justifyContent:"center", backgroundColor: '#FFF'}} >
                        
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
                    navigation.navigate('cadastro_produto')
                }}
            >
                <MaterialIcons name="add-circle" size={45} color="#FFF" />
            </TouchableOpacity>


      </View> )   

      
     
}
 