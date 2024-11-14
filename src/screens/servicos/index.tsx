import { Button, FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useServices } from "../../database/queryServicos/queryServicos";
import { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

export function Servicos({navigation}){

    const useQueryServices = useServices();
    
    const [ pesquisa, setPesquisa ] = useState(1);
    const [ dados , setDados ] = useState();
    const [ sSelecionado, setsSelecionado ] = useState();
    const [ visible, setVisible ] = useState(false);

    useEffect(()=>{

        async function filtrar(){
            const response = await useQueryServices.selectByDescription(pesquisa, 10);

            if(response.length > 0  ){
                console.log(response)
                setDados(response)
            }
        }

       filtrar();

    },[ pesquisa ])

    function handleSelect(item){
        setsSelecionado(item);
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
                 {item.aplicacao}
               </Text>
               <Text style={{ fontWeight:"bold"}}>
                 R$ {item.valor}
               </Text>
               
            </TouchableOpacity>
        )
    }


    return(
        <View style={{ flex:1 ,    backgroundColor:'#EAF4FE'}}>
        <View style={{   padding:15, backgroundColor:'#185FED', alignItems:"center", flexDirection:"row", justifyContent:"space-between" }}>
             <TouchableOpacity onPress={  ()=> navigation.goBack()  } style={{ margin:5 }}>
                 <Ionicons name="arrow-back" size={25} color="#FFF" />
             </TouchableOpacity>
         
               
             <View style={{ flexDirection:"row", marginLeft:10 , gap:2, width:'100%', alignItems:"center"}}>
                 < TextInput 
                     style={{  width:'70%', fontWeight:"bold" ,padding:5, margin:5, textAlign:'center', borderRadius:5, elevation:5, backgroundColor:'#FFF'}}
                     onChangeText={(value)=>setPesquisa(value)}
                     placeholder="pesquisar"

                 /> 
                {/** 
                 <TouchableOpacity onPress={ ()=> setShowPesquisa(false) }   >
                     <AntDesign name="closecircle" size={24} color="red" />
                 </TouchableOpacity>
            */ }

                 <TouchableOpacity  //onPress={()=> setShowPesquisa(true)}
                     >
                         <AntDesign name="filter" size={35} color="#FFF" />
                     </TouchableOpacity>
                 </View>
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
                                         <Text style={{ fontWeight:"bold" }} > Codigo: {sSelecionado?.codigo} </Text>
                                     </View>   

                                     <View style={{ backgroundColor:'#fff', borderRadius:5, height:25, elevation:5 }}>
                                       <Text> R$ {sSelecionado?.valor.toFixed(2)} </Text>
                                     </View>   
                                 </View>
  
                                        <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                          <Text>{sSelecionado?.aplicacao}</Text>
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