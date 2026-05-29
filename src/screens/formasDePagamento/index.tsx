import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


import { useEffect, useState } from "react";
import { fpgt, useFormasDePagamentos } from "../../database/queryFormasPagamento/queryFormasPagamento";
import { RenderItemsFormaPagamento } from "./renderItensFormaPagamento/RenderItensFormaPagamento";
import { CustomHeader } from "../../components/custom-header";
import { EmptyState } from "../../components/empty-state";
import { Fab } from "../../components/fab";

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
                    } ,[pesquisa] )
 
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
                },[ pesquisa ] )
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
            
            
            <CustomHeader
                title="Formas de Pagamento"
                onBack={() => navigation.goBack()}
                showSearch
                searchValue={pesquisa}
                onSearchChange={(v) => setPesquisa(v)}
                showFilter
            />
          

{/**  */}
           <View style={{ marginTop:10}}> 
                 <FlatList
                 data={ dados }
                 renderItem = {( {item} )=> <RenderItemsFormaPagamento handleSelect={handleSelect} item={item} /> } 
                 keyExtractor={(i:any)=> i.codigo}
                 ListEmptyComponent={() => <EmptyState icon="payment" message="Nenhuma forma de pagamento encontrada" />}
                 />
            </View>
        {/**  */}
            <Fab onPress={() => navigation.navigate('cadastro_formaPagamento')} />

        </View>
    )
}