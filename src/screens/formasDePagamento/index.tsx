import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


import { useEffect, useState } from "react";
import { fpgt, useFormasDePagamentos } from "../../database/queryFormasPagamento/queryFormasPagamento";

type IFptg={
    item:fpgt
}

export const FormasPagamento = ({navigation}:any)=>{

        const [ pesquisa, setPesquisa ] = useState('');
        const [ dados, setDados ] = useState([]);

        const useQueryFormasDePagamento = useFormasDePagamentos();


//////////////////////
        useEffect(
                    ()=>{
                        async function busca(){ 
                                let data:any  = await useQueryFormasDePagamento.selectAll();
                                if( data?.length > 0  ){
                                    setDados(data) 
                                }   
                            }
                        if( pesquisa === '' || pesquisa === undefined){
                            busca();
                        }
                    } ,[pesquisa]
                )
 
            useEffect(
                ()=>{   
                    async function busca(){
                        let data:any  = await useQueryFormasDePagamento.selectByDescription(pesquisa);
                        if( data?.length > 0  ){
                            setDados(data) 
                        }  
                    }
                    if( pesquisa !== '' || pesquisa !== undefined){
                    busca();
                }
                },[ pesquisa ]
            )
//////////////////////


            function handleSelect(item:fpgt){
                navigation.navigate('cadastro_formaPagamento', { codigo_formaPagamento: item.codigo})
            }

function renderItem({item}:IFptg){
            return(
                <TouchableOpacity 
                onPress={ ()=> handleSelect(item) }
                    style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%' }}
                 >

                    <View style={{ flexDirection:"row", justifyContent:"space-between", margin:5}} >
                    <Text style={{ fontWeight:"bold"}}>
                        Codigo: {item.codigo}
                    </Text>
                    <Text style={{ fontWeight:"bold"}}>
                        {item.parcelas} parcelas
                     </Text>
                   </View>

                   <Text style={{ marginLeft:4}}>
                      {item.descricao}
                     </Text>
                
                     <Text style={{ marginLeft:4}}>
                        intervalo entre parcelas {item.intervalo} dias 
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
        
                             <TouchableOpacity  //onPress={()=> setShowPesquisa(true)}
                             >
                                 <AntDesign name="filter" size={35} color="#FFF" />
                             </TouchableOpacity>
                             
                       </View>

                 </View>
          

{/**  */}
           <View style={{ marginTop:10}}> 
                <FlatList
                data={ dados }
                renderItem = {(i)=>  renderItem(i)  }
                keyExtractor={(i:any)=> i.codigo}
                />
            </View>
        {/**  */}
            <TouchableOpacity
                style={{ backgroundColor: '#185FED',  width: 50, height: 50, borderRadius: 25,  position: "absolute", bottom: 150,   right: 30,  elevation: 10,  alignItems: "center", justifyContent: "center", zIndex: 999,             // Garante que o botão fique sobre os outros itens
                }}
                onPress={() => {
                   navigation.navigate('cadastro_formaPagamento')
                }}
            >
                <MaterialIcons name="add-circle" size={45} color="#FFF" />
            </TouchableOpacity>

        </View>
    )
}