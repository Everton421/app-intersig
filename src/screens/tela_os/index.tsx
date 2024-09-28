import { useContext, useEffect, useState } from "react"
import {  Text, TouchableOpacity, View,ActivityIndicator, Modal, FlatList, Button } from "react-native"
import { OrcamentoContext } from "../../contexts/orcamentoContext";
import { Orcamento } from "../orcamento/components";
import { api } from "../../services/api";
import Feather from '@expo/vector-icons/Feather';
import { OrcamentosRegistrados  } from "../orcamento/registrados";

export const Tela_os = ({navigation})=>{

return (
    <View style={{flex:1}}  >
      <OrcamentosRegistrados  tipo={3} navigation={navigation} />
        
     <TouchableOpacity
      onPress={()=> navigation.navigate('NovaOs') } 
      style={{
        borderColor:'#009de2', borderWidth:3,
         backgroundColor:'#fff' ,
           width:50, height:50,
           borderRadius:25,
            position:"absolute" , marginLeft:"80%",marginTop:'99%', elevation:10  , alignItems:"center", justifyContent:"center" }}>
        <Text style={{fontSize:25, fontWeight:"bold", color:'#009de2'}}>
            +
        </Text>
     </TouchableOpacity>

 
    </View >
)


 
}

 