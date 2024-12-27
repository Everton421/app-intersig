import { useCallback, useEffect, useState } from "react"
import { Button, FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors"
import { useCategoria } from "../../database/queryCategorias/queryCategorias"
import { useMarcas } from "../../database/queryMarcas/queryMarcas"
import AntDesign from "@expo/vector-icons/AntDesign";

export const Cadastro_produto = () => {

    const [ marcas , setMarcas ] = useState([]);
    const [ categorias , setCategorias ] = useState([]);
    
    const [ verMarcas, setVerMarcas ] = useState<boolean>(false)
    const [ verCategorias, setVerCategorias ] = useState<boolean>(false)


    const useQueryCategoria = useCategoria();
    const useQueryMarcas = useMarcas();

    
    useEffect(
        ()=>{

            async function buscaMarcas(){
                let dados:any = await useQueryMarcas.selectAll();
                if(dados?.length > 0 ){
                    setMarcas(dados);
                }
           // console.log(dados);
            }   
            buscaMarcas();
        },[]
    )
           
                async function buscaCategorias(){
                    let dados:any = await useQueryCategoria.selectAll();
                    if(dados?.length > 0 ){
                        setCategorias(dados);
                    }
                    //console.log(dados);
                }   

                function renderMarcas({item}){
                    return(
                        <View>
                            <Text>
                                {item.descricao}
                            </Text>
                        </View>
                    )
                }


    return (
        <View style={{ flex: 1 }}>
 
 { /**<TouchableOpacity 
                      //  onPress={ ()=> handleSelect(item) }
                      style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%' }}
                      >
                      <Text>marcas</Text>
                   <AntDesign name="caretdown" size={241111111111111} color={"black"} />
                </TouchableOpacity>
   */}
          <View style={{ width: '100%', height: '100%', backgroundColor: '#EAF4FE' }} >
                <View style={{ margin: 10, gap: 15, flexDirection: "row" }}>
                    <Image
                        style={{ width: 100, height: 100 }}
                        source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png'
                        }}
                    />
                    <View style={{ backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", width: '50%', flexDirection: "row", borderRadius: 5, height: 25, elevation: 5 }}>
                        <Text > Preço R$:  </Text>
                        <TextInput
                            placeholder="10,00"
                        />
                    </View>
                </View>

                <View style={{ margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 5 }}>
                    <TextInput
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        placeholder="descrição"
                    />
                </View>
                <View style={{ margin: 7, padding: 3, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 25, elevation: 5 }}>
                    <Text > Estoque: </Text>
                    <TextInput
                    />
                </View>
                <View style={{ margin: 7, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 25, elevation: 5 }}>
                    <Text > SKU: </Text>
                    <TextInput
                    />
                </View>
                <View style={{ margin: 7, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 25, elevation: 5 }}>
                    <Text > GTIN: </Text>
                    <TextInput
                    />
                </View>
                <View style={{ margin: 7, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 25, elevation: 5 }}>
                    <Text > Referencia: </Text>
                    <TextInput
                    />
                </View>

                <View style={{ flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 10 }} >
                    <TouchableOpacity style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius: 15, padding: 5 }}>
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
                    </TouchableOpacity>
                </View> 
               
              
                </View>
 
    
{   /*
    <FlatList
        data={marcas}
        renderItem={(item)=> renderMarcas(item) }
          keyExtractor={(i:any)=> i.codigo}
    />*/
 
} 
 
        </View>
    )
}