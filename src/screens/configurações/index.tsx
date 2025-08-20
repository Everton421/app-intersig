import { View, Text, Button, Alert, Modal, ActivityIndicator, StyleSheet,Animated, TouchableOpacity, Linking, ScrollView } from "react-native"
import useApi from "../../services/api"
import { useContext, useEffect, useState } from "react"
import { ConnectedContext } from "../../contexts/conectedContext"
import { AuthContext } from "../../contexts/auth"
import { restartDatabaseService } from "../../services/restartDatabase"
import { configMoment } from "../../services/moment"
import { enviaPedidos } from "../../services/sendOrders"  
import { receberPedidos } from "../../services/getOrders"
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { queryConfig_api } from "../../database/queryConfig_Api/queryConfig_api"
import Feather from '@expo/vector-icons/Feather';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useSyncProdutos } from "../../hooks/sync-produtos/useSyncProdutos"
import { useSyncCategorias } from "../../hooks/sync-categorias/useSyncCategorias"
import { useSyncFotos } from "../../hooks/sync-fotos/useSyncFotos"
import { useSyncMarcas } from "../../hooks/sync-marcas/useSyncMarcas"
import { useSyncServices } from "../../hooks/sync-servicos/useSyncServicos"
import { useSyncClients } from "../../hooks/sync-clientes/useSyncClientes"
import { useSyncVeiculos } from "../../hooks/sync-veiculos/useSyncVeiculos"
import { useSyncTiposDeOs } from "../../hooks/sync-tipos-de-os/useSyncTiposDeOs"
import { useSyncFormasPagamento } from "../../hooks/sync-formas-pagamento/useSyncFormasPagamento"
import { useSyncUsuarios } from "../../hooks/sync-usuarios/useSyncUsuarios"
import { DotIndicatorLoadingData } from "../../components/dotIndicator"
 
const LoadingOrders = ({ isLoadingOrder        }:any) => (
  <Modal animationType='slide' transparent={true} visible={isLoadingOrder}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFF" />
      <Text style={styles.loadingText}>Carregando  pedidos ...  </Text>
    </View>
  </Modal>
);

export const Configurações = () => {

  const api = useApi();

  const { usuario }:any = useContext(AuthContext);
  const {connected, setConnected }:any = useContext(ConnectedContext);

  const useRestartService = restartDatabaseService();
  const useMoment = configMoment();

  const syncProdutos = useSyncProdutos();
  const syncCategorias = useSyncCategorias();
  const syncFotos = useSyncFotos();
  const syncMarcas = useSyncMarcas();
  const syncServicos = useSyncServices();
  const syncClientes = useSyncClients();
  const syncVeiculos = useSyncVeiculos();
  const syncTipoDeOs = useSyncTiposDeOs();
  const syncFormasPagamento =   useSyncFormasPagamento();
  const syncUsusarios =  useSyncUsuarios();
  

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [ item , setItem ] = useState<String>();
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>()
  const [conectado, setConectado] = useState<boolean>()
  const [ dataSelecionada, setDataSelecionada ] = useState(  );
  const [showPicker, setShowPicker] = useState(false);
  const [msgApi , setMsgApi ] = useState('');

  const useGetOrders = receberPedidos();
  const useSendOrders = enviaPedidos();

  const useQueryConfigApi = queryConfig_api();
  
  const formatDate = (date:any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
     return `${year}-${month}-${day}`;

  };

  async function connect() {

    try {
      setLoading(true)
      const response = await api.get('/', {
      });
        if (response.status === 200 && response.data.ok) {
            setConectado(true)
            setConnected(true)
        console.log(response.data);
setMsgApi('')
        } else {
            setConectado(false)
            setConnected(false)
            console.log({"err":"erro ao conectar"})
        }
        setError(undefined)
    } catch (err:any) {
      setConectado(false)
        setMsgApi(err.response.data.msg);
        if(err.status === 400 ) Alert.alert("Erro!", err.response.data.msg);
          setError(err.response.data.msg)

        if(err.status !== 400 )
          Alert.alert("Erro!", "Erro desconhecido!");
        setError("Erro desconhecido!")

    } finally {
      setLoading(false)

    }
}


  const verifyDateSinc = async ()=>{
    let validConfig = await useQueryConfigApi.select(1)
    let dataUltSinc:string;
    let data =
    {
     codigo:1,
     url:'',
     porta:3306,
     token:'',
     data_sinc: useMoment.dataHoraAtual()
   }

      if( validConfig && validConfig?.length > 0   ){
          dataUltSinc = validConfig[0].data_sinc
          console.log("Ultima Sincronizacao : ", validConfig[0].data_sinc )
          useQueryConfigApi.update(data)
      }else{
       let aux = await useQueryConfigApi.create(data);
       dataUltSinc ='';
       console.log("Executando primeira sincronizacao")
      }
        return dataUltSinc;
  }

  const syncData = async () => {
 let data =  await verifyDateSinc();
    setIsLoading(true);
    try {
            await syncProdutos.syncData( { data , setIsLoading, setProgress, setItem } );
             await syncMarcas.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncCategorias.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncFotos.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncServicos.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncClientes.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncVeiculos.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncTipoDeOs.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncFormasPagamento.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncUsusarios.syncData( { data, setIsLoading, setProgress, setItem } );
          
      setData([]);  
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000); // Reseta o progresso após 1 segundo
    }
  };




  const handleSync = async () => {

    if(loading){
      Alert.alert('Aguarde!','Estabelecendo conexão...');
    }

    if (!connected) {
      Alert.alert('É necessário estabelecer conexão com a internet para efetuar o sincronismo dos dados!');
      return;
    }
    if (!conectado) {
      Alert.alert(msgApi );
      return;
    }
    
     syncData();
  };

  async function syncOrders(){
    //  if(loading){
    //  Alert.alert('Aguarde!','Estabelecendo conexão...');
    //}
    //if (!connected) {
    //  Alert.alert('É necessário estabelecer conexão com a internet para efetuar o sincronismo dos dados!');
    //  return;
    //}
    //if (!conectado) {
    //  Alert.alert(msgApi );
    //  return;
    //}

    try{
      setIsLoadingOrder(true)
      let dataPedidos:any = formatDate(date)
 

    await useGetOrders.getPedidos(dataPedidos);
     let responseSystem =  await useSendOrders.postPedidos();
     console.log(responseSystem);
     setIsLoadingOrder(false)

  }catch(e){
    console.log(e);
  }finally{
    setIsLoadingOrder(false)

  }
    } 

      useEffect(  () => {
        connect();
       }, []);


       const handleEvent = (event:any, selectedDate:any) => {
        const currentDate = selectedDate || date;
        setShowPicker(false);
        setDate(currentDate);
        const dataaux:any = formatDate(currentDate);  
        setDataSelecionada(dataaux )
      };


      function restart(){
          Alert.alert('Atenção', `Será necessario uma nova sincronização, deseja concluir esta operação ?`,[
              { text:'Não',
                  onPress: ()=> console.log('nao excluido o item'),
                  style:'cancel',
              },
              {
                  text: 'Sim', onPress: async ()=>{ 
                    await  useRestartService.restart()
                  }
              }
          ] )

      }

 const openUrl = async (url:string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Não foi possível abrir esta URL: ${url}`);
    }
  };
   

  return (
    <View style={{ flex: 1 , backgroundColor:'#EAF4FE', alignItems:"center",   width:'100%' }}>
        <View style={{flexDirection:"row" ,marginTop:10 }}>
          {loading ? (
                 <View>
                     <Text>   Testando conexão... <ActivityIndicator size={20} color="#185FED" /></Text>
                  </View>
                        ) : (
                            <>
                                {error ? (
                                    <Text style={{ fontWeight:"bold" }}> status api: {error}</Text>
                                ) : (
                                    <View  >
                                      
                                    {connected ? <Text style={{ color:'green', fontWeight:"bold" }}> status api:  Conectado! <Feather name="wifi" size={24} color="green" /> </Text> 
                                    : <Text style={{ color:'red',width:'100%',fontWeight:"bold" }}>status api:   Não conectado! <Feather name="wifi-off" size={24} color="red" /> </Text>}
                                    </View>

                                )}
                            </>
                        )}
        </View>
          <TouchableOpacity  style={ { alignItems:"center",marginTop:3,elevation:3,padding:5,borderRadius: 5,backgroundColor:'#185FED', justifyContent:"center" }} onPress={()=>{ connect()}}>
            <Text style={{ color:'#FFF' , fontWeight:"bold"}} > testar conexão </Text>
          </TouchableOpacity>

 
          {/** */}
        <DotIndicatorLoadingData isLoading={isLoading} item={item} progress={progress}   />

          <LoadingOrders isLoadingOrder={isLoadingOrder}  />
          {/** */}
                
      
            {/***** enviar cadastros  */}
            <View style={{ marginTop:15, margin:5,borderRadius:5, padding:10, backgroundColor:'#FFF', elevation:3, width:' 98%', alignItems:"center", justifyContent:"center"  }} >
                  <View style={{ flexDirection:"row", gap:5}}>
                     <Text style={{ color:'#185FED', fontWeight:"bold", fontSize:17, flex:1,  textAlign:"center"}} >Sincronizar Dados</Text>
                  </View>         
                  
                  <TouchableOpacity  style={ { flexDirection:"row",alignItems:"center", margin:15, elevation:5,padding:5,borderRadius: 5,backgroundColor:'#185FED' }} onPress={()=>{ handleSync()}}>
                     <MaterialCommunityIcons name="database-sync" size={35} color="#FFF"  />
                    <Text style={{ color:'#FFF', fontWeight:"bold"}} > Sincronizar dados </Text>
                  </TouchableOpacity>
            </View >

            

          {/***** enviar/receber pedidos */}
              <View style={{margin:5,borderRadius:5, padding:10, backgroundColor:'#FFF', elevation:3, width:'98%', alignItems:"center", justifyContent:"center"  }} >
                  <View style={{ flexDirection:"row", gap:5}}>
                       <Text style={{ color:'#185FED', fontWeight:"bold", fontSize:17}} >
                         enviar/receber pedidos a partir de :
                      </Text>
                  </View>         
                      
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={{ flexDirection: 'row', gap: 7 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                          { dataSelecionada  || formatDate(new Date()) }
                        </Text>
                      <Fontisto name="date" size={24} color="black" />

                    </TouchableOpacity>

                  {
                    showPicker && (
                      <DateTimePicker
                        value={date}
                        display="calendar"
                        mode="date"
                        onChange={handleEvent}
                      // locale="pt-BR"
                      />
                  )
                  }
                    
                    <TouchableOpacity  style={ {margin:15, elevation:3,padding:5,flexDirection:"row",alignItems:'center' ,borderRadius: 5,backgroundColor:'#185FED' }} onPress={()=>{ syncOrders()}}>
                      <MaterialCommunityIcons name="folder-sync" size={35} color='#FFF' />
                      
                        <Text style={{ color:'#FFF', fontWeight:"bold" }} > enviar/receber pedidos</Text>
                    </TouchableOpacity>
              </View >
         
                <TouchableOpacity  style={ { marginTop:50, alignItems:"center", elevation:3,padding:5, flexDirection:"row", borderRadius: 5,backgroundColor:'red' }}  onPress={() =>   restart() } >
                <MaterialCommunityIcons name="database-remove" size={35} color="#FFF" />
                  <Text style={{ color:'#FFF',fontWeight:"bold" }} > limpar base de dados</Text>
              </TouchableOpacity>
      <ScrollView style={styles.contentArea}>

     </ScrollView>

             <View style={styles.footer}>
                <TouchableOpacity   style={styles.linkButton}
                    onPress={()=> openUrl("https://www.intersig.com.br/termos-de-uso-app/")}
                  >
                    <Text style={styles.linkText} > 
                        Termos de uso
                      </Text>
                </TouchableOpacity>

                  <TouchableOpacity   style={styles.linkButton}
                    onPress={()=> openUrl("https://intersig.com.br/politicas-privacidade-app/")} >
                    <Text style={styles.linkText} > 
                        Políticas de Privacidade
                      </Text>
                </TouchableOpacity>
              </View>
  
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 18,
    marginBottom: 10,
    color:'#FFF',
     width:'100%',
     textAlign:'center'
  },
    contentArea: {
    flex: 1, // Faz a área de conteúdo expandir para preencher o espaço disponível, empurrando o footer para baixo
    paddingHorizontal: 20,
    paddingTop: 20, // Adiciona um pouco de espaço no topo do conteúdo
  },
    footer: {
    flexDirection: 'row',  
    justifyContent: 'space-around',  
    alignItems: 'center',  
    paddingVertical: 15,  
    borderTopColor: '#ccc',
    backgroundColor: 'white',
    elevation:3,
    borderRadius:5,
    paddingHorizontal:15
    
  },
  progressBar: {
    height: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    width: '90%', // Garantir que a barra de progresso tenha uma largura inicial
 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Cor de fundo com opacidade
  },
    linkButton: {
    paddingHorizontal: 10, // Espaçamento para o toque ser mais fácil
  },
   linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
