import { useContext, useEffect, useState } from "react"
import { Text, TouchableOpacity, View,ActivityIndicator } from "react-native"
import { OrcamentoContext } from "../../contexts/orcamentoContext"
import { ClienteContext } from "../../contexts/clienteDoOrcamento";
import { Orcamento } from "../orcamento/components";


 export const EditarOrcamento = ({ navigation}:any)=>{
   const [ loading  , setLoading  ] = useState<boolean>(true);


    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);
   

    return(
    
          
            <Orcamento navigation={navigation} orcamentoEditavel={orcamento}/>
        
      
    )
 }