import { createStackNavigator } from "@react-navigation/stack"
import { Login } from "../../screens/login";
import { Api_config } from "../../screens/api_config";


const StackConfig = createStackNavigator();

export const AuthStack=()=>{


    return (

            <StackConfig.Navigator>
                    <StackConfig.Screen name="login" component={Login}  options={ { headerShown:false} } />
                    <StackConfig.Screen name="api_config" component={Api_config}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />

            </StackConfig.Navigator>
    )
}