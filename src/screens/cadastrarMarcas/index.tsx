import { useContext, useEffect, useState } from "react";
import { Alert, Button, Image, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors"
import useApi from "../../services/api";
import { useCategoria } from "../../database/queryCategorias/queryCategorias";
import { useMarcas } from "../../database/queryMarcas/queryMarcas";
import NetInfo from '@react-native-community/netinfo';
import { ConnectedContext } from "../../contexts/conectedContext"

export const Cadastro_Marcas = ( {navigation}:any ) => {


    const [ input , setInput ] = useState('');
    const [ marcaApi, setMarcaApi ] = useState<boolean>(false);
     
    const api = useApi();
    const useQueryMarcas = useMarcas();
    const {connected,  setConnected} = useContext(ConnectedContext)

     
    useEffect(() => {
        function setConexao(){
           const unsubscribe = NetInfo.addEventListener((state) => {
                   setConnected(state.isConnected);
                   console.log('conexao com a internet :', state.isConnected);
              });
           // Remove o listener quando o componente for desmontado
           return () => {
               unsubscribe();
           };
       }
       setConexao();
       }, []);

    
    async function gravar (){
        if( connected === false ) return Alert.alert('Erro', 'É necessario estabelecer conexão com a internet para efetuar o cadastro !');

            if(!input || input === "") return Alert.alert("é necessario informar a descricao!") 
            let resposta = await api.post('/offline/marcas', { "descricao": input});
                 
                if(resposta.data.codigo > 0 ){

                    let valid:any = await useQueryMarcas.selectByCode(resposta.data.codigo);
                        if(valid?.length > 0 ){
                            console.log(valid) 
                        }else{
                            await useQueryMarcas.create(resposta.data)
                        }
                    setInput('')
                    navigation.goBack()
                    return Alert.alert(`Marca ${input} registrada com sucesso! `)
                }
                if( resposta.data.erro === true ){
                    setInput('')
                    return Alert.alert(`${resposta.data.msg}`) 
                }

        } 
        async function validaMarca(value:string){

            if(value === '' || !value) { setMarcaApi(false); return };
            setInput(value)
            setMarcaApi(false);
            let result = await api.get(`/offline/marcas/${value}`)
               if( result.data.length > 0 ){
                setMarcaApi(true);
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

                        <Text style={{ fontWeight:"bold", fontSize:20, color:'#185FED'}} > marca </Text>

                <View style={{ margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 5 }}>
                    <TextInput
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        placeholder="descrição"
                        onChangeText={(v:any)=> validaMarca(v)}

                    />
                </View>
                <View style={{ alignItems:"center"}}>  
                     {   marcaApi && 
                            <Text style={{ color:'red' }}>
                                Já existe uma marca cadastrada com esta descricao! 
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