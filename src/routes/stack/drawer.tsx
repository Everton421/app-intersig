import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { Configurações } from '../../screens/configurações';
import { Home } from '../../screens/home';
import { Background } from 'victory-native';

const Drawer = createDrawerNavigator();

export function MyDrawer() {
  return (
    <Drawer.Navigator>
       
        <Drawer.Screen  name='terste' component={Home}  options={ {  headerShown:false  , headerStyle:{  backgroundColor: "#185FED" }   }}    />
     
    </Drawer.Navigator>
  );
}