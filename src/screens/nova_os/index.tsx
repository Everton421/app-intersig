import { Pedido_Component } from "../../components/pedido-components/components/main";

 export const NovaOs = ({ navigation}:any)=>{

    return(
              <Pedido_Component navigation={navigation} orcamentoEditavel={null} tipo={3} codigo_orcamento={0} />
    )
 }