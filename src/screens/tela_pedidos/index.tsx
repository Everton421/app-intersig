import {  View   } from "react-native"
import { Lista_pedidos } from "../pedidos"


export const Tela_pedidos = ({navigation, route}:any)=>{

return (
    <View  style={{flex:1}} >
      <Lista_pedidos tipo={1}  navigation={navigation} to={'novoOrcamento'} route={route} />
    </View >
)


 
}

 