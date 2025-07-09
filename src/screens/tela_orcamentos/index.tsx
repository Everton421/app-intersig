import { useContext, useEffect, useState } from "react"
import {  Text, TouchableOpacity, View,ActivityIndicator, Modal, FlatList, Button } from "react-native"
import { OrcamentoContext } from "../../contexts/orcamentoContext";
import { Orcamento } from "../orcamento/components";
import useApi from "../../services/api";
import Feather from '@expo/vector-icons/Feather';
import { OrcamentosRegistrados } from "../orcamento/registrados";

export const Vendas = ({navigation, route})=>{

return (
    <View  style={{flex:1}} >
      <OrcamentosRegistrados tipo={1}  navigation={navigation} to={'novoOrcamento'} route={route} />
    </View >
)


 
}

 