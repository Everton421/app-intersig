import { Alert, Text, TouchableOpacity, View, TextInput, ScrollView } from "react-native"
import useApi from "../../services/api"
import { useContext, useEffect, useState } from "react"
import { useCategoria } from "../../database/queryCategorias/queryCategorias"
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { ConnectedContext } from "../../contexts/conectedContext"
import { LodingComponent } from "../../components/loading"
import { CustomHeader } from "../../components/custom-header"

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
        <View style={{ flex: 1, backgroundColor: '#F0F4F8' }}>
          <LodingComponent isLoading={loading} />
          <CustomHeader
            title="Nova Categoria"
            showSearch={false}
            onBack={() => navigation.goBack()}
          />
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
              <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Descrição da Categoria</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                placeholder="Ex: Filtros"
                placeholderTextColor="#999"
                onChangeText={(v) => setInput(v)}
              />
              {categoriaApi && (
                <Text style={{ color: '#E53935', marginTop: 8, fontWeight: '500' }}>
                  Já existe uma categoria cadastrada com esta descrição!
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#185FED', borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 24, elevation: 4, shadowColor: '#185FED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 }}
              onPress={() => gravar()}
            >
              <Text style={{ fontWeight: 'bold', color: '#FFF', fontSize: 18 }}>Gravar Categoria</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
    )
}