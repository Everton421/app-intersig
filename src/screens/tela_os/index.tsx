import { useContext, useEffect, useState } from "react"
import {  Text, TouchableOpacity, View,ActivityIndicator, Modal, FlatList, Button } from "react-native"
import { OrcamentoContext } from "../../contexts/orcamentoContext";
import { Orcamento } from "../orcamento/components";
 
import Feather from '@expo/vector-icons/Feather';
import { OrcamentosRegistrados  } from "../orcamento/registrados";

export const Tela_os = ({navigation}:any)=>{

return (
    <View style={{flex:1}}  >
      <OrcamentosRegistrados  tipo={3} navigation={navigation} to={'NovaOs'} />
 
    </View >
)


 
}

 