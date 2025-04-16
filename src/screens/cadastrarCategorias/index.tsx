import { Alert, Button, Image, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
 
import useApi from "../../services/api"
import { useContext, useEffect, useState } from "react"
import { useCategoria } from "../../database/queryCategorias/queryCategorias"
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { ConnectedContext } from "../../contexts/conectedContext"
import { LodingComponent } from "../../components/loading"

export const Cadastro_Categorias = ({navigation}:any) => {

    const [ input , setInput ] = useState('');
    const [ categoriaApi, setCategoriaApi ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState(false); 

    const api = useApi();
    const useQueryCategoria = useCategoria();
    const {connected,  setConnected} = useContext(ConnectedContext)


    useEffect(() => {
        function setConexao(){
           const unsubscribe = NetInfo.addEventListener((state:NetInfoState)=> {
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


                try{
                    setLoading(true)
                    let resposta = await api.post('/categoria', { "descricao": input});
                        
                        if(resposta.status === 200 && resposta.data.codigo > 0 ){
                            let valid:any = await useQueryCategoria.selectByCode(resposta.data.codigo);
                                if(valid?.length > 0 ){
                                    console.log(valid) 
                                }else{
                                    await useQueryCategoria.create(resposta.data)
                                }
                            setInput('')
                            navigation.goBack()
                            return Alert.alert('',`Categoria ${input} registrada com sucesso! `)
                        }
                    }catch(e:any){
                        if( e.status === 400 ){
                            return Alert.alert( 'Erro!',`${e.response.data.msg}`)
                        }
                    }finally{
                    setLoading(false)
                    }

//                if( resposta.data.erro === true ){
//                    setInput('')
//                    return Alert.alert(`${resposta.data.msg}`) 
//                }

        } 
 

    return (
        <View style={{ flex: 1 }}>
            <LodingComponent isLoading={loading} />

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
                        onChangeText={(v:any)=> setInput(v)}
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