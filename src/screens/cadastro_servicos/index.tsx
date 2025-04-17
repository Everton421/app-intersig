import { useCallback, useContext, useEffect, useState } from "react"
import { Alert, Button, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import useApi from "../../services/api"
import { useServices } from "../../database/queryServicos/queryServicos"
import { ConnectedContext } from "../../contexts/conectedContext"
import NetInfo from '@react-native-community/netinfo';
import { LodingComponent } from "../../components/loading"

export const Cadastro_servico = ({navigation}:any) => {

    const [ aplicacao , setAplicacao ] = useState();
    const [ valor, setValor ] = useState<number>(0)
    const api = useApi();
    const useQueryServices = useServices();
    const [ loading, setLoading] = useState(false);

    const {connected,  setConnected} = useContext(ConnectedContext)



    useEffect(() => {
        function setConexao(){
           const unsubscribe = NetInfo.addEventListener(state => {
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

            if(!aplicacao) return Alert.alert('','É necessario informar a aplicação para gravar o serviço!');
            if(!valor) return Alert.alert('','É necessario informar o valor para gravar o serviço !');

            

        let data =   { 
                    "valor":valor,
                    "aplicacao":aplicacao,
                }

                try{
                    setLoading(true)

                let response =   await api.post('/servico', data)
                console.log(response.data) 
                if(response.data.codigo > 0 ){

                     try{
                      await useQueryServices.createByCode(response.data, response.data.codigo)
                      Alert.alert(`Serviço ${aplicacao} registrado com sucesso!`)
                      setTimeout(()=>{},1000)
                      navigation.goBack()
                    return Alert.alert('', `Serviço ${data.aplicacao} registrado com Sucesso!`)

                     }catch(e){
                         console.log(" ocorreu um erro ao cadastrar o Serviço ",e)
                     }
                    }
                }catch(e:any){
                    if(e.status === 400 ){
                        return Alert.alert('Erro!', e.response.data.msg);
                    }
                }finally{
            setLoading(false)
                }
                    
        }



    return (
        <View style={{ flex: 1 }}>
 
        <LodingComponent isLoading={loading} />

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
                            <Text > Valor: R$ </Text>
                                <TextInput
                                onChangeText={(value:any)=> setValor( value )}
                                style={{ height:30,backgroundColor:'#FFF', width: '50%'}}
                                keyboardType="numeric"
                                />
                        </View>

                    </View>
                </View>

                <View style={{ margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 5 }}>
                    <TextInput
                                onChangeText={(value:any)=> setAplicacao( value )}
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        placeholder="aplicação:"
                    />
                </View>

                
                <View style={{ flexDirection: "row", marginTop:50 ,width: '100%', alignItems: "center", justifyContent: "center" }} >
                    <TouchableOpacity 
                    style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius:  10, padding: 5 }}
                        onPress={()=>gravar()}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
                    </TouchableOpacity>
                </View> 
               </View>

        </View>
    )
}