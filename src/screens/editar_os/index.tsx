import { useContext, useEffect, useState } from "react"
import { OrcamentoContext } from "../../contexts/orcamentoContext"
import { Pedido_Component } from "../../components/pedido-components/components/main";


 export const EditarOS = ({ navigation, route }:any)=>{
   const [ loading  , setLoading  ] = useState<boolean>(true);


    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);
   const codigo_orcamento = route.params;

    return(
            <Pedido_Component navigation={navigation} orcamentoEditavel={orcamento} tipo={3}  codigo_orcamento={codigo_orcamento} />
    )
 }