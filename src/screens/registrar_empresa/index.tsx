import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, Button, ActivityIndicator, Modal } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useApi from '../../services/api';
import { useUsuario } from '../../database/queryUsuario/queryUsuario';
import { queryEmpresas } from '../../database/queryEmpresas/queryEmpresas';
 
import Foundation from '@expo/vector-icons/Foundation';
import { insertDataFic } from '../../services/insertDataFic';
import { AuthContext } from '../../contexts/auth';
import { cpf as  cpfValid , cnpj as cnpjValid} from 'cpf-cnpj-validator'

export const Resgistrar_empresa = ({ navigation }: any) => {
    const api = useApi();

    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [emailEmpresa, setEmailEmpresa] = useState('');
    const [cnpjInput, setCnpjInput] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [loading, setLoading] = useState(false);
    const [telefoneUsuario, setTelefoneUsuario] = useState('');

    const [ visible, setVisible ] = useState(true);

    const [dadosFic, setDadosFic] = useState<boolean | null>(true);

      const { logado, setLogado, usuario, setUsuario }: any = useContext(AuthContext);
    
    let useQueryUsuario = useUsuario();
    let useQueryEmpresa = queryEmpresas();
         let useDataFic = insertDataFic();

    const showAlert = (message: any) => {
        Alert.alert('Alerta', message, [{ text: 'OK' }]);
    };


    interface EmpresaMobile {
        codigo_empresa: number,
        nome: string,
        cnpj: string,
        email: string,
        responsavel: string
    }


    async function register() {
        
        let validCnpjInput = false; 
         if( cnpjValid.isValid(cnpjInput)) {
            validCnpjInput = cnpjValid.isValid(cnpjInput)
         }
         if( cpfValid.isValid(cnpjInput)){
            validCnpjInput = cpfValid.isValid(cnpjInput)
         }
         
        if(!validCnpjInput ){
            return Alert.alert('Erro!',"CNPJ/CPF invalido!")
        }


       if (!nomeEmpresa) {
            setLoading(false);
            return showAlert('É Necessário Informar o Nome da Empresa!');
        }
        if (!cnpjInput) return showAlert('É Necessário Informar o CNPJ da Empresa!');
        if (!emailEmpresa) return showAlert('É Necessário Informar o Email da Empresa!');
        if (!nomeUsuario) return showAlert('É Necessário Informar o Responsável da Empresa!');
        if (!email) return showAlert('É Necessário Informar o Email do Responsável da Empresa!');
        if (!senha) return showAlert('É Necessário Informar a Senha do Responsável da Empresa!');
 
        let empresa =
        {
            "nome_empresa":  nomeEmpresa ,
            "telefone_empresa": telefone,
            "email_empresa": emailEmpresa,
            "cnpj": cnpjInput,
            dados_teste: dadosFic
        }
        let usuarioEmpresa =
        {
            "nome": nomeUsuario,
            "telefone": telefoneUsuario,
            "email": email,
            "senha": senha
        }

        try {
              setLoading(true);
            let response = await api.post('/empresa', { empresa: empresa, usuario: usuarioEmpresa });
            if (response.status === 200) {
                 console.log(response.data);
                const apiResult = response.data;
                const resultEmpresa = response.data.data.empresa 
                 const resultUsuario =  response.data.data.usuario

                    let responsavel = resultUsuario.codigo_usuario;
                    let codigo_empresa = resultEmpresa.codigo_empresa;
                    let cnpj = resultEmpresa.cnpj;
                    let nome_empresa = resultEmpresa.nome_empresa;
                    let email_empresa = resultEmpresa.email_empresa;
                   
                    const empMobile: EmpresaMobile = { codigo_empresa: codigo_empresa, nome: nome_empresa, cnpj: cnpj, email: email_empresa, responsavel: responsavel };
                       
                    let email_usuario = resultUsuario.email_usuario;
                    let senha  = resultUsuario.senha;
                    let usuario = resultUsuario.usuario // nome do usuario
                    let token = resultUsuario.token

                    let userMobile = {
                                email: email_usuario,
                                senha:  senha,
                                codigo: responsavel,
                                nome: usuario,
                                lembrar: "S",
                                token: token
                            };
                     let codeUser = await useQueryUsuario.create(userMobile);


                    let resCadEmpr = await useQueryEmpresa.create(empMobile);
                    if (resCadEmpr > 0) console.log("empresa rgistrada")
                    setNomeEmpresa('')
                    setEmailEmpresa('')
                    setCnpjInput('')
                    setNomeUsuario('')
                    setEmail('')
                    setSenha('');
                                showAlert(apiResult.status.msg);
                                setUsuario(userMobile);
                      setLogado(true);
               }  
            } catch (e: any) {
               console.log('Erro:', e.response.data.msg);
            if (e.status === 400) showAlert(e.response.data.msg);
           } finally {
            setLoading(false);
        }

    }


    return (
        <View style={{ flex: 1 }}>
            {/*************** */}
            <Modal transparent={true} visible={visible}>
                <View style={{ width: '100%', height: '100%', alignItems: "center", justifyContent: "center", backgroundColor: 'rgba(50,50,50, 0.6)' }} >
                    <View style={{ width: '90%', height: '80%', backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center' }} >
                        <Foundation name="alert" size={50} color="#185FED" />
                        <Text style={{ width: "100%", textAlign: "center", fontWeight: "bold", color: "#868686", fontSize: 20 }}>
                            Atenção!
                        </Text>
                        <Text style={{ width: "100%", textAlign: "center", fontWeight: "bold", color: "#868686" }}>
                            Ao utilizar dados fictícios, serão adicionados exemplos dos itens a serem usados no App, como produtos, clientes, etc. Após efetuar o login, execute uma sincronização para obter os dados.
                        </Text>


                        <View style={{ marginTop: 20 }}>
                            <TouchableOpacity
                                style={{ margin: 5, alignItems: "center" }}
                                onPress={() => {
                                    dadosFic === false ? setDadosFic(true) : setDadosFic(false)
                                }}
                            >
                                <View style={[{ padding: 8, borderWidth: 2, borderRadius: 2 }]}>
                                    {dadosFic && (
                                        <View style={{ position: "absolute", left: -2, top: -9 }}>
                                            <FontAwesome name="check" size={26} color="#185FED" />
                                        </View>
                                    )}
                                </View>
                                <Text style={{ width: "100%", textAlign: "center", fontWeight: "bold", color: "#868686" }}>
                                    {" "}
                                    Desejo utilizar fictícios.
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={{ margin: 5, alignItems: "center" }}
                            onPress={() => {
                                dadosFic ? setDadosFic(false) : setDadosFic(true)
                            }}
                        >
                            <View style={[{ padding: 8, borderWidth: 2, borderRadius: 2 }]}>
                                {dadosFic === false && (
                                    <View style={{ position: "absolute", left: -2, top: -9 }}>
                                        <FontAwesome name="check" size={26} color="#185FED" />
                                    </View>
                                )}
                            </View>
                            <Text style={{ width: "100%", textAlign: "center", fontWeight: "bold", color: "#868686" }}>

                                {" "}
                                Desejo cadastrar os dados da minha empresa.
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ marginTop: 20, backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius: 10, padding: 5, }}
                            onPress={() => setVisible(false)}

                        >
                            <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/*************** */}

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100} // Ajuste conforme necessário
            >
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <ActivityIndicator size={25} color={'#185FED'} />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#EAF4FE' }}>
                        <View style={{ width: '100%', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ margin: 10, flexDirection:'row' }}>
                                <Ionicons name="arrow-back" size={30} color="#185FED" />
                            </TouchableOpacity>

                            {/* Empresa */}
                            <View style={{ backgroundColor: '#FFF', padding: 3, margin: 5, borderRadius: 5, elevation: 3, paddingBottom: 25 }}>
                                <Text style={{ color: '#185FED', fontSize: 20, marginLeft: 10, fontWeight: 'bold' }}> Empresa </Text>
                                <View style={{ width: '100%', marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#185FED', marginLeft: 10 }}> Nome: </Text>
                                        <Text style={{ color: '#185FED', marginLeft: 5, fontWeight: 'bold' }}>   {nomeEmpresa}</Text>
                                    </View>

                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                        <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="Nome fantasia:"
                                            onChangeText={(v: any) => setNomeEmpresa(v)}
                                        />
                                        <MaterialCommunityIcons name="store" size={24} color="#185FED" />
                                    </View>
                                </View>

                                <View style={{ width: '100%', marginTop: 5 }}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#185FED', marginLeft: 10 }}> CNPJ/CPF: </Text>
                                    </View>

                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                        <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="00.000.000/0000-00"
                                            onChangeText={(v: any) => setCnpjInput(v)}
                                        />

                                        <MaterialCommunityIcons name="store" size={24} color="#185FED" />
                                    </View>

                                    <View style={{ width: '100%', marginTop: 5, alignItems: 'center' }}>

                                    </View>

                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <Text style={{ color: '#185FED', marginLeft: 10 }}> Email: </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                        <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="example@example.com"
                                            onChangeText={(v: any) => setEmailEmpresa(v)}
                                            keyboardType="email-address"
                                             autoCapitalize="none"
                                        />
                                        <MaterialIcons name="email" size={24} color="#185FED" />
                                    </View>

                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <Text style={{ color: '#185FED', marginLeft: 10 }}> Telefone: </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                        <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="(44) 0000-0000"
                                            onChangeText={(v: any) => setTelefone(v)}
                                        />
                                        <MaterialIcons name="phone" size={24} color="#185FED" />
                                    </View>
                                </View>
                            </View>

                            {/* Responsável */}
                            <View style={{
                                backgroundColor: '#FFF', padding: 3, margin: 5, borderRadius: 5, elevation: 3, paddingBottom: 25
                            }}>
                                <Text style={{ color: '#185FED', fontSize: 20, marginLeft: 10, fontWeight: 'bold' }}> Responsável </Text>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <Text style={{ color: '#185FED', marginLeft: 10 }}> Usuário:</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                        <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="usuário"
                                            onChangeText={(v: any) => setNomeUsuario(v)}
                                        />
                                        <FontAwesome name="user" size={24} color="#185FED" />
                                    </View>
                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <Text style={{ color: '#185FED', marginLeft: 10 }}> Telefone: </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                        <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="(44) 0000-0000"
                                            onChangeText={(v: any) => setTelefoneUsuario(v)}
                                        />
                                        <MaterialIcons name="phone" size={24} color="#185FED" />
                                    </View>
                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <Text style={{ color: '#185FED', marginLeft: 10 }}> Email: </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                        <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="example@example.com"
                                            onChangeText={(v: any) => setEmail(v)}
                                        />
                                        <MaterialIcons name="email" size={24} color="#185FED" />
                                    </View>

                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <Text style={{ color: '#185FED', marginLeft: 10 }}> Senha: </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                        <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="Senha:" secureTextEntry
                                            onChangeText={(v: any) => setSenha(v)}
                                        />
                                        <MaterialIcons name="password" size={24} color="#185FED" />
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{ alignItems: "center", padding: 10, borderRadius: 5, backgroundColor: '#185FED', margin: 15, elevation: 3 }}
                                onPress={() => register()}
                            >
                                <Text style={{ color: '#FFF', fontSize: 20 }}>Registrar </Text>
                            </TouchableOpacity>

                        </View>

                    </ScrollView>

                )}

            </KeyboardAvoidingView>
        </View>
    );
};
