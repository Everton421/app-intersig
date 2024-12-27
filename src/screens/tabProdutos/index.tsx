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

        function handleSelect(item){
                setpSelecionado(item);
            setVisible(true)
        }

        
        function renderItem({item}){
            return(
                <TouchableOpacity 
                    onPress={ ()=> handleSelect(item) }
                    style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%' }}
                 >
                   <Text style={{ fontWeight:"bold"}}>
                      Codigo: {item.codigo}
                   </Text>

                   <Text>
                     {item.descricao}
                   </Text>
                <View style={{ flexDirection:"row", justifyContent:"space-between", margin:3}}>  
                    <Text style={{ fontWeight:"bold"}}>
                      R$ {item.preco.toFixed(2)}
                    </Text>
                    <Text style={{ fontWeight:"bold"}}>
                       estoque: {item.estoque}
                    </Text>
                </View>
                </TouchableOpacity>
            )
        }

      
      return <BottomTabProdutos/>
      
      
   
     
}