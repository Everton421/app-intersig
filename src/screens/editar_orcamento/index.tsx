import { useContext, useEffect, useState } from "react"
import { Text, TouchableOpacity, View,ActivityIndicator } from "react-native"
import { OrcamentoContext } from "../../contexts/orcamentoContext"
import { ClienteContext } from "../../contexts/clienteDoOrcamento";
import { Orcamento } from "../orcamento/components";
import { useRoute } from "@react-navigation/native";


 export const EditarOrcamento = ({ navigation, route }:any)=>{
   const [ loading  , setLoading  ] = useState<boolean>(true);


    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);
        
        const { codigo_orcamento, tipo } = route.params

        return(
    
            < Orcamento
             navigation={navigation}
              orcamentoEditavel={orcamento} tipo={tipo}
                codigo_orcamento={codigo_orcamento}
                 />
        
      
    )
 }