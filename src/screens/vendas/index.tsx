import { useContext, useEffect, useState } from "react"
import {  Text, TouchableOpacity, View,ActivityIndicator, Modal, FlatList, Button } from "react-native"
import { OrcamentoContext } from "../../contexts/orcamentoContext";
import { Orcamento } from "../orcamento/components";
import { api } from "../../services/api";
import Feather from '@expo/vector-icons/Feather';
import { Registrados } from "../orcamento/registrados";

export const Vendas = ({navigation})=>{

return (
    <View >
      <Registrados navigation={navigation} />
        
     <TouchableOpacity onPress={()=> navigation.navigate('novoOrcamento')} 
      style={{borderColor:'#009de2',borderWidth:3, backgroundColor:'#fff', padding:7 ,borderRadius:50, width:'16%', alignItems:'center', position:"absolute" , marginLeft:"80%",marginTop:'99%', elevation:10}}>
        <Text style={{fontSize:25, fontWeight:"bold", color:'#009de2'}}>
            +
        </Text>
     </TouchableOpacity>

 
    </View >
)


 
}

 