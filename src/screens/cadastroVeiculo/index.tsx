import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useApi from "../../services/api";
import { useContext, useEffect, useState } from "react";
import { useVeiculos, Veiculo } from "../../database/queryVceiculos/queryVeiculos";
import { ConnectedContext } from "../../contexts/conectedContext";
import NetInfo from '@react-native-community/netinfo';
import { configMoment } from "../../services/moment";
import { SelectCliente } from "../../components/selectCliente";
import { LodingComponent } from "../../components/loading";
import { defaultColors } from "../../styles/global";

 

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
        <View style={{ flex:1 ,    backgroundColor:'#EAF4FE'  }}>
                                {  
                                  <LodingComponent isLoading={loading} />
                               }

               <Text style={{ marginLeft:10,marginTop:10, fontWeight:"bold", fontSize:20, color: defaultColors.gray }}> Veículo: { codigo_veiculo && codigo_veiculo > 0 ? codigo_veiculo : null }</Text>

               <View style={{ margin: 7 , padding: 2, borderRadius: 5  }}>
                   <Text style={{ fontWeight:"bold", color:defaultColors.gray, fontSize:17 }}> Placa: </Text>
                     <TextInput
                          onChangeText={(value:any)=>  setPlaca(value) }
                            defaultValue={   placa}
                        style={{ padding: 5, backgroundColor: '#FFF', elevation: 2, borderRadius:5, fontSize:15, fontWeight:"bold", color:defaultColors.gray }}
                        placeholder="Placa:"
                    />
                </View>
                <View style={{ margin: 7 , padding: 2, borderRadius: 5  }}>
                   <Text style={{ fontWeight:"bold", color:defaultColors.gray, fontSize:17 }}> Marca: </Text>
                     <TextInput
                           onChangeText={(value:any)=>  setMarca(value)}
                            style={{ padding: 5, backgroundColor: '#FFF', elevation: 2, borderRadius:5, fontSize:15, fontWeight:"bold", color:defaultColors.gray }}
                           defaultValue={ marca}
                        placeholder="Marca:"
                    />
                </View>
                <View style={{ margin: 7 , padding: 2, borderRadius: 5  }}>
                <Text style={{ fontWeight:"bold", color:defaultColors.gray, fontSize:17 }}> Modelo: </Text>
                     <TextInput
                           onChangeText={(value:any)=>  setModelo(value)}
                            style={{ padding: 5, backgroundColor: '#FFF', elevation: 2, borderRadius:5, fontSize:15, fontWeight:"bold", color:defaultColors.gray }}
                           defaultValue={ modelo}
                        placeholder="Modelo:"
                    />
                </View>
                <View style={{ margin: 7 , padding: 2, borderRadius: 5  }}>
                 <Text style={{ fontWeight:"bold", color:defaultColors.gray, fontSize:17 }}> Combustivel: </Text>
                     <TextInput
                         onChangeText={(value:any)=> setCombustivel(value) }
                         style={{ padding: 5, backgroundColor: '#FFF', elevation: 2, borderRadius:5, fontSize:15, fontWeight:"bold", color:defaultColors.gray }}
                         defaultValue={ combustivel}
                         placeholder="Combustivel:"
                    />
                </View>
       

                <View style={{ margin: 7,   padding: 2, borderRadius: 5,flexDirection:"row",   width:'100%' }}>
                   <View style={{width:'40%' ,marginLeft:'5%' }}>
                    <Text style={{ fontWeight:"bold", marginLeft:'5%', color:defaultColors.gray, fontSize:17}}> Cor: </Text>
                        <TextInput
                         onChangeText={(value:any)=> setCor(value) }
                           defaultValue={ cor}
                            style={{ padding: 5, backgroundColor: '#FFF',   marginLeft:'5%',elevation:2,borderRadius:5,  fontSize:15, fontWeight:"bold", color:defaultColors.gray }}
                            placeholder="Cor:"
                        />
                   </View>
                   <View style={{width:'40%' ,marginLeft:'5%' }}>
                    <Text style={{ fontWeight:"bold", marginLeft:'5%' ,color:defaultColors.gray, fontSize:17 }}>Ano: </Text>
                       <TextInput
                         onChangeText={(value:any)=> setAno(value) }
                         defaultValue={ ano}
                        style={{ padding: 5, backgroundColor: '#FFF',  marginLeft:'5%', elevation:2, borderRadius:5 , fontSize:15, fontWeight:"bold", color:defaultColors.gray}}
                        placeholder="Ano:"
                    />
                   </View>

                </View>
            {/****************************************************** */}    
                <SelectCliente codigoCliente={codigoCliente} setCodigoCliente={selecionarCliente}  />
            {/****************************************************** */}    


                <View style={{ flexDirection: "row",  marginTop:50 ,width: '100%', alignItems: "center", justifyContent: "center" }} >
                    <TouchableOpacity 
                    style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius:  5, padding: 5 }}
                        onPress={()=>gravar()}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
                    </TouchableOpacity>
                </View> 
        
        </View>
    )

}