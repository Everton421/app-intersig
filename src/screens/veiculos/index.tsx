import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useVeiculos, Veiculo } from "../../database/queryVceiculos/queryVeiculos";
import { FontAwesome5 } from "@expo/vector-icons";
import { defaultColors } from "../../styles/global";
import { CustomHeader } from "../../components/custom-header";
import { EmptyState } from "../../components/empty-state";
import { Fab } from "../../components/fab";



 export default function Veiculos({navigation}:any ){
        const [ pesquisa, setPesquisa ] = useState<string | number >('1');
        const [ dados, setDados ] = useState<Veiculo[] | []>([]);
        const useQueryVeiculos = useVeiculos();

    async function busca(){ 
        let result = await useQueryVeiculos.selectByDescription(pesquisa, 25);

        if( result && result.length > 0  ){
            setDados(result);
        }
    }

    ////////
        useEffect(()=>{ 
             busca(); 
        },[ pesquisa ])
/////////////


function renderItem({item}:any) {
    return(
        <TouchableOpacity 
            onPress={ ()=>  navigation.navigate('cadastro_veiculos', { codigo_veiculo: item.codigo}) }
            style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'98%' }}
         >
            <View style={{ flexDirection:"row", gap: 3 , justifyContent:'space-between', margin:2}}>
                <View style={{ flexDirection:"row", gap: 3 , justifyContent:'space-between'}}>
                   
                   <Text style={{ fontWeight:"bold",fontSize:17, marginLeft:10 , color:defaultColors.gray}}>
                    Codigo: {item.codigo}
                   </Text>

                </View>
               <View style={{ flexDirection:"row", gap:2}}>
                 <Text style={{ fontWeight:"bold",fontSize:17, marginLeft:10 , color:defaultColors.gray}}>
                   Placa:  {item.placa}
                </Text>
              </View>
                <View style={{ flexDirection:"row", gap:2}}>
                   <Text style={{ fontWeight:"bold",fontSize:17, marginLeft:10 , color:defaultColors.gray}}>
                      Ano: {item.ano}
                   </Text>
                </View>
             </View>

            <View style={{ flexDirection:"row", gap:2 }}>
              
            </View>

             <View style={{ flexDirection:"row", gap:5, margin:3 }}>
                    <FontAwesome5 name="car-side" size={35} color="#185FED" />
                   <Text style={{ fontWeight:"bold",fontSize: 20, marginLeft:10 , color:defaultColors.gray, flex:1}}>
                     Modelo: {item.modelo}
                   </Text>
            </View>
            
             <View style={{ flexDirection:"row", gap:2 }}>
                   <Text style={{ fontWeight:"bold", fontSize: 17, marginLeft:10 , color:defaultColors.gray, flex:1 } } numberOfLines={3}>
                      Cliente: {item.nome}
                   </Text>
                </View>
        </TouchableOpacity>
    )
}



    return(
        <View style={{ flex:1 ,    backgroundColor:'#EAF4FE', width:"100%"  }}>

                    <CustomHeader
                        title="Veículos"
                        onBack={() => navigation.goBack()}
                        showSearch
                        searchValue={pesquisa}
                        onSearchChange={(v) => setPesquisa(v)}
                        showFilter
                    />
         
        
                <FlatList
                     data={dados}
                     renderItem={(item)=> renderItem(item)}
                     keyExtractor={(i:any)=>  i.codigo}
                     ListEmptyComponent={() => <EmptyState icon="directions-car" message="Nenhum veículo encontrado" />}
                 />
        
        <Fab onPress={() => navigation.navigate('cadastro_veiculos')} />
        </View>
    )
 }