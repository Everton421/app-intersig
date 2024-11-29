import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Grupos } from "../../screens/grupos";
import { NavigationContainer } from "@react-navigation/native";

const BottomProduto = createBottomTabNavigator()

export const BottomTabProdutos= ()=>{
    return(
         <BottomProduto.Navigator >   
           <BottomProduto.Screen  name="grupo" component={Grupos} />
         </BottomProduto.Navigator>
    )
}