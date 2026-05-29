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
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { defaultColors,   } from "../../styles/global";
import { shareAsync } from 'expo-sharing';     
import { generateOrderHTML } from "./utils/generateHTML";
 import * as FileSystem from 'expo-file-system';
      import * as Print from 'expo-print';
import { CustomHeader } from "../../components/custom-header";
import { Fab } from "../../components/fab";

export const Lista_pedidos = ({navigation, tipo, to, route }:any)=>{
        
            const useQuerypedidos = usePedidos();
            const useMoment = configMoment();
            const {    setOrcamento } = useContext(OrcamentoContext);
            const { usuario }:any = useContext(AuthContext);
            const {connected,    }:any = useContext(ConnectedContext);
            const usePostPedidos = enviaPedidos();
            const useGetPedidos =  receberPedidos();  

        const [ orcamentosRegistrados, setOrcamentosRegistrados] = useState([]);
        const [ visibleModal, setVisibleModal ] = useState<boolean>(false);
        const [ selecionado, setSelecionado ] = useState();
        const [ pesquisa, setPesquisa ] =  useState(null);
        const [ visible, setVisible ] = useState(false);
       
        const [ visiblePostPedido, setVisiblePostPedido ] = useState(false);
        const [ loadingPedidoId, setLoadingPedidoId ] = useState<number>(0)
        const [ loadingEditOrder, setLoadingEditOrder ] = useState(false);
        const [ data_cadastro , setData_cadastro] = useState( useMoment.primeiroDiaMes())
        const [ orcamentoModal, setOrcamentoModal] = useState();
        const [ statusPedido, setStatusPedido ] = useState<  string >('*');


            const [selectedPrinter, setSelectedPrinter] = useState();

            const print = async () => {
                // On iOS/android prints the given html. On web prints the HTML from the current page.
                await Print.printAsync({
                html,
                printerUrl: selectedPrinter?.url, // iOS only
                });
            };

 /*
    const html = ` <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    </head>
                    <body style="text-align: center;">
                        <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
                        Hello Expo!
                        </h1>
                        <img
                        src="https://i.ibb.co/tpDk4DD5/i5.png"
                        style="width: 90vw;" />
                    </body>
                </html> `;

 

            const printToFile = async () => {
                // On iOS/android prints the given html. On web prints the HTML from the current page.
                const { uri } = await Print.printToFileAsync( { html });
                console.log('File has been saved to:', uri);
                await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf'} );
            };
            */

             
            async function printOrder ( codigo: number ){
             let aux:any = await useQuerypedidos.selectCompleteOrderByCode(codigo);
                
                 const newFileName = `${FileSystem.documentDirectory}Pedido_N°-${aux.id}  - ${new Date().getTime()}.pdf`;

                const html =  generateOrderHTML(aux)

                const  pdfFile = await Print.printToFileAsync( { html });

                    await FileSystem.moveAsync({
                        from:  pdfFile.uri,
                        to: newFileName,
                     });

                await shareAsync(newFileName, { UTI: '.pdf', mimeType: 'application/pdf'} );
            } 

            const selectPrinter = async () => {
                const printer = await Print.selectPrinterAsync(); // iOS only
                setSelectedPrinter(printer);
            };

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
               }, [ navigation])  );
    /////////////////////////////////////////////////
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
                        )  ;
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

    function getStatusColor(situacao: string): string {
      switch (situacao) {
        case 'EA': return '#1E9C43';
        case 'AI': return '#009de2';
        case 'FI': return '#FF7F27';
        case 'RE': return '#9C0404';
        case 'FP': return '#0023F5';
        default: return '#6C757D';
      }
    }

    function getStatusLabel(situacao: string): string {
      switch (situacao) {
        case 'EA': return 'Orçamento';
        case 'AI': return 'Aprovado';
        case 'FI': return 'Faturado';
        case 'RE': return 'Reprovado';
        case 'FP': return 'Parcial';
        default: return situacao;
      }
    }

    const ItemOrcamento = ({item})=>{
        const statusColor = getStatusColor(item?.situacao);
        return(
          <View style={{ marginHorizontal: 16, marginVertical: 8, backgroundColor: '#FFF', borderRadius: 12, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, borderLeftWidth: 5, borderLeftColor: statusColor, overflow: 'hidden' }}>
            <View style={{ padding: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={{ backgroundColor: '#E3F2FD', padding: 8, borderRadius: 8 }} onPress={() => selecionaOrcamentoModal(item)}>
                    <Feather name="eye" size={20} color={defaultColors.darkBlue} />
                  </TouchableOpacity>
                  {item?.situacao !== 'RE' && item.situacao !== 'FI' && item.situacao !== 'AI' && item.situacao !== "FP" ? (
                    <TouchableOpacity style={{ backgroundColor: '#FFEBEE', padding: 8, borderRadius: 8 }} onPress={() => deleteOrder(item)}>
                      <MaterialCommunityIcons name="delete" size={20} color="#E53935" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={{ backgroundColor: '#F5F5F5', padding: 8, borderRadius: 8 }}>
                      <MaterialCommunityIcons name="delete-off" size={20} color="#999" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{ backgroundColor: statusColor + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 11, color: statusColor }}>{getStatusLabel(item?.situacao)}</Text>
                </View>
              </View>

              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#333', marginBottom: 4 }} numberOfLines={1}>
                {item?.nome}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontWeight: '700', color: '#185FED', fontSize: 16 }}>
                  R$ {item?.total_geral?.toFixed(2)}
                </Text>
                {item.id && item.id !== '0' && <Text style={{ fontWeight: '600', color: '#6C757D', fontSize: 13 }}>ID: {item.id}</Text>}
              </View>

              {item.id_externo && <Text style={{ fontWeight: '600', color: '#6C757D', fontSize: 13, alignSelf: 'flex-end' }}>Ext: {item.id_externo}</Text>}

              <View style={{ height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <View style={{ backgroundColor: item.enviado === 'S' ? '#E8F5E9' : '#FFF3E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {item.enviado === 'S' ? (
                      <><Ionicons name="checkmark-done" size={16} color="#2E7D32" /><Text style={{ fontSize: 11, fontWeight: '700', color: '#2E7D32' }}>Sinc.</Text></>
                    ) : (
                      <><Ionicons name="time" size={16} color="#E65100" /><Text style={{ fontSize: 11, fontWeight: '700', color: '#E65100' }}>Pend.</Text></>
                    )}
                  </View>
                  {item?.situacao !== 'RE' && item?.situacao !== 'FI' && (
                    <TouchableOpacity style={{ backgroundColor: '#E3F2FD', padding: 6, borderRadius: 8 }} onPress={() => selecionaOrcamento(item)}>
                      <Feather name="edit" size={18} color={defaultColors.darkBlue} />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {!connected ? (
                    <TouchableOpacity style={{ backgroundColor: '#FFF3E0', padding: 6, borderRadius: 8 }}>
                      <MaterialIcons name="sync-disabled" size={18} color="#E65100" />
                    </TouchableOpacity>
                  ) : (
                    visiblePostPedido && loadingPedidoId === item.codigo ? (
                      <View style={{ backgroundColor: '#E3F2FD', padding: 6, borderRadius: 8 }}>
                        <ActivityIndicator size={18} />
                      </View>
                    ) : null
                  )}
                  <TouchableOpacity style={{ backgroundColor: '#E3F2FD', padding: 6, borderRadius: 8 }} onPress={() => printOrder(item.codigo)}>
                    <AntDesign name="sharealt" size={18} color={defaultColors.darkBlue} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: '#E3F2FD', padding: 6, borderRadius: 8 }} onPress={() => postPedido(item)}>
                    <Ionicons name="sync-sharp" size={18} color={defaultColors.darkBlue} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '500', color: '#6C757D', fontSize: 12 }}>
                  Criado: {new Date(item?.data_cadastro).toLocaleString("pt-br", { year: "numeric", month: "short", day: "numeric" })}
                </Text>
                <Text style={{ fontWeight: '500', color: '#6C757D', fontSize: 12 }}>
                  Alt: {new Date(item?.data_recadastro).toLocaleTimeString("pt-br", { month: "short", day: "numeric" })}
                </Text>
              </View>
            </View>
          </View>
        )
    }

    
    return (
        <View style={{ flex:1, backgroundColor:'#EAF4FE', width:'100%'}} >
              <CustomHeader
                  title="Pedidos"
                  onBack={() => navigation.goBack()}
                  showSearch
                  searchValue={pesquisa}
                  onSearchChange={(v) => setPesquisa(v)}
                  showFilter
                  onFilterPress={() => setVisible(true)}
              />
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
                        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
                        refreshing={loadingEditOrder}
                        onRefresh={() => busca()}
                        ListEmptyComponent={() => (
                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 }}>
                            <MaterialIcons name="receipt-long" size={64} color="#CCC" />
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#999', marginTop: 12 }}>Nenhum pedido encontrado</Text>
                          </View>
                        )}
                        />

                 {/*********    botao Novo Pedido  */}
                            <Fab onPress={() => navigation.navigate(to)} />

                                {/*********    legenda de status  */}
                <View style={{ backgroundColor: '#FFF', paddingVertical: 8, paddingHorizontal: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.1, shadowRadius: 3 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    {[
                      { cor: '#1E9C43', label: 'Orçamento' },
                      { cor: '#009de2', label: 'Aprovado' },
                      { cor: '#FF7F27', label: 'Faturado' },
                      { cor: '#9C0404', label: 'Reprovado' },
                      { cor: '#0023F5', label: 'Parcial' },
                    ].map((status) => (
                      <View key={status.cor} style={{ alignItems: 'center', flexDirection: 'row', gap: 3 }}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: status.cor }} />
                        <Text style={{ fontWeight: '700', fontSize: 10, color: status.cor }}>{status.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
        </View >
    )
}
 