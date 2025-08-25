import { useContext, useEffect, useState } from "react"
import { OrcamentoContext } from "../../contexts/orcamentoContext"
import { Pedido_Component } from "../../components/pedido-components/components/main";


 export const EditarOrcamento = ({ navigation, route }:any)=>{


    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);
        
        const { codigo_orcamento, tipo } = route.params

        return(
    
            < Pedido_Component
             navigation={navigation}
              orcamentoEditavel={orcamento} tipo={tipo}
                codigo_orcamento={codigo_orcamento}
                 />
        
      
    )
 }