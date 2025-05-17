import { useContext, useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Modal } from "react-native";
import useApi from "../../services/api";
import { useClients } from "../../database/queryClientes/queryCliente";
import { AuthContext } from "../../contexts/auth";
import { AntDesign } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { ConnectedContext } from "../../contexts/conectedContext"
import { LodingComponent } from "../../components/loading";
import { configMoment } from "../../services/moment";

export const Cadastro_cliente = ({ route, navigation }: any) => {
    const [cnpj, setCnpj] = useState<string>();
    const [ie, setIe] = useState<string>();
    const [nome, setNome] = useState<string>();
    const [celular, setCelular] = useState<string>();
    const [cep, setCep] = useState<string>();
    const [cidade, setCidade] = useState<string>();
    const [estado, setEstado] = useState<string>();
    const [endereco, setEndereco] = useState<string>();
    const [bairro, setBairro] = useState<string>();
    const [numero, setNumero] = useState<string>();
    const [data_cadastro, setData_cadastro] = useState<string>();
    const [ codigo, setCodigo ] = useState(0);
    const [ visibleEndereco, setVisibleEndereco] = useState<boolean>(false); 
    const [ loading, setLoading] = useState<boolean>(false);

    const api = useApi();
    const useQueryClient = useClients();
    const { usuario }: any = useContext(AuthContext);
    const useMoment = configMoment();

    const {connected,  setConnected} = useContext(ConnectedContext)
    let { codigo_cliente } =   route.params || { codigo_cliente : 0};

    type client = {
        codigo?:number
        cnpj: string | undefined
        ie: string | undefined
        nome: string | undefined
        celular: string | undefined
        cep: string | undefined
        cidade: string | undefined
        estado: string | undefined
        bairro: string | undefined
        numero: string | undefined
        endereco: string | undefined
        vendedor: number
        data_cadastro?:string
        data_recadastro?:string

    }
//////
useEffect(() => {
    function setConexao(){
       const unsubscribe = NetInfo.addEventListener((state) => {
               setConnected(state.isConnected);
               console.log('conexao com a internet :', state.isConnected);
          });
       return () => {
           unsubscribe();
       };
   }
   setConexao();
 carregarCliente()   
}, []);

//////

    async function carregarCliente(){
        if( !codigo_cliente ) return  
                try{
                 setLoading(true)

                    let result:any = await useQueryClient.selectByCode(codigo_cliente)
                    console.log(result)
                    if( result && result?.length > 0 ){
                        let dados:client = result[0];
                        setCodigo(result[0].codigo)
                        setCnpj(dados.cnpj)
                        setIe(dados.ie)
                        setNome(dados.nome)
                        setCelular(dados.celular)
                        setCep(dados.cep)
                        setCidade(dados.cidade)
                        setEndereco(dados.endereco)
                        setEstado(dados.estado)
                        setBairro(dados.bairro)
                        setNumero(dados.numero)
                        setData_cadastro(dados.data_cadastro)
                    }
                    setLoading(false)

                }catch(e){
                    console.log("erro ao consultar cliente ", e )
                }finally{
                    setLoading(false)

                }

    }



    async function gravar() {
        if( connected === false ) return Alert.alert('Erro', 'É necessario estabelecer conexão com a internet para efetuar o cadastro !');

        if (!cnpj || cnpj === '') return Alert.alert("",'É necessario informar o cpnj/cpf para gravar!');
        if (!ie || ie === '') return Alert.alert("",'É necessario informar a ie/rg para gravar!');
        if (!nome || nome === '') return Alert.alert("",'É necessario informar a razao/nome da empresa para gravar!');
        if (!celular || celular === '') return Alert.alert("",'É necessario informar o celular para gravar!');
        if (!cep || cep === '') return Alert.alert("",'É necessario informar o cep para gravar!');
        if (!cidade || cidade === '') return Alert.alert("",'É necessario informar a cidade para gravar!');
        if (!endereco || endereco === '') return Alert.alert("",'É necessario informar o endereco para gravar!');

        if (!estado || estado === '') return Alert.alert("",'É necessario informar o estado para gravar!');
        if (!bairro || bairro === '') return Alert.alert("",'É necessario informar o bairro para gravar!');
        if (!numero || numero === '') return Alert.alert("",'É necessario informar o numero para gravar!');
        let novoCliente: client =
        {
            cnpj: cnpj,
            bairro: bairro,
            celular: celular,
            cep: cep,
            cidade: cidade,
            estado: estado,
            numero: numero,
            endereco:endereco,
            nome: nome,
            ie: ie,
            vendedor: usuario.codigo
        }

          if(codigo_cliente > 0 ){
         
            let putCliente    =
            {
                codigo: codigo_cliente,
                cnpj: cnpj,
                bairro: bairro,
                celular: celular,
                cep: cep,
                cidade: cidade,
                estado: estado,
                numero: numero,
                endereco:endereco,
                nome: nome,
                ie: ie,
                vendedor: usuario.codigo,
                data_cadastro: usuario.data_cadastro,
                data_recadastro:  useMoment.dataHoraAtual()
            }
            try{
                 
                setLoading(true);

                let result: any = await api.put('/cliente', putCliente)
                //console.log("resultado api:", result.data);

                if (  result.status ===200 && result.data.codigo > 0  ) {
                    let resultSqlite: any = await useQueryClient.update(putCliente, codigo_cliente);
                    Alert.alert('',"Cliente Alterado Com Sucesso!")
                    setTimeout(() => { }, 2000)
                    navigation.goBack()
                }

            } catch(e:any){
                    if(e.status === 400) {
                    return Alert.alert( " Erro!",e.response.data.msg)
                    }else{
                    return Alert.alert('Erro!',"erro desconhecido" )
                    }
            }finally{
                setLoading(false);
            }  
            }else{
            try{
                setLoading(true);

                let result: any = await api.post('/cliente', novoCliente)
                //console.log("resultado api:", result.data);

                if (  result.status ===200 && result.data.codigo > 0  ) {
                    let resultSqlite: any = await useQueryClient.createByCode(result.data);
                    Alert.alert('',"Cliente Registrado Com Sucesso!")
                    setTimeout(() => { }, 2000)
                    navigation.goBack()
                }

            } catch(e:any){
                    if(e.status === 400) {
                    return Alert.alert( " Erro!",e.response.data.msg)
                    }else{
                    return Alert.alert('Erro!',"erro desconhecido" )
                    }
            }finally{
                setLoading(false);
            }     
        }
       
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Tente ajustar aqui
           // keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Ajuste fino para o ios
        >
            <LodingComponent isLoading={loading} />
    
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View  style={{ flex: 1, backgroundColor: '#EAF4FE', alignItems: "center",  width: '100%' }}  >

  
                <View style={{ width: '97%', margin: 7,  backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3 }}>
                    <Text style={{ fontWeight: "bold" }} > CPF/CNPJ:</Text>
                    <TextInput
                        style={{ padding: 5,width:'80%' }}
                        placeholder="00.000.000/0000-00"
                        onChangeText={(value) => setCnpj(value)}
                        defaultValue={cnpj}
                    />
                </View>
                <View style={{ width: '97%', margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold" }} > IE/RG:</Text>
                    <TextInput
                         style={{ padding: 5,width:'80%' }}
                        onChangeText={(value) => setIe(value)}
                        defaultValue={ie}
                    />
                </View>

                <View style={{ width: '97%', margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3 }}>
                    <Text style={{ fontWeight: "bold" }} >Razao social:</Text>
                    <TextInput
                        style={{ padding: 5,width:'80%' }}
                        onChangeText={(value) => setNome(value)}
                        defaultValue={nome}
                    />
                </View>

                <View style={{ width: '97%', margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold" }} > celular:</Text>
                    <TextInput
                        style={{ padding: 5,width:'80%' }}
                        onChangeText={(value) => setCelular(value)}
                        defaultValue={celular}
                    />
                </View>

                    <TouchableOpacity
                        style={{ backgroundColor: '#185FED', padding: 7  ,width: '80%', alignItems: "center", justifyContent: "space-between", borderRadius: 10,   flexDirection:"row"  }}
                        onPress={()=> {setVisibleEndereco(true) }}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>Endereço</Text>
                        <AntDesign name="caretdown" size={24} color="#FFF" />
                    </TouchableOpacity>
                
                {/********* */}
                    <Modal visible={visibleEndereco}  transparent={true}>
                     <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1 }} >
                        <View style={{ backgroundColor: "#FFF", flex: 1 , margin:15, borderRadius:15, height:'80%'}} >
                                    <TouchableOpacity
                                        style={{ backgroundColor: '#185FED', padding: 7, margin:5 ,width: '15%', alignItems: "center", justifyContent: "space-between", borderRadius: 10,   flexDirection:"row"  }}
                                        onPress={()=> {setVisibleEndereco(false) }}
                                    >
                                        <Text style={{ fontWeight: "bold", color: "#FFF"  }}>voltar</Text>
                                 </TouchableOpacity>

                          
                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                 <Text style={{ fontWeight: "bold" }} > cep:</Text>
                                <TextInput
                                     style={{ padding: 5,width:'80%' }}
                                    placeholder="0000.00.00"
                                    onChangeText={(value) => setCep(value)}
                                    defaultValue={cep}
                                />
                            </View>

                            <View style={{ width:'100%', margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                 <Text style={{ fontWeight: "bold" }} >Estado:</Text>

                                <TextInput  style={{ padding: 5,width:'80%' }}
                                    onChangeText={(value) => setEstado(value)}
                                    placeholder="PR" 
                                    defaultValue={estado}
                                    />
                            </View>
                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }} > cidade:</Text>
                                <TextInput
                                     style={{ padding: 5,width:'80%' }}
                                    onChangeText={(value) => setCidade(value)}
                                    defaultValue={cidade}
                                />
                            </View>
                             
                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }} > Endereço:</Text>
                                <TextInput
                                     style={{ padding: 5,width:'80%' }}
                                    onChangeText={(value) => setEndereco(value)}
                                    placeholder="Avenida."
                                    defaultValue={endereco}
                                />
                            </View>
                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }} > bairro:</Text>
                                <TextInput
                                     style={{ padding: 5,width:'80%' }}
                                    onChangeText={(value) => setBairro(value)}
                                    defaultValue={bairro}
                                />
                            </View>
                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }} > numero:</Text>
                                <TextInput
                                     style={{ padding: 5,width:'80%' }}
                                    onChangeText={(value) => setNumero(value)}
                                    defaultValue={numero}
                                />
                            </View>

                            </View>
                        </View>
                    </Modal>

               

                <View style={{ flexDirection: "row", marginTop: 30, width: '100%', alignItems: "center", justifyContent: "center", }} >
                    <TouchableOpacity
                        style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius: 10, padding: 5 }}
                        onPress={() => gravar()}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
                    </TouchableOpacity>
                </View>
            </View>
             </ScrollView>
        </KeyboardAvoidingView>
    )
}