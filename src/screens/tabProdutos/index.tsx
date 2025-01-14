import { View , Text, TextInput, FlatList, Modal, Button, Image} from "react-native";
import { useProducts } from "../../database/queryProdutos/queryProdutos";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomTabProdutos } from "../../routes/bottomTabsProduto";


export function ViewTabProdutos ( ){
  const useQueryProdutos = useProducts();
const [ pesquisa, setPesquisa ] = useState(1);
const [ dados , setDados ] = useState();
const [ pSelecionado, setpSelecionado ] = useState();
const [ visible, setVisible ] = useState(false);


useEffect(()=>{

            async function filtrar(){
                const response = await useQueryProdutos.selectByDescription(pesquisa, 10);

                if(response.length > 0  ){
                    setDados(response)
                }
            }

           filtrar();

        },[ pesquisa ])

     

      
      return(
      <View style={{ flex:1}}>
        <BottomTabProdutos/>
      </View>
      )
     
}