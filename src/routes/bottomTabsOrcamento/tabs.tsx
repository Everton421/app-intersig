import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Orcamento } from '../../screens/orcamento/components';
import { OrcamentosRegistrados    } from '../../screens/orcamento/registrados';
const Tab = createBottomTabNavigator();


export function  TabsOrcamento({navigation}) {
    return (
      <Tab.Navigator>
        

        <Tab.Screen
         name="registrados"
         options={{ headerShown:false   }}
         component={OrcamentosRegistrados}
          />
        <Tab.Screen
         name="novo"
         options={{ headerShown:false   }}
         component={Orcamento}
          />

      </Tab.Navigator>
    );
  }