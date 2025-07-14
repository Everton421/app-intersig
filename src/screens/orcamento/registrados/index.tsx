import { useCallback, useContext, useEffect, useState } from "react"
import { Text, View, FlatList, Modal, TextInput, StyleSheet, Alert,  TouchableOpacity, ActivityIndicator} from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { OrcamentoContext } from "../../../contexts/orcamentoContext";
import { usePedidos } from "../../../database/queryPedido/queryPedido";
import { AuthContext } from "../../../contexts/auth";
import { configMoment } from "../../../services/moment";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ModalOrcamento } from "./modalOrcamento";
import { ModalFilter } from "./modal-filter";
import { ConnectedContext } from "../../../contexts/conectedContext";
import { enviaPedidos } from "../../../services/sendOrders";
import { receberPedidos } from "../../../services/getOrders";
                
   

export const OrcamentosRegistrados = ({navigation, tipo, to, route }:any)=>{
        
    const useQuerypedidos = usePedidos();
        const useMoment = configMoment();
        const {    setOrcamento } = useContext(OrcamentoContext);
        const { usuario }:any = useContext(AuthContext);
        const {connected, setConnected }:any = useContext(ConnectedContext);

          const usePostPedidos = enviaPedidos();
          const useGetPedidos =  receberPedidos();  

        const [ orcamentosRegistrados, setOrcamentosRegistrados] = useState([]);
        const [ visibleModal, setVisibleModal ] = useState<boolean>(false);
        const [ selecionado, setSelecionado ] = useState();
        const [ pesquisa, setPesquisa ] =  useState(null);
        const [ visible, setVisible ] = useState(false);
       
        const [ visiblePostPedido, setVisiblePostPedido ] = useState(false);
        const [ loadingPedidoId, setLoadingPedidoId ] = useState<number>(0)

        const [data_cadastro , setData_cadastro] = useState( useMoment.primeiroDiaMes())
        const [ orcamentoModal,setOrcamentoModal] = useState();
        
        const [ statusPedido, setStatusPedido ] = useState<  string >('*');
        
        async function busca(){
                if ( !usuario.codigo || usuario.codigo === 0 ){
                    console.log("usuario invalido!")
                    return
                }
                let queryOrder = { tipo:tipo , vendedor: usuario.codigo, data:data_cadastro ,situacao:statusPedido     }
                if( pesquisa !== null &&  pesquisa !== '' ) queryOrder.cliente = pesquisa
          console.log("Consultando...", queryOrder)
             let aux:any = await useQuerypedidos.newSelect( queryOrder );
                     setOrcamentosRegistrados(aux);
                     setVisiblePostPedido(false);
            }
 
   
    /////////////////////////////////////////////////
        useEffect(()=>{
            busca()
           },[ data_cadastro,   statusPedido , pesquisa])
    /////////////////////////////////////////////////
    
           useFocusEffect(
            useCallback(() => {
                busca();
            }, [ navigation])  
    );

    useEffect(()=>{
        async function busca(){
            if( selecionado !== undefined ){
                let aux = await useQuerypedidos.selectCompleteOrderByCode(selecionado?.codigo);
                setOrcamento(aux );
            }else { return }  

        }
     busca()
    },[selecionado])
    /////////////////////////////////////////////////
    
  
    async function deleteOrder (item:any){
        Alert.alert('', `Deseja excluir o orcamento : ${item.codigo} ?`,[
            { text:'Não',
                onPress: ()=> console.log('nao excluido o item'),
                style:'cancel',
            },
            {
                text: 'Sim', onPress: async ()=>{ 
                          await useQuerypedidos.deleteOrder(item.codigo)
                          setOrcamentosRegistrados(
                            orcamentosRegistrados.filter( (i:any) => i.codigo !== item.codigo)
                        )
                          ;
                }
            }
        ] )
        
         

    }

    async function selecionaOrcamentoModal( item ){
        let aux = await useQuerypedidos.selectCompleteOrderByCode(item.codigo);
        console.log(aux  )
        setOrcamentoModal( aux );
        setVisibleModal( true )
    }

    async function postPedido( item ){
        setVisiblePostPedido(true);
            let aux = await useQuerypedidos.selectCompleteOrderByCode(item.codigo);
            setVisiblePostPedido( true )
            setLoadingPedidoId( item.codigo )
            useGetPedidos.getPedido( item.codigo);
       let resultPostApi = await  usePostPedidos.postItem( [aux] );
       
       if( resultPostApi.status === 200 && resultPostApi.data.results && resultPostApi.data.results.length > 0 ){
            Alert.alert( '',  `Pedido id: ${item.id} enviado com sucesso!` , 
                [
                     { text:'ok', onPress: ()=>{
                         setLoadingPedidoId(0)
                            setVisiblePostPedido(false)
                            busca();
                        } 
                    }
                ]   
                )
       }else{
           Alert.alert( '',  `Algo de inesperado ocorreu ao processar o pedido : ${item.id} !` , 
                [
                     { text:'ok', onPress: ()=>{
                         setLoadingPedidoId(0)
                            setVisiblePostPedido(false)
                            busca();
                        } 
                    }
                ]   
                )
       }
    }





    function selecionaOrcamento(item){
          setSelecionado(item);
         //setVisible(true);
         navigation.navigate('editarOrcamento',{
            codigo_orcamento: item.codigo,
            tipo: item.tipo
         });
    }

    function stiloItem(item:any){
            if(!item.situacao){
                return;
            }
        let cor;
        switch (item?.situacao){
            case  'EA' :
                cor =  { backgroundColor:'#1E9C43'  };
            break;
            case 'AI':
                cor  = { backgroundColor:'#009de2' };  
             break;
            
            case 'FI':
                cor  = { backgroundColor:'#FF7F27'    };  
             break;
             case 'RE':
                cor  = { backgroundColor:'#9C0404'  };  
              break;
              case 'FP':
                cor  = { backgroundColor:'#0023F5'  };  
              break;
              
            
            }
            return cor;
    }

  

    const ItemOrcamento = ({item})=>{
        return(
                <View style={ [ stiloItem(item),{    margin:20 , borderRadius:15, elevation:9, padding:10 } ]}>
                   <View style={{ flexDirection:"row", justifyContent:"space-between" }} >         
                         <TouchableOpacity style={{   backgroundColor: '#FFF',   height:30,padding:2, borderRadius: 5, width: 35, elevation: 5, alignItems:"center" }} 
                             onPress={ ()=> selecionaOrcamentoModal(item)}>
                                 <Feather name="eye" size={24} color="#009de2" />
                         </TouchableOpacity>
                       <View style={{   }} >
                             { item.id && item.id !== '0' && <Text style={{ fontWeight:'bold', color:'#FFF'}}> id:  {item.id}</Text>
                             }
                             {
                                 item.id_externo && item.id_externo !== '0' && <Text style={{ fontWeight:'bold', color:'#FFF'}}> id externo:  {item.id_externo}</Text>
                             }
                       </View>
                    </View>
            <Modal visible={false }>
            <TouchableOpacity onPress={() => {setVisible(false)  }}
                style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '20%', elevation: 5 }} >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                  voltar
                </Text>
              </TouchableOpacity>
            </Modal>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', }}>
                       
                            <Text style={{fontWeight:"bold", color:'white', margin:3 ,width:'90%' }}>
                                   Total R$: {item?.total_geral.toFixed(2)}
                            </Text>
                                { item?.situacao !== 'RE' && item.situacao !== 'FI' && item.situacao !== 'AI'  ? 
                                            <TouchableOpacity 
                                            onPress={()=>  deleteOrder(item)  }
                                            >
                                                <AntDesign name="closecircle" size={24} color="red" />
                                            </TouchableOpacity>
                                    : null
                                    }
                        </View>

                        <Text style={{ margin:3 ,fontWeight:"bold", color:'white', fontSize:20 }}>
                            {item?.nome}
                        </Text>
                        
                { item?.situacao !== 'RE' && item.situacao !== 'FI'    ? 
                      <TouchableOpacity onPress={( )=>{ selecionaOrcamento(item)}} style={{  borderRadius:5, elevation:5 ,backgroundColor:'white' ,width:35, padding:5}} >
                              <Feather name="edit" size={24} color="#009de2" />
                      </TouchableOpacity>
                      : null     
                  }
                      <Text style={{fontWeight:"bold", color:'white', marginTop:2}}>
                          Data Cadastro: {item?.data_cadastro} 
                      </Text>

                     <View style={{ flexDirection:"row", justifyContent:"space-between"}}>
                        {
                            item.enviado === 'S'?
                            <Ionicons name="checkmark-done" size={24} color="#73FBFD" />
                            :
                            <Ionicons name="checkmark" size={24} color="#75F94D" />
                        }
                        { !connected ? ( 
                          <TouchableOpacity   style={{  borderRadius:5, elevation:5 ,backgroundColor:'white' ,width:35, padding:5}} >
                            <MaterialIcons name="sync-disabled" size={24} color="#009de2" />
                          </TouchableOpacity>
                            ):(
                              visiblePostPedido && loadingPedidoId === item.codigo ? 
                          <View   style={{  borderRadius:5, elevation:5 ,backgroundColor:'white' ,width:35, padding:5}} >
                                <ActivityIndicator size={25}/>
                          </View>
                          :
                          <TouchableOpacity  onPress={()=> postPedido(item) } style={{  borderRadius:5, elevation:5 ,backgroundColor:'white' ,width:35, padding:5}} >
                                <Ionicons name="sync-sharp" size={24} color="#009de2" />
                          </TouchableOpacity>
                          
                            )
                        }

                      </View>
               </View>
        )
    }


    
    return (
        <View style={{ flex:1, backgroundColor:'#EAF4FE', width:'100%'}} >
              <View style={{  padding:15, backgroundColor:'#185FED', alignItems:"center", flexDirection:"row", justifyContent:"space-between" }}>
                 <TouchableOpacity onPress={  ()=> navigation.goBack()  } style={{ margin:5 }}>
                     <Ionicons name="arrow-back" size={25} color="#FFF" />
                 </TouchableOpacity>
                 <View style={{ flexDirection:"row", marginLeft:10 , gap:2, width:'100%', alignItems:"center"}}>
                    < TextInput 
                        style={{  width:'70%', fontWeight:"bold" ,padding:5, margin:5, textAlign:'center', borderRadius:5, elevation:5, backgroundColor:'#FFF'}}
                        onChangeText={(value)=>setPesquisa(value)}
                        placeholder="pesquisar"
                    /> 
                      <TouchableOpacity  onPress={()=> setVisible(true )} style={{  padding:2}}>
                            <AntDesign name="filter" size={35} color="#FFF" />
                        </TouchableOpacity>
                </View>
            </View>  



                {
/*
                   <Modal  visible={ true }  transparent={true} >
                              <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" , flex:1, alignItems:"center", justifyContent:"center" }}>
                                <View style={{ backgroundColor:'#FFF', width:'80%',alignItems:"center", justifyContent:"center", height:'40%', marginTop:10, borderRadius:10 }}>    
                                        <Text style={{ color:'blue', fontWeight:"bold", fontSize:20}} >
                                                Processando Pedido:  { postPedidoS && postPedidoS}
                                        </Text>
                                        <ActivityIndicator size={50} color="blue"  />
                               </View>
                       </View>
 
                </Modal>
                    */
                }

        {/******************************************* */}
                        <ModalFilter visible={visible} setVisible={ setVisible} setStatus={setStatusPedido}  setDate={setData_cadastro} />
        {/******************************************* */}
                       <ModalOrcamento visible={visibleModal} orcamento={ orcamentoModal} setVisible={setVisibleModal} />
        {/******************************************* */}


        {/******************************************* */}
                        <FlatList
                        data={orcamentosRegistrados}
                        renderItem={({item})=> <ItemOrcamento item={item}/>}
                        keyExtractor={ (item:any)=> item.codigo.toString()}
                        contentContainerStyle={{ paddingBottom: 100 }} 
                        />

                   {/*********    botao Novo Pedido  */}
                            <TouchableOpacity onPress={()=> navigation.navigate(to)} 
                                style={{
                                         backgroundColor:'#185FED' ,  width:50, height:50,   
                                    borderRadius:25,  position:"absolute" , elevation:10  ,left: '80%',bottom: '15%', alignItems:"center", justifyContent:"center" }}>
                                  <MaterialIcons name="add-circle" size={45} color="#FFF" />
                             </TouchableOpacity>

                   {/*********    lista de status dos pedidos  */}
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF',   padding: 10 ,  }}>
                        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', margin:3  }}>
                            <View style={{  alignItems:"center"}}>
                                    <View style={{padding:4,    backgroundColor:'#1E9C43' , borderRadius:4}}></View>
                                    <Text style={{ fontWeight:'bold',fontSize:10, marginLeft:2, color:'#1E9C43'}}>
                                        orcamento
                                    </Text>
                            </View>

                            <View style={{  alignItems:"center"}}>
                                <View style={{ padding:4,     backgroundColor:'#307CEB' , borderRadius:4}}>
                                </View>
                                <Text style={{ fontWeight:'bold' ,fontSize:10, marginLeft:2, color:'#307CEB'}}>
                                    pedido
                                </Text>
                            </View>

                            <View style={{  alignItems:"center"}}>
                                <View style={{ padding:4,     backgroundColor:'#F57A25' , borderRadius:4}}>
                                </View>
                                <Text style={{fontWeight:'bold' ,fontSize:10, marginLeft:2, color:'#FF7F27'}}>
                                    faturado
                                </Text>
                            </View>

                            <View style={{   alignItems:"center"}}>
                                <View style={{ padding:4,     backgroundColor:'#9C0404' , borderRadius:4}}>
                                </View>
                                <Text style={{fontWeight:'bold' , fontSize:10, marginLeft:2, color:'#9C0404'}}>
                                    reprovado
                                </Text>
                            </View>
                            <View style={{   alignItems:"center"}}>
                                <View style={{ padding:4,     backgroundColor:'#0023F5' , borderRadius:4}}>
                                </View>
                                <Text style={{fontWeight:'bold' ,  fontSize:10, marginLeft:2, color:'#0023F5'}}>
                                    parcial
                                </Text>
                            </View>
                        </View>
 
                   </View>
        </View >
    )

}

const  styles = StyleSheet.create({
    containerItemOrcamento:{
        
    }

})