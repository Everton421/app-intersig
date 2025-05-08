import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useApi from "../../services/api";
import { useContext, useEffect, useState } from "react";
import { useVeiculos, Veiculo } from "../../database/queryVceiculos/queryVeiculos";
import { ConnectedContext } from "../../contexts/conectedContext";
import NetInfo from '@react-native-community/netinfo';
import { configMoment } from "../../services/moment";
import { FlatList } from "react-native-gesture-handler";
import { SelectCliente } from "../../components/selectCliente";
import { LodingComponent } from "../../components/loading";

 

export default function Cadastro_veiculo({ route, navigation}:any){
    
    const api = useApi();
    const [ loading, setLoading] = useState(false);
    const useQueryVeiculos = useVeiculos();
    const [visibleModalClientes, setVisibleModalClientes] = useState(false);   

      const [ codigoCliente, setCodigoCliente] = useState<number | null>(null);
     const [ dados, setDados ] = useState <Veiculo>();
    const {connected,  setConnected} = useContext(ConnectedContext)
    const useMoment = configMoment()

    let { codigo_veiculo } =   route.params || { codigo_veiculo : 0};


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
                if(codigo_veiculo){
                    let result  = await useQueryVeiculos.selectByCode(codigo_veiculo);
                    if( result && result?.length > 0 ){
                        setDados(result[0])
                        setCodigoCliente(result[0].cliente)
                    }
                }
            }
            buscaDados();
       },[])


       function selecionarCliente(codigo:number){
        setCodigoCliente( codigo)
        setDados((prev:any)=>({...prev, cliente:codigo}))
       }

       async function gravar(){
        if(codigo_veiculo && dados){
                  try{
                    setLoading(true)

                          let result = await api.put('/veiculo', dados);
                            if(result.status === 200 ){
                                await useQueryVeiculos.update(dados)
                             setLoading(false)
                            navigation.goBack();
                            return Alert.alert('', "Veiculo alterado com sucesso!")
                            }
                    }catch(e){
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
                     let result = await api.post('/veiculo', dados);

                     if(result.status === 200 ){
                        await useQueryVeiculos.create(result.data)
                        setLoading(false)
                        navigation.goBack();
                        return Alert.alert('', "Veiculo Registrado com sucesso!")
                    }
            }catch(e){
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
        <View style={{ flex:1 ,    backgroundColor:'#EAF4FE'  }}>

                {
                     codigo_veiculo &&  !dados  || loading ?
                     ( <LodingComponent isLoading={true} /> ) 
                     :(
          <>
               <View style={{ margin: 7 , padding: 2, borderRadius: 5  }}>
               <Text style={{ fontWeight:"bold"}}> Placa: </Text>
                     <TextInput
                          onChangeText={(value:any)=>  setDados( (prev:any)=> ({...prev, placa:value})) }
                            defaultValue={ dados?.placa}
                        style={{ padding: 5, backgroundColor: '#FFF', elevation: 2, borderRadius:5 }}
                        placeholder="Placa:"
                    />
                </View>
                <View style={{ margin: 7 , padding: 2, borderRadius: 5  }}>
                 <Text style={{ fontWeight:"bold"}}> Modelo: </Text>

                     <TextInput
                           onChangeText={(value:any)=> setDados((prev)=>({...prev, modelo:value }))}
                           style={{ padding: 5, backgroundColor: '#FFF', elevation: 2, borderRadius:5 }}
                           defaultValue={ dados?.modelo}
                        placeholder="Modelo:"
                    />
                </View>
                <View style={{ margin: 7 , padding: 2, borderRadius: 5  }}>
                 <Text style={{ fontWeight:"bold"}}> Combustivel: </Text>

                     <TextInput
                         onChangeText={(value:any)=> setDados((prev)=>({...prev, combustivel:value }))}
                       style={{ padding: 5, backgroundColor: '#FFF', elevation: 2, borderRadius:5 }}
                       defaultValue={ dados?.combustivel}
                        placeholder="Combustivel:"
                    />
                </View>
       

                <View style={{ margin: 7,   padding: 2, borderRadius: 5,flexDirection:"row",   width:'100%' }}>
                   <View style={{width:'40%' ,marginLeft:'5%' }}>
                    <Text style={{ fontWeight:"bold", marginLeft:'5%',}}>Cor: </Text>
                        <TextInput
                         onChangeText={(value:any)=> setDados((prev)=>({...prev, cor:value }))}
                           defaultValue={ dados?.cor}
                            style={{ padding: 5, backgroundColor: '#FFF',   marginLeft:'5%',elevation:2,borderRadius:5 }}
                            placeholder="Cor:"
                        />
                   </View>
                   <View style={{width:'40%' ,marginLeft:'5%' }}>
                    <Text style={{ fontWeight:"bold", marginLeft:'5%'  }}>Ano: </Text>
                       <TextInput
                         onChangeText={(value:any)=> setDados((prev)=>({...prev, ano:value }))}
                         defaultValue={ dados?.ano}
                        style={{ padding: 5, backgroundColor: '#FFF',  marginLeft:'5%', elevation:2, borderRadius:5 }}
                        placeholder="Ano:"
                    />
                   </View>

                </View>
            {/****************************************************** */}    
                <SelectCliente codigoCliente={codigoCliente} setCodigoCliente={selecionarCliente}  />
            {/****************************************************** */}    


                <View style={{ flexDirection: "row", marginTop:50 ,width: '100%', alignItems: "center", justifyContent: "center" }} >
                    <TouchableOpacity 
                    style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius:  10, padding: 5 }}
                        onPress={()=>gravar()}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
                    </TouchableOpacity>
                </View> 
          </>
           )
        }
        </View>
    )

}