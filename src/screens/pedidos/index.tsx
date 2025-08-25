import { useCallback, useContext, useEffect, useState } from "react"
import { Text, View, FlatList, Modal, TextInput, StyleSheet, Alert,  TouchableOpacity, ActivityIndicator} from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { OrcamentoContext } from "../../contexts/orcamentoContext";   
import { usePedidos } from "../../database/queryPedido/queryPedido";
import { AuthContext } from "../../contexts/auth";
import { configMoment } from "../../services/moment";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ModalFilter } from "./components/modal-filter/modal-filter"; 
import { ConnectedContext } from "../../contexts/conectedContext";
import { enviaPedidos } from "../../services/sendOrders";
import { receberPedidos } from "../../services/getOrders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalPrint } from "./components/modal-print-pedido";   
                
   

export const Lista_pedidos = ({navigation, tipo, to, route }:any)=>{
        
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

        const [  loadingEditOrder, setLoadingEditOrder ] = useState(false);

        const [data_cadastro , setData_cadastro] = useState( useMoment.primeiroDiaMes())
        const [ orcamentoModal,setOrcamentoModal] = useState();
        
        const [ statusPedido, setStatusPedido ] = useState<  string >('*');


        const getFitroPedidos = async ()=>{
            try{
                const value = await AsyncStorage.getItem('filtroPedidos');
                if(value !== null ) {
                    return value;
                }else{
                    await AsyncStorage.setItem('filtroPedidos', statusPedido)
                }

            }catch(e){  
                console.log("erro ao consultar AsyncStorage")
            }
        }

        const getDataFiltroPedido = async ()=>{ 
              try{
                const value = await AsyncStorage.getItem('dataPedidos');
                if(value !== null ) {
                    return value;
                }

            }catch(e){  

                console.log("erro ao consultar data do filtro dos pedidos AsyncStorage")
            }
        }

        async function busca(){

          let filtroStatus =   await getFitroPedidos();
           let dataFiltroPedidos = await  getDataFiltroPedido();

                if ( !usuario.codigo || usuario.codigo === 0 ){
                    console.log("usuario invalido!")
                    return
                }
                let queryOrder = { tipo:tipo , vendedor: usuario.codigo, data:dataFiltroPedidos ,situacao: filtroStatus  ,input:''  }


                if( pesquisa !== null &&  pesquisa !== '' ) queryOrder.input = pesquisa
             let aux:any = await useQuerypedidos.newSelect( queryOrder );
                     setOrcamentosRegistrados(aux);
                     setVisiblePostPedido(false);
                    //console.log("query...", aux)
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
        

        try{
                setVisiblePostPedido(true);
              let aux = await useQuerypedidos.selectCompleteOrderByCode(item.codigo);
                setLoadingPedidoId( item.codigo )
             useGetPedidos.getPedido( item.codigo);
             let resultPostApi = await  usePostPedidos.postItem( [aux] );
          if( resultPostApi.status === 200 && resultPostApi.data.results && resultPostApi.data.results.length > 0 ){
                        setLoadingPedidoId(0)
                            setVisiblePostPedido(false)
                            busca();
          }
        }catch( e ){
            console.log(e);
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
    setLoadingEditOrder(true)
        try{

          setSelecionado(item);
          navigation.navigate('editarOrcamento',{
             codigo_orcamento: item.codigo,
             tipo: item.tipo
          });
    setLoadingEditOrder(false)

        }catch(e){
        }finally{ 
    setLoadingEditOrder(false)
        }
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
                <View style={ [ stiloItem(item),{    margin:20 , borderRadius:10, elevation:9, padding:10 } ]}>
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
                                { item?.situacao !== 'RE' && item.situacao !== 'FI' && item.situacao !== 'AI' && item.situacao !== "FP" ? 
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
                      <TouchableOpacity onPress={()=>{ selecionaOrcamento(item)}} style={{  borderRadius:5, elevation:5 ,backgroundColor:'white' ,width:35, padding:5}} >
                              <Feather name="edit" size={24} color="#009de2" />
                      </TouchableOpacity>
                      : null     
                  }

                      <Text style={{fontWeight:"bold", color:'white', marginTop:2}}>
                          Cadatrado: { new Date(item?.data_cadastro).toLocaleString("pt-br", {    year: "numeric", month: "short", day: "numeric"  }) }
                      </Text>
                   


                     <View style={{  flexDirection:"row", justifyContent:"space-between"}}>
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
                     <View style={{  flexDirection:"row", justifyContent:"space-between"}}>
                    
                         <Text style={{fontWeight:"bold", color:'white', marginTop:2}}>
                             Última alteração: { new Date(item?.data_recadastro).toLocaleTimeString("pt-br", { month: "short", day: "numeric"  }) }
                        </Text>
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
                        style={{  width:'70%', fontWeight:"bold" ,padding:5, margin:5,   borderRadius:5, elevation:5, backgroundColor:'#FFF'}}
                        onChangeText={(value)=>setPesquisa(value)}
                        placeholderTextColor="#a0a0a0ff"
                        placeholder="pesquisar:  cliente, id pedido ..."
                    /> 
                      <TouchableOpacity  onPress={()=> setVisible(true )} style={{  padding:2}}>
                            <AntDesign name="filter" size={35} color="#FFF" />
                        </TouchableOpacity>
                </View>
              </View>  
                    <Modal  visible={loadingEditOrder}  transparent={true} >
                            <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" , flex:1, alignItems:"center", justifyContent:"center" }}>
                                <ActivityIndicator size={50} color="#185FED" /> 
                        </View>  
              </Modal> 
        {/******************************************* */}
                        <ModalFilter visible={visible} setVisible={ setVisible}  setStatus={setStatusPedido} setDate={setData_cadastro} />
        {/******************************************* */}
                       <ModalPrint visible={visibleModal} orcamento={ orcamentoModal} setVisible={setVisibleModal} />
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