import { useCallback, useEffect, useState } from "react"
import { Alert, Button, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors"
import { useCategoria } from "../../database/queryCategorias/queryCategorias"
import { useMarcas } from "../../database/queryMarcas/queryMarcas"
import AntDesign from "@expo/vector-icons/AntDesign";
import { RenderModalCategorias } from "./modalCategorias"
import { RenderModalMarcas } from "./modalMarcas"
import useApi from "../../services/api"

export const Cadastro_produto = () => {

    const [ categorias , setCategorias ] = useState([]);
    
    const [ verMarcas, setVerMarcas ] = useState<boolean>(false)
    const [ verCategorias, setVerCategorias ] = useState<boolean>(false)
    const [ marcaSelecionada, setMarcaSelecionada ] = useState(); 
    const [ categoriaSelecionada, setCategoriaSelecionada ] = useState(); 

     
    const [ estoque, setEstoque ] = useState<number>();
    const [ preco, setPreco ] = useState<number>();
    const [ sku, setSku ] = useState<string>();
    const [ grupo, setGrupo ] = useState<number>();
    const [descricao, setDescricao] = useState<string>();
    const [ gtim, setGtim ] = useState<string>();
    const [ referencia, setReferencia ] = useState<string>();

    const useQueryCategoria = useCategoria();
    const useQueryMarcas = useMarcas();
    const api = useApi();


    async function gravar (){
        if(!preco) setPreco(0);
        if(!estoque) setEstoque(0);
        if(!sku) setSku('');
        if(!referencia) setReferencia('');
        if(!marcaSelecionada) return Alert.alert('É necessario informar uma marca para gravar o produto!');
        if(!categoriaSelecionada) return Alert.alert('É necessario informar uma categoria para gravar o produto!');


    let data =   { 
                "preco":preco,
                "estoque":estoque,
                "descricao":descricao,
                "sku":sku,
                "referencia":referencia,
                "marca":marcaSelecionada.codigo,
                "grupo":categoriaSelecionada.codigo
            }

            let response =   await api.post('/produtos', data)
            console.log(response.data)
    }

    return (
        <View style={{ flex: 1 }}>
 
          <View style={{ flex: 1 ,width: '100%',  backgroundColor: '#EAF4FE' }} >
                <View style={{ margin: 10, gap: 15, flexDirection: "row" }}>
                    <Image
                        style={{ width: 100, height: 100 }}
                        source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png'
                        }}
                    />
                    <View style={{width:'100%', gap:10}}>
                    <View style={{ alignItems:"center", flexDirection:"row", width: '50%',backgroundColor: '#fff' ,borderRadius: 5,  elevation: 5}}>
                            <Text > Preço: R$ </Text>
                                <TextInput
                                onChangeText={(value)=> setPreco( value )}
                                style={{ height:30,backgroundColor:'#FFF', width: '50%'}}
                                />
                        </View>

                        <View style={{ alignItems:"center", flexDirection:"row", width: '50%',backgroundColor: '#fff' ,borderRadius: 5,  elevation: 5}}>
                            <Text > Estoque: </Text>
                                <TextInput
                                onChangeText={(value)=> setEstoque( value )}
                                style={{ height:30,backgroundColor:'#FFF', width: '50%'}}
                                />
                        </View>

                    </View>
                </View>

                <View style={{ margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 5 }}>
                    <TextInput
                                onChangeText={(value)=> setDescricao( value )}
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        placeholder="descrição"
                    />
                </View>
               
                <View style={{ margin: 7, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 25, elevation: 5 }}>
                    <Text > SKU: </Text>
                        <TextInput
                                onChangeText={(value)=> setSku( value )}
                            />
                    </View>
                <View style={{ margin: 7, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 25, elevation: 5 }}>
                    <Text > Cod.Barras: </Text>
                        <TextInput
                                onChangeText={(value)=> setGtim( value )}
                        />
                </View>
                <View style={{ margin: 7, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 25, elevation: 5 }}>
                    <Text > Referencia: </Text>
                            <TextInput
                                onChangeText={(value)=> setReferencia( value )}
                            />
                </View>

                <Text style={{marginLeft:5}} > { marcaSelecionada && 'Marca:'}</Text> 

                 <View style={{ flexDirection:"row" }}>
                    <RenderModalMarcas setMarca={ setMarcaSelecionada} />
                 </View>  

                <Text style={{marginLeft:5}} > { categoriaSelecionada && 'Categoria:'}</Text> 

                 <View style={{ flexDirection:"row" }}>
                    <RenderModalCategorias   setCategoria={setCategoriaSelecionada} />
                 </View> 
              
    
                <View style={{ flexDirection: "row", marginTop:50 ,width: '100%', alignItems: "center", justifyContent: "center" }} >
                    <TouchableOpacity 
                    style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius:  5, padding: 5 }}
                        onPress={()=>gravar()}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
                    </TouchableOpacity>
                </View> 
         </View>
 
 
        </View>
    )
}