import { Pedido_Component } from "../../components/pedido-components/components/main";

 export const Novo_Pedido = ({ navigation}:any)=>{
    return(
              <Pedido_Component navigation={navigation} orcamentoEditavel={null} tipo={1} codigo_orcamento={0}/>
    )
 }