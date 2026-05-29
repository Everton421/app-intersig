import { Alert, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import useApi from "../../services/api";
import { useContext, useEffect, useState } from "react";
import { useVeiculos, Veiculo } from "../../database/queryVceiculos/queryVeiculos";
import { ConnectedContext } from "../../contexts/conectedContext";
import NetInfo from '@react-native-community/netinfo';
import { SelectCliente } from "../../components/selectCliente";
import { LodingComponent } from "../../components/loading";
import { defaultColors } from "../../styles/global";
import { CustomHeader } from "../../components/custom-header"

 

export default function Cadastro_veiculo({ route, navigation}:any){
    
    const api = useApi();
    const useQueryVeiculos = useVeiculos();
    const {connected,  setConnected} = useContext(ConnectedContext)

    const [ loading, setLoading] = useState(false);
    const [ placa, setPlaca ] = useState<string>('');
    const [ modelo, setModelo ] = useState<string>('');
    const [ combustivel, setCombustivel ] = useState<string>('');
    const [ cor, setCor ] = useState<string>('');
    const [ ano, setAno ] = useState<string>('');
    const [ marca, setMarca ] = useState<string>('')
      const [ codigoCliente, setCodigoCliente] = useState<number | null>(null);
      const [ dados, setDados ] = useState <Veiculo>();
 

    let {  codigo_veiculo  }  =   route.params || { codigo_veiculo : 0};

////////////////////////////
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
////////////////////////////


       useEffect(()=>{

            async function buscaDados(){

                try{
                if(codigo_veiculo){
                        setLoading(true)

                        let result  = await useQueryVeiculos.selectByCode(codigo_veiculo);
                        if( result && result?.length > 0 ){
                            setDados(result[0])
                            setPlaca(result[0].placa)
                            setModelo(result[0].modelo)
                            setCombustivel(result[0].combustivel)
                            setCodigoCliente(result[0].cliente)
                            setAno(result[0].ano)
                            setCor(result[0].cor)
                            setMarca(result[0].marca)
                        }
                    } 
                }catch(e){
                    console.log("Erro ao tentar carregar o veiculo!", e)
                          return Alert.alert('Erro!',"Erro ao tentar carregar o veiculo!" )
                }finally{
                        setLoading(false)
                            
              }
            }
            buscaDados();
       },[])


       function selecionarCliente(codigo:number){
        setCodigoCliente( codigo)
        setDados((prev:any)=>({...prev, cliente:codigo}))
       }

       async function gravar(){
            if( connected === false ) return Alert.alert('Erro', 'É necessario estabelecer conexão com a internet para concluir o cadastro !');
                if(!placa ) return Alert.alert('Erro!','É necessario informar a placa do veículo!');
                if(!codigoCliente) return Alert.alert('Erro!','É necessario informar o cliente do veículo!');
        
        let postData:any =
        {
            codigo:  codigo_veiculo   ,    
            placa:placa,
            modelo:modelo,
            combustivel:combustivel,
            cor:cor,
            marca:marca,
            ano:ano,
            cliente:codigoCliente
        }
        if(codigo_veiculo && dados){
                  try{
                    setLoading(true)

                          let result = await api.put('/veiculo', postData);
                            if(result.status === 200 ){
                                await useQueryVeiculos.update(postData)
                            navigation.goBack();
                            return Alert.alert('', "Veiculo alterado com sucesso!")
                            }
                    }catch(e:any){
                        if(e.status === 400 ){
                          return Alert.alert('Erro ao Atualizar Veiculo!', e.response.data.msg)
                        }
                        console.log(`Erro ao atualizar o veiculo ${codigo_veiculo}`, e)
                    }finally{
                    setLoading(false)
                    }
       }else{
            try{
                setLoading(true)
                     let result = await api.post('/veiculo', postData);

                     if(result.status === 200 ){
                        await useQueryVeiculos.create(result.data)
                                navigation.goBack();
                        return Alert.alert('', "Veiculo Registrado com sucesso!")
                    }
            }catch(e:any){
                if(e.status === 400 ){
                  return Alert.alert('Erro ao Cadastrar Veiculo!', e.response.data.msg)
                }
                console.log(`Erro ao Cadastrar o veiculo ${codigo_veiculo}`, e)
            }finally{
                    setLoading(false)
            }
        }  
    
    }

    return(
        <View style={{ flex: 1, backgroundColor: '#F0F4F8' }}>
          <LodingComponent isLoading={loading} />
          <CustomHeader
            title={codigo_veiculo ? `Veículo #${codigo_veiculo}` : 'Novo Veículo'}
            showSearch={false}
            onBack={() => navigation.goBack()}
          />
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Placa</Text>
                <TextInput
                  onChangeText={(value) => setPlaca(value)}
                  defaultValue={placa}
                  style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                  placeholder="ABC-1234"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Marca</Text>
                <TextInput
                  onChangeText={(value) => setMarca(value)}
                  defaultValue={marca}
                  style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                  placeholder="Ex: Volkswagen"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Modelo</Text>
                <TextInput
                  onChangeText={(value) => setModelo(value)}
                  defaultValue={modelo}
                  style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                  placeholder="Ex: Gol"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Combustível</Text>
                <TextInput
                  onChangeText={(value) => setCombustivel(value)}
                  defaultValue={combustivel}
                  style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                  placeholder="Gasolina"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Cor</Text>
                  <TextInput
                    onChangeText={(value) => setCor(value)}
                    defaultValue={cor}
                    style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                    placeholder="Branco"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Ano</Text>
                  <TextInput
                    onChangeText={(value) => setAno(value)}
                    defaultValue={ano}
                    style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                    placeholder="2024"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <SelectCliente codigoCliente={codigoCliente} setCodigoCliente={selecionarCliente} />
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#185FED', borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 24, elevation: 4, shadowColor: '#185FED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 }}
              onPress={() => gravar()}
            >
              <Text style={{ fontWeight: 'bold', color: '#FFF', fontSize: 18 }}>Gravar Veículo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
    )

}