import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Orcamento } from '../../screens/orcamento/components';
import { Registrados } from '../../screens/orcamento/registrados';
const Tab = createBottomTabNavigator();


export function  TabsOrcamento({navigation}) {
    return (
      <Tab.Navigator>
        

        <Tab.Screen
         name="registrados"
         options={{ headerShown:false   }}
         component={Registrados}
          />
        <Tab.Screen
         name="novo"
         options={{ headerShown:false   }}
         component={Orcamento}
          />

      </Tab.Navigator>
    );
  }