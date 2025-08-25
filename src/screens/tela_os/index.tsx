import {  View  } from "react-native"
import { Lista_pedidos } from "../pedidos"
 

export const Tela_os = ({navigation,route }:any)=>{

return (
    <View style={{flex:1}}  >
      <Lista_pedidos  tipo={3} navigation={navigation} to={'NovaOs'}  route={route} />
    </View >
)
 
}

 