import { useContext, useEffect } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { OrcamentoContext } from "../../contexts/orcamentoContext"
import { ClienteContext } from "../../contexts/clienteDoOrcamento";
import { Orcamento } from "../orcamento/components";


 export const NovaOs = ({ navigation})=>{
    const {  orcamento , setOrcamento } = useContext(OrcamentoContext); 

    return(
              <Orcamento navigation={navigation} orcamentoEditavel={null} tipo={3} codigo_orcamento={0} />
    )
 }