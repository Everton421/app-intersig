import { TextInput,Text, Button, TouchableOpacity, View, Image } from "react-native";
 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from "react";
import { useCategoria } from "../../database/queryCategorias/queryCategorias";
import { useMarcas } from "../../database/queryMarcas/queryMarcas";
 

export const Teste = ({navigation})=>{

const usecategoria = useCategoria()
const usemarca = useMarcas()


    useEffect(
        ()=>{
            async function busca(){
                let a = await usemarca.selectAll();
                console.log("dados", a)
          
            }
            busca()
        },[]
    )

    return (
        <View style={{ flex: 1, backgroundColor: "#EAF4FE"  }}>
                      
                        <TouchableOpacity onPress={()=> navigation.goBack()} style={{   margin:10}}>
                            <Ionicons name="arrow-back" size={30} color="#185FED" />
                        </TouchableOpacity>

            <View style={{ width:'100%', alignItems:"center"  }}> 
                   
         
           </View>
  
     
      </View>
    )
}