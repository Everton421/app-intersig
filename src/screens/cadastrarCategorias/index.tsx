import { Alert, Button, Image, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors"
 
import useApi from "../../services/api"
import { useSQLiteContext } from "expo-sqlite"
import { useState } from "react"
import { useCategoria } from "../../database/queryCategorias/queryCategorias"

export const Cadastro_Categorias = ({navigation}:any) => {

    const [ input , setInput ] = useState('');
    const [ categoriaApi, setCategoriaApi ] = useState<boolean>(false);
     
    const api = useApi();
    const useQueryCategoria = useCategoria();

        async function gravar (){
            if(!input || input === "") return Alert.alert("é necessario informar a descricao!") 
            let resposta = await api.post('/offline/categorias', { "descricao": input});
                 
                if(resposta.data.codigo > 0 ){

                    let valid:any = await useQueryCategoria.selectByCode(resposta.data.codigo);
                        if(valid?.length > 0 ){
                            console.log(valid) 
                        }else{
                            await useQueryCategoria.create(resposta.data)
                        }
                    setInput('')
                    navigation.goBack()
                    return Alert.alert(`Categoria ${input} registrada com sucesso! `)
                }
                if( resposta.data.erro === true ){
                    setInput('')
                    return Alert.alert(`${resposta.data.msg}`) 
                }

        } 
        async function validaCategoria(value:string){

            if(value === '' || !value) { setCategoriaApi(false); return };
            setInput(value)
            setCategoriaApi(false);
            let result = await api.get(`/offline/categorias/${value}`)
               if( result.data.length > 0 ){
                 setCategoriaApi(true);
               }
             
        }


    return (
        <View style={{ flex: 1 }}>

            <View style={{ width: '100%', height: '100%', backgroundColor: '#EAF4FE' }} >


                <View style={{ margin: 10, gap: 15, flexDirection: "row" }}>
                    <Image
                        style={{ width: 70, height: 70 }}
                        source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png'
                        }}
                    />

                </View>
                <Text style={{ fontWeight:"bold", fontSize:20, color:'#185FED'}} > categoria </Text>

                <View style={{ margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 5 }}>
                    <TextInput
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        placeholder="descrição"
                        onChangeText={(v:any)=> validaCategoria(v)}
                        //value={input}
                    />
              
                </View>
                   <View style={{ alignItems:"center"}}>  
                     {   categoriaApi && 
                            <Text style={{ color:'red' }}>
                                Já existe uma categoria cadastrada com esta descricao! 
                            </Text>
                      }
                   </View>   

                <View style={{ flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 10 }} >
                    <TouchableOpacity 
                    style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius: 15, padding: 5 }}
                        onPress={ ()=> gravar()}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </View>
    )
}