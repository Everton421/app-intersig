import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, Button, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useApi from '../../services/api';
import { useUsuario } from '../../database/queryUsuario/queryUsuario';
import { queryEmpresas } from '../../database/queryEmpresas/queryEmpresas';
import { cpf,   cnpj } from 'cpf-cnpj-validator';
import { restartDatabaseService } from '../../services/restartDatabase';
import { ConnectedContext } from '../../contexts/conectedContext';

export const Resgistrar_empresa = ({ navigation }) => {
    const api = useApi();

    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [emailEmpresa, setEmailEmpresa] = useState(''); 
    const [cnpjInput, setCnpjInput] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [loading, setLoading] = useState(false);
    const [ validaEmpresa , setValidaEMpresa ] = useState(false);
    const [ msgValidaEmpresa , setMsgValidaEMpresa ] = useState();
    const [ cnpjValid , setCnpjValid ] = useState<Boolean>();
    const [ responseEmpresa , setResponseEmpresa ] = useState();
    const [loadingCnpj, setLoadingCnpj ]= useState<boolean>(false);
    const [ msgCnpjValidApi , setMsgCnpjValidApi ] = useState<{ cadastrada:boolean, msg:string } |null  >(null);
    const [ msgEmailValidApi , setMsgEmailValidApi ] = useState({});

    const [loadingEmail, setLoadingEmail ]= useState<boolean>(false);

    const {connected,  setConnected} = useContext(ConnectedContext)

    const useRestart = restartDatabaseService();


    let useQueryUsuario = useUsuario();
    let useQueryEmpresa = queryEmpresas();

    const validateInputCnpj = (input:string) => {
        if (input.length === 11) {
            setCnpjValid(cpf.isValid(input))
            return cpf.isValid(input)  

        } else if (input.length === 14) {
            setCnpjValid(cpf.isValid(input))
            return cnpj.isValid(input) ;
        } else {
            setCnpjValid( false )
            return false ;
      } 
    }




    const showAlert = (message:any) => { 
        Alert.alert('Alerta', message, [{ text: 'OK' }]);
    };

 
    interface EmpresaMobile  {
        codigo_empresa:number,
        nome:string,
        cnpj:string,
        email:string,
        responsavel:string
    }

    /*
    useEffect(
        ()=>{
            async function validaEmail(){
                
               try{
                    setTimeout(()=>{},3000);
                setLoadingEmail(true)
                let response = await api.post('/usuario/validacao',{ "email": email}  );
                  
                    if(response.status === 200){ 
                         setLoadingEmail(false)
                         setMsgEmailValidApi(response.data);
                        } 
              }catch(e){
                 console.log(` Erro ao validar cadastro do usuario na api!`, e)
                }finally{ 
                setLoadingEmail(false)
              }
        }
        validaEmail(); 
        },[ email ]
    )
*/

    async function delay(ms:number){
        return new Promise(resolve => setTimeout( ()=> {resolve},ms))
    }

    useEffect(
        ()=>{

            async function validaEmpresa(){
               //console.log(cnpjInput.length)
            if(cnpjInput.length > 11 ){
            
            
              //  setCnpjInput(String(cnpjInput));
                try{
                setLoadingCnpj(true)
                 //await delay(500);

                    let response = await api.post('/empresa/validacao',{ "empresa":{ "cnpj": cnpjInput}}  );
                    console.log(response.data.status.msg)
                    if(response.status === 200){
                         setMsgCnpjValidApi(response.data.status)
                    setLoadingCnpj(false);
                    }
                 
              }catch(e){
                 console.log(` Erro ao validar cadastro da empresa na api!`, e)
                }finally{
                    setLoadingCnpj(false);
                }
            }
        }
            validaEmpresa();
           
    
        },[ cnpjInput ]
    )


async function register(   ) {
    setLoading(true);

        //setTimeout(   ()=>{  },2000 )
     if (!nomeEmpresa)  {
      setLoading(false);
         return showAlert('É Necessário Informar o Nome da Empresa!');
     }
    if (!cnpj) return showAlert('É Necessário Informar o CNPJ da Empresa!');
     if (!emailEmpresa) return showAlert('É Necessário Informar o Email da Empresa!');
     if (!nomeUsuario) return showAlert('É Necessário Informar o Responsável da Empresa!');
     if (!email) return showAlert('É Necessário Informar o Email do Responsável da Empresa!');
     if (!senha) return showAlert('É Necessário Informar a Senha do Responsável da Empresa!');
     
            let empresa =
             { 
                "nome_empresa": nomeEmpresa,
                "telefone_empresa":  telefone,
                "email_empresa": emailEmpresa,
                "cnpj": cnpjInput,
                } 
            let usuarioEmpresa =
            {
                "nome":nomeUsuario,
                "telefone": '',
                "email":email,
                "senha":senha
            }

                try {
                    let response = await api.post('/empresa', {empresa:empresa, usuario: usuarioEmpresa });
            
                    if (response.status === 200  ) {
                        //console.log(response.data);
                            if(response.data.status.ok === true && !response.data.erro  ){
                                    let responsavel = response.data.codigo_usuario;
                                    let codigo_empresa = response.data.codigo_empresa;
                                    let cnpj  =   response.data.cnpj;
                                    let codigo_usuario =  response.data.codigo_usuario;
                                    let email_empresa = response.data.email_empresa;
                                    let email_usuario = response.data.email_usuario;
                                    let nome_empresa = response.data.nome_empresa;
                                    let senha = response.data.senha;
                                    let usuario = response.data.usuario // nome do usuario

                                    const empMobile:EmpresaMobile =  { codigo_empresa:codigo_empresa, nome:nome_empresa, cnpj:cnpj, email:email, responsavel:responsavel  };

                                let resCadEmpr=  await useQueryEmpresa.createByCode(empMobile);
                                if( resCadEmpr > 0 )console.log("empresa rgistrada") 
                                
                                        let  user =  { codigo:codigo_usuario , nome:usuario, senha:senha , email:email_usuario, cnpj:cnpj, lembrar:'S' }  

                                    let userCad = await useQueryUsuario.createUser(user)

                                    if( userCad && userCad > 0 ) console.log("usuario registrado") 

                                        showAlert(response.data.msg);
                                        setNomeEmpresa('')
                                        setEmailEmpresa('')
                                        setCnpjInput('')
                                        setNomeUsuario('')
                                        setEmail('')
                                        setSenha('');
                                        navigation.navigate('login')
                                 }else{
                                  showAlert(response.data.msg)
                            }


                    } else {
                        // Aqui você lança um erro com a mensagem da resposta da API
                            console.log(response)
                        throw new Error(response.data.message || 'Erro desconhecido ao registrar a empresa.');
                    }
                } catch (e:any) {
                    console.log('Erro:', e.response);
                    if(e.status === 400)  showAlert(e.response.data.msg);   
                
                } finally {
                    setLoading(false);
                }

}


    return (
        <View style={{ flex:1}}>
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100} // Ajuste conforme necessário
        >
            { loading ? (
                <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}} >
                    <ActivityIndicator size={25} color={'#185FED'} />
                </View>
            ):(
                <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#EAF4FE' }}>
                <View style={{ width: '100%',marginTop:10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ margin: 10 }}>
                        <Ionicons name="arrow-back" size={30} color="#185FED" />
                    </TouchableOpacity>

                    {/* Empresa */}
                    <View style={{ backgroundColor: '#FFF', padding: 3, margin: 5, borderRadius: 5, elevation: 3, paddingBottom:25 }}>
                        <Text style={{ color: '#185FED', fontSize: 20, marginLeft: 10 , fontWeight:'bold'}}> Empresa </Text>
                        <View style={{ width: '100%', marginTop: 5 }}>
                            <View style={{flexDirection:'row'}}>
                             <Text style={{ color: '#185FED', marginLeft: 10 }}> Nome: </Text>
                             <Text style={{ color: '#185FED', marginLeft: 5, fontWeight:'bold' }}>   { nomeEmpresa }</Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="Nome fantasia:" 
                                    onChangeText={(v:any)=> setNomeEmpresa(v)}
                                />
                                <MaterialCommunityIcons name="store" size={24} color="#185FED" />
                            </View>
                        </View>

                  <View style={{ width: '100%', marginTop: 5 }}>

                             <View style={{flexDirection:'row'}}>
                                <Text style={{ color: '#185FED', marginLeft: 10 }}> CNPJ/CPF: </Text>
                             </View>

                           <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                 <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="00.000.000/0000-00" 
                                    onChangeText={(v:any)=> setCnpjInput(v)}
                                 />
                       
                                 <MaterialCommunityIcons name="store" size={24} color="#185FED" />
                            </View>

                  <View style={{ width: '100%', marginTop: 5 , alignItems:'center'}}>
                         
                          {   loadingCnpj ? 
                             <ActivityIndicator /> :
                              
                             msgCnpjValidApi != null && msgCnpjValidApi.cadastrada ?
                                ( <Text style={{color:'red'}}>{msgCnpjValidApi.msg}</Text>)   
                                :
                                ( <Text style={{color:'green'}}>{msgCnpjValidApi && msgCnpjValidApi.msg}</Text>)   
                            }                          
                        </View>

                        </View>

                        <View style={{ width: '100%', marginTop: 20 }}>
                            <Text style={{ color: '#185FED', marginLeft: 10 }}> Email: </Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="example@example.com"
                                    onChangeText={(v:any)=> setEmailEmpresa(v)}
                                    />
                                <MaterialIcons name="email" size={24} color="#185FED" />
                            </View>
                                      
                        </View>

                        <View style={{ width: '100%', marginTop: 20 }}>
                            <Text style={{ color: '#185FED', marginLeft: 10 }}> Telefone: </Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="(44) 0000-0000"
                                    onChangeText={(v:any)=> setTelefone(v)}
                                    />
                                <MaterialIcons name="phone" size={24} color="#185FED" />
                            </View>
                        </View>
                    </View>

                    {/* Responsável */}
                    <View style={{ backgroundColor: '#FFF', padding: 3, margin: 5, borderRadius: 5, elevation: 3, paddingBottom:25
                         }}>
                        <Text style={{ color: '#185FED', fontSize: 20, marginLeft: 10,fontWeight:'bold' }}> Responsável </Text>

                        <View style={{ width: '100%', marginTop: 20 }}>
                            <Text style={{ color: '#185FED', marginLeft: 10 }}> Usuário:</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="usuário"
                                      onChangeText={(v:any)=> setNomeUsuario(v)}
                                />
                                <FontAwesome name="user" size={24} color="#185FED" />
                            </View>
                        </View>

                        <View style={{ width: '100%', marginTop: 20 }}>
                            <Text style={{ color: '#185FED', marginLeft: 10 }}> Email: </Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="example@example.com" 
                                      onChangeText={(v:any)=> setEmail(v)}
                                />
                                <MaterialIcons name="email" size={24} color="#185FED" />
                            </View>
                        
                            { 
                             
                             loadingEmail ? 
                             <ActivityIndicator /> :
                              
                                 msgEmailValidApi.cadastrada    &&
                                ( <Text style={{color:'red'}}>{msgEmailValidApi.msg}</Text>)   
                              
                             }  
                        </View>

                        <View style={{ width: '100%', marginTop: 20 }}>
                            <Text style={{ color: '#185FED', marginLeft: 10 }}> Senha: </Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                <TextInput style={{ borderBottomWidth: 1, width: '85%' }} placeholder="Senha:" secureTextEntry 
                                      onChangeText={(v:any)=> setSenha(v)}
                                />
                                <MaterialIcons name="password" size={24} color="#185FED" />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity 
                    style={{ alignItems: "center", padding: 10, borderRadius: 20, backgroundColor: '#185FED', margin: 15, elevation: 3 }}
                         onPress={()=> register()   }
                   >
                        <Text style={{ color: '#FFF' ,fontSize: 20}}>Registrar </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        
            ) }
             
        </KeyboardAvoidingView>
        </View>
    );
};
