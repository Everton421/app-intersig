import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Categoria  } from "../../screens/categorias";
import { NavigationContainer } from "@react-navigation/native";
import { Produtos } from "../../screens/Produtos";
import { ViewTabProdutos } from "../../screens/tabProdutos";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Marcas } from "../../screens/marcas";
const BottomProduto = createBottomTabNavigator()

export const BottomTabProdutos= ()=>{
    return(
         <BottomProduto.Navigator >   
            <BottomProduto.Screen 
             name="Produtos" component={Produtos} 
               options={{
                tabBarStyle:{ backgroundColor:'#185FED'   },
                
                tabBarLabelStyle:{ color:"#FFF", fontSize:13},
                tabBarIcon:()=> <FontAwesome name="home" size={24} color="#FFF" />,
                headerShown:false,

              }}
              
            />
            <BottomProduto.Screen 
             name="categorias"
              component={Categoria}
              options={{
                tabBarStyle:{ backgroundColor:'#185FED'    },
                tabBarLabelStyle:{ color:"#FFF", fontSize:13},
                tabBarIcon:()=> <MaterialIcons name="category" size={24} color="#FFF" /> ,
                headerShown:false,

              }} />

      <BottomProduto.Screen 
             name="marcas"
              component={Marcas}
              options={{
                tabBarStyle:{ backgroundColor:'#185FED'    },
                tabBarLabelStyle:{ color:"#FFF", fontSize:13},
                tabBarIcon:()=> <FontAwesome name="bookmark" size={24} color="#FFF" /> ,
                headerShown:false,

              }} />

              {/* <FontAwesome name="bookmark" size={24} color="black" />*/}
           
         </BottomProduto.Navigator>
    )
}