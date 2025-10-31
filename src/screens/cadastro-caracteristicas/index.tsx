import {  useContext, useEffect, useState } from "react"
import { Alert, Button, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import useApi from "../../services/api"
import { useServices } from "../../database/queryServicos/queryServicos"
import { ConnectedContext } from "../../contexts/conectedContext"
import NetInfo from '@react-native-community/netinfo';
import { LodingComponent } from "../../components/loading"
import { defaultColors } from "../../styles/global"
import { useCaracteristica } from "../../database/queryCaracteristicas/queryCaracteristicas"
import Ionicons from '@expo/vector-icons/Ionicons';

export const Cadastro_caracteristicas = ({navigation}:any) => {

    const [ descricao , setDescricao ] = useState();

    const [ unidade, setUnidade ] = useState<string>()

    const api = useApi();
    const  useQuerCaracteristica = useCaracteristica();
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

            if(!descricao) return Alert.alert('','É necessario informar a descrição para gravar a característica!');
            if(!unidade) return Alert.alert('','É necessario informar a unidade para gravar a característica !');

            

        let data =   { 
                    "descricao":descricao,
                    "unidade":unidade,
                }

            //    try{
            //        setLoading(true)
//
            //    let response =   await api.post('/caracteristica', data)
            //    console.log(response.data) 
            //    if(response.data.codigo > 0 ){
//
            //         try{
            //          await useQueryServices.createByCode(response.data, response.data.codigo)
            //          Alert.alert(`Serviço ${aplicacao} registrado com sucesso!`)
            //          setTimeout(()=>{},1000)
            //          navigation.goBack()
            //        return Alert.alert('', `Serviço ${data.aplicacao} registrado com Sucesso!`)
//
            //         }catch(e){
            //             console.log(" ocorreu um erro ao cadastrar o Serviço ",e)
            //         }
            //        }
            //    }catch(e:any){
            //        if(e.status === 400 ){
            //            return Alert.alert('Erro!', e.response.data.msg);
            //        }
            //    }finally{
            //setLoading(false)
            //    }

             try{

                    const result = await useQuerCaracteristica.create(
                        {
                            codigo:1,
                            data_cadastro:'2025-10-31',
                            data_recadastro:'2025-10-31 00:00:00',
                            descricao:descricao,
                            unidade:unidade
                        }
                    )

                    console.log(result);

             } catch(e) {
                console.log('Erro: ',e)
             }
            
        }
      



    return (
        <View style={{ flex: 1 }}>
 
        <LodingComponent isLoading={loading} />

            <View style={{ flex: 1 ,width: '100%',  backgroundColor: '#F0F4F8' }} >
                           <Text style={{ fontSize:20, fontWeight:'bold',color:defaultColors.gray , alignSelf:"flex-start", marginLeft:15 }}> Nova Característica </Text>

                <View style={{ margin: 10, gap: 15, flexDirection: "row" }}>
                      <View style={{ backgroundColor:'#FFF',elevation:4, alignItems:"center", width:'20%', height:60, borderRadius:5  }}>
                          <Ionicons name="options" size={55} color={defaultColors.darkBlue} />
                       </View>
                    <View style={{width:'100%', gap:10 }}>

                           <Text style={{ fontSize:15, fontWeight:'bold',color:defaultColors.gray  }}> Unidade </Text>
                                <TextInput
                                 onChangeText={(value:any)=> setUnidade( value )}
                                  style={{ height:'auto',backgroundColor:'#FFF',color:defaultColors.gray, fontWeight:"bold", fontSize:15, width: '50%', elevation:2, borderRadius:5}}
                                  placeholder="Ex.: Und:"
                                  placeholderTextColor={defaultColors.gray}
                                />

                    </View>
                </View>


                       <View style={{    alignItems:"center"}}>
                           <Text style={{ fontSize:20, fontWeight:'bold',color:defaultColors.gray , alignSelf:"flex-start", marginLeft:15 }}> Descrição </Text>

                              <TextInput
                                onChangeText={(value:any)=> setDescricao( value )}
                                style={{ height:'auto',backgroundColor:'#FFF',color:defaultColors.gray, fontWeight:"bold", fontSize:15,width: '90%', elevation:2, borderRadius:5}}
                                placeholder="Ex.: Metros"   
                          />
                        </View> 

                
                <View style={{ flexDirection: "row", marginTop:50 ,width: '100%', alignItems: "center", justifyContent: "center" }} >
                    <TouchableOpacity 
                    style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center",elevation:3, justifyContent: "center", borderRadius:  5, padding: 5 }}
                        onPress={()=>gravar()}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 21 }}>gravar</Text>
                    </TouchableOpacity>
                </View> 
               </View>

        </View>
    )
}