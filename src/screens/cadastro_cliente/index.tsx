import { useContext, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Modal } from "react-native";
import useApi from "../../services/api";
import { useClients } from "../../database/queryClientes/queryCliente";
import { AuthContext } from "../../contexts/auth";
import { AntDesign } from '@expo/vector-icons';

export const Cadastro_cliente = ({ navigation }: any) => {
    const [cnpj, setCnpj] = useState<string>();
    const [ie, setIe] = useState<string>();
    const [nome, setNome] = useState<string>();
    const [celular, setCelular] = useState<string>();
    const [cep, setCep] = useState<string>();
    const [cidade, setCidade] = useState<string>();
    const [estado, setEstado] = useState<string>();
    const [bairro, setBairro] = useState<string>();
    const [numero, setNumero] = useState<string>();
    const [ visibleEndereco, setVisibleEndereco] = useState<boolean>(false); 

    const api = useApi();
    const useQueryClient = useClients();
    const { usuario }: any = useContext(AuthContext);

    type client = {
        cnpj: string | undefined
        ie: string | undefined
        nome: string | undefined
        celular: string | undefined
        cep: string | undefined
        cidade: string | undefined
        estado: string | undefined
        bairro: string | undefined
        numero: string | undefined
        vendedor: number
    }

    async function gravar() {
        if (!cnpj || cnpj === '') return Alert.alert('É necessario informar o cpnj/cpf para gravar!');
        if (!ie || ie === '') return Alert.alert('É necessario informar a ie/rg para gravar!');
        if (!nome || nome === '') return Alert.alert('É necessario informar a razao/nome da empresa para gravar!');
        if (!celular || celular === '') return Alert.alert('É necessario informar o celular para gravar!');
        if (!cep || cep === '') return Alert.alert('É necessario informar o cep para gravar!');
        if (!cidade || cidade === '') return Alert.alert('É necessario informar a cidade para gravar!');
        if (!estado || estado === '') return Alert.alert('É necessario informar o estado para gravar!');
        if (!bairro || bairro === '') return Alert.alert('É necessario informar o bairro para gravar!');
        if (!numero || numero === '') return Alert.alert('É necessario informar o numero para gravar!');
        let aux: client =
        {
            cnpj: cnpj,
            bairro: bairro,
            celular: celular,
            cep: cep,
            cidade: cidade,
            estado: estado,
            numero: numero,
            nome: nome,
            ie: ie,
            vendedor: usuario.codigo
        }

        let result: any = await api.post('/clientes', aux)
        console.log("resultado api:", result.data);

        if (result.data.codigo > 0 && !result.data.erro) {
            let resultSqlite: any = await useQueryClient.createByCode(result.data);
            Alert.alert("Cliente registrado com sucesso!")
            setTimeout(() => { }, 2000)
            navigation.goBack()
        }
        if (result.data.erro) {
            return Alert.alert(result.data.msg)
        }

    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Tente ajustar aqui
           // keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Ajuste fino para o ios
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View  style={{ flex: 1, backgroundColor: '#EAF4FE', alignItems: "center",  width: '100%' }}  >

                <View style={{ width: '100%', margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold" }} > CPF/CNPJ:</Text>
                    <TextInput
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        placeholder="00.000.000/0000-00"
                        onChangeText={(value) => setCnpj(value)}
                    />
                </View>
                <View style={{ width: '100%', margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold" }} > IE/RG:</Text>
                    <TextInput
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        onChangeText={(value) => setIe(value)}
                    />
                </View>

                <View style={{ width: '100%', margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3 }}>
                    <Text style={{ fontWeight: "bold" }} >Razao social:</Text>
                    <TextInput
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        onChangeText={(value) => setNome(value)}
                    />
                </View>

                <View style={{ width: '100%', margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold" }} > celular:</Text>
                    <TextInput
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        onChangeText={(value) => setCelular(value)}
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

                          <Text style={{ fontWeight: "bold", fontSize: 15 }} >  Endereço </Text>
                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                 <Text style={{ fontWeight: "bold" }} > cep:</Text>
                                <TextInput
                                    style={{ padding: 5, backgroundColor: '#FFF' }}
                                    placeholder="0000.00.00"
                                    onChangeText={(value) => setCep(value)}
                                />
                            </View>

                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }} > cidade:</Text>
                                <TextInput
                                    style={{ padding: 5, backgroundColor: '#FFF' }}
                                    onChangeText={(value) => setCidade(value)}
                                />
                            </View>
                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }} > estado:</Text>
                                <TextInput style={{ padding: 5, backgroundColor: '#FFF' }}
                                    onChangeText={(value) => setEstado(value)}
                                    placeholder="PR" />
                            </View>

                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }} > bairro:</Text>
                                <TextInput
                                    style={{ padding: 5, backgroundColor: '#FFF' }}
                                    onChangeText={(value) => setBairro(value)}

                                />
                            </View>
                            <View style={{  margin: 7, alignItems: "center", backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3, flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }} > numero:</Text>
                                <TextInput
                                    style={{ padding: 5, backgroundColor: '#FFF' }}
                                    onChangeText={(value) => setNumero(value)}

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