import { View, Text, Button, Alert, Modal, ActivityIndicator, StyleSheet,Animated, TouchableOpacity, Linking, ScrollView } from "react-native"
import useApi from "../../services/api"
import { useContext, useEffect, useState } from "react"
import { ConnectedContext } from "../../contexts/conectedContext"
import { usePedidos } from "../../database/queryPedido/queryPedido"
import { useFormasDePagamentos } from "../../database/queryFormasPagamento/queryFormasPagamento"
import { useClients } from "../../database/queryClientes/queryCliente"
import { useProducts } from "../../database/queryProdutos/queryProdutos"
import { AuthContext } from "../../contexts/auth"
import { useServices } from "../../database/queryServicos/queryServicos"
import { useTipoOs } from "../../database/queryTipoOs/queryTipoOs"
import {    useVeiculos } from "../../database/queryVceiculos/queryVeiculos"
import { restartDatabaseService } from "../../services/restartDatabase"
import { configMoment } from "../../services/moment"
import { enviaPedidos } from "../../services/sendOrders"  
import { receberPedidos } from "../../services/getOrders"
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useCategoria } from "../../database/queryCategorias/queryCategorias"
import { useMarcas } from "../../database/queryMarcas/queryMarcas"
import { useFotosProdutos } from "../../database/queryFotosProdutos/queryFotosProdutos"
import { queryConfig_api } from "../../database/queryConfig_Api/queryConfig_api"
import Feather from '@expo/vector-icons/Feather';
import { useUsuario } from "../../database/queryUsuario/queryUsuario"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const LoadingData = ({ isLoading, item , progress }:any) => (
  <Modal animationType='slide' transparent={true} visible={isLoading}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFF" />
      <Text style={styles.loadingText}>Carregando  {item} ... {progress}%</Text>
      <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  </Modal>
);
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

  const useQueryProdutos = useProducts();
  const useQueryClientes = useClients();
  const useQueryFpgt = useFormasDePagamentos();
  const useQueryTipoOs = useTipoOs();
  const useQueryServices = useServices();
  const useQueryVeiculos = useVeiculos();
  const useQueryPedidos = usePedidos();
  const useRestartService = restartDatabaseService();
  const useMoment = configMoment();
  const useQueryCategoria = useCategoria() 
  const useQueryMarcas = useMarcas();
  const useQueryFotos = useFotosProdutos();
  const useQueryUsuario = useUsuario();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [ item , setItem ] = useState<String>();
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>()
  const [conectado, setConectado] = useState<boolean>()
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true)
  const [ dataSelecionada, setDataSelecionada ] = useState(  );
  const [showPicker, setShowPicker] = useState(false);
  const [msgApi , setMsgApi ] = useState('');

  const [ headerApi, setHeaderApi ] = useState<object | null>(null)

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

  const fetchClientes = async (data:string) => {
    let params:any = '';
    try {
        setItem('clientes');
        const aux = await api.get(`/offline/clientes`, 
          { 
            params:{
              vendedor:usuario.codigo, 
              data_recadastro: data
            } 
          }    
        );
        const dados = aux.data;
          const totalClientes = dados.length;
        if( totalClientes > 0 ){

              for (let v = 0;  v <= totalClientes; v++) {
                
                let result:any  = await useQueryClientes.selectByCnpjAndCode(dados[v]);
                    if(result?.length > 0  ){
                      const data_recadastro =   useMoment.formatarDataHora(dados[v].data_recadastro)
                        if(   data_recadastro > result[0].data_recadastro ){
                          await useQueryClientes.update(dados[v],dados[v].codigo)
                        }else{
                          console.log('cliente nao atualizado');
                        }

                      }else{
                        await useQueryClientes.create(dados[v])
                      }
            const progressPercentage = Math.floor(((v + 1) / totalClientes) * 100);
           setProgress(progressPercentage);  
              }
            }else{
              console.log("Clientes : ", dados)
            }

        } catch (e) {
        console.log(e);
        console.log(e);

    }
  };

  const fetchProdutos = async (data:string) => {
    try {
      setItem('produtos');
  
      const aux = await api.get('/offline/produtos',  { 
        params :{ data_recadastro : data}
      } );
      const dados = aux.data;
      const totalProdutos = dados.length;
      if(totalProdutos > 0 ){
        for (let v = 0; v < totalProdutos; v++) {
          const verifyProduct:any = await useQueryProdutos.selectByCode(dados[v].codigo);
          if (verifyProduct.length > 0) {
            let data_recadastro = useMoment.formatarDataHora( dados[v].data_recadastro ); // Ajuste se necessário
    
            console.log(`${data_recadastro } > ${verifyProduct[0].data_recadastro}` )

            if (data_recadastro > verifyProduct[0].data_recadastro ) {

              await useQueryProdutos.update(dados[v], dados[v].codigo);
            }
          } else {
            await useQueryProdutos.createByCode(dados[v], dados[v].codigo );
          }
          const progressPercentage = Math.floor(((v + 1) / totalProdutos) * 100);
          setProgress(progressPercentage); // Atualiza progresso
        }
      }else{
        console.log("Produtos: ", dados);        
      }

    } catch (e) {
      console.log(e);
    }
  };

  const fetchFpgt = async (data:string) => {
    setItem('formas de pagamento');

    try {
      const aux = await api.get('/offline/formas_pagamento',{ params :{ data_recadastro : data}});
      const dados = aux.data;

      const totalFormas = dados.length
          if( totalFormas > 0 ){
           for (let f =0; f <  dados.length; f++ ) {
            const verifiFpgt:any = await useQueryFpgt.selectByCode( dados[f].codigo);

                  if (verifiFpgt.length > 0) {

              let data_recadastro =  useMoment.formatarDataHora( dados[f].data_recadastro);
              console.log(`fpgt:  ${data_recadastro } > ${verifiFpgt[0].data_recadastro}` )

                  if (data_recadastro > verifiFpgt[0].data_recadastro ) {
                    await useQueryFpgt.update(dados[f], dados[f].codigo);
                  }

                  } else {
                    await useQueryFpgt.create(dados[f]);
                  }
            const progressPercentage = Math.floor(((f + 1) / totalFormas) * 100);
            setProgress(progressPercentage); // Atualiza progresso
           }
         }else{
          console.log("Formas de pagamento: ", dados);
         }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchServices = async ( data:string) => {
    try {
    setItem('serviços');

      const aux = await api.get('/offline/servicos',{ params :{ data_recadastro : data}});
      const dados:any = aux.data;
        const totalServicos = dados.length;
        if(totalServicos > 0 ){
         for (let v = 0; v <  totalServicos; v++ ) {
          const verifyServices:any = await useQueryServices.selectByCode(dados[v].codigo);
          if (verifyServices.length > 0) {
            let data_recadastro =  useMoment.formatarDataHora( dados[v].data_recadastro);
            console.log(`servicos: ${data_recadastro } > ${verifyServices[0].data_recadastro}` )
            if (data_recadastro > verifyServices[0].data_recadastro ) {
              await useQueryServices.update(dados[v])
            }
          }else{
            await useQueryServices.createByCode2(dados[v], dados[v].codigo);
          }
          const progressPercentage = Math.floor(((v + 1) / totalServicos) * 100);
          setProgress(progressPercentage); // Atualiza progresso

         }
       }else{
        console.log("Serviços: ", dados);

       }

    } catch (e) {
      console.log(e);
    }
  };

  const fetchTiposOs = async (data:string) => {
    setItem('tipo de os');
    try {
      const aux = await api.get('/offline/tipo_os',
        { params :{ data_recadastro : data}}
      );
      const dados = aux.data;
      let totalTipos_os = data.length
      if( totalTipos_os > 0 ){
        for (let i = 0; i < data.length; i++ ) {
          const verifiTipOs:any = await useQueryTipoOs.selectByCode(dados[i].codigo);
          if (verifiTipOs.length > 0) {
            let data_recadastro =  useMoment.formatarDataHora( dados[i].data_recadastro);
            console.log(`tipo de os: ${data_recadastro } > ${verifiTipOs[0].data_recadastro}` )
            if (data_recadastro > verifiTipOs[0].data_recadastro ) {
              await useQueryTipoOs.update( dados[i], dados[i].codigo);
            }
          } else {
            await useQueryTipoOs.create(dados[i]);
          }
        
          const progressPercentage = Math.floor(((i + 1) / totalTipos_os) * 100);
          setProgress(progressPercentage); // Atualiza progresso

        }
      }else{
        console.log("Tipo de OS: ", dados);
      }        
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCategorias = async (data:string) => {
    setItem('categorias');
    try {
      const aux = await api.get('/offline/categorias',
        { params :{ data_recadastro : data}}
      );
      console.log("request categorias ", aux.data )
      const dados = aux.data;
      let TotalCategorias = dados.length
      if( TotalCategorias > 0 ){
        for (let i = 0; i < dados.length; i++ ) {
          const verifiCategoria:any = await useQueryCategoria.selectByCode(dados[i].codigo);
          if (verifiCategoria.length > 0) {
            let data_recadastro =  useMoment.formatarDataHora( dados[i].data_recadastro);
            console.log(`categoria: ${data_recadastro } > ${verifiCategoria[0].data_recadastro}` )
            if (data_recadastro > verifiCategoria[0].data_recadastro ) {
              await useQueryCategoria.update( dados[i], dados[i].codigo);
            }
          } else {
            await useQueryCategoria.create(dados[i]);
          }
          const progressPercentage = Math.floor(((i + 1) / TotalCategorias) * 100);
          setProgress(progressPercentage); // Atualiza progresso
        }        
      }else{
        console.log("Categorias: ", dados);
      }
    } catch (e) {
      console.log(" ocorreu um erro ao processar as categorias", e);
    }
  };

  const fetchMarcas = async (data:string) => {
    setItem('marcas');
    try {
      const aux = await api.get('/offline/marcas',
        { params :{ data_recadastro : data}}

      );
      const dados = aux.data;
      let TotalMarcas = dados.length
      if(TotalMarcas > 0 ){
      for (let i = 0; i < dados.length; i++ ) {
        const verifiMarca:any = await useQueryMarcas.selectByCode(dados[i].codigo);
        
        if (verifiMarca.length > 0) {
           let data_recadastro =  useMoment.formatarDataHora( dados[i].data_recadastro);
       console.log(`marca: ${data_recadastro } > ${verifiMarca[0].data_recadastro}` )
          
          if (data_recadastro > verifiMarca[0].data_recadastro ) {
            await useQueryMarcas.update( dados[i], dados[i].codigo);
          
          }
        } else {
          await useQueryMarcas.create(dados[i]);
        }
        const progressPercentage = Math.floor(((i + 1) / TotalMarcas) * 100);
        setProgress(progressPercentage); // Atualiza progresso

      }     
      }else{
       console.log("Marcas: ", dados);
    }   
    } catch (e) {
      console.log(" ocorreu um erro ao processar as marcas", e);
    }
  };

  const fetchVeiculos = async (data:string ) => {
    setItem('veiculos');

    try {
      const aux = await api.get('/offline/veiculos',
        { params :{ data_recadastro : data}}
      );
      const dados = aux.data;

      const totalVeiculos = dados.length
       if( totalVeiculos > 0 ){
        for (let i = 0; i < dados.length; i++ ) {
        const verifiVeic:any = await useQueryVeiculos.selectByCode(dados[i].codigo);
        if (verifiVeic.length > 0) {
          let data_recadastro =  useMoment.formatarDataHora( dados[i].data_recadastro);
          console.log(`Veiculos: ${data_recadastro } > ${verifiVeic[i].data_recadastro}` )
          if (data_recadastro > verifiVeic[0].data_recadastro ) {
            await useQueryVeiculos.update( dados[i] );
          }
        } else {
          await useQueryVeiculos.create(dados[i]);
        }

        const progressPercentage = Math.floor(((i + 1) / totalVeiculos) * 100);
        setProgress(progressPercentage); // Atualiza progresso
      
        } 
      }else{
        console.log("Veiculos: ", dados)
      }
    } catch (e:any) {
      console.log(e);
      console.log(e.response.data.msg);

    }
  };

  const fetchImgs = async (data:string) => {
    setItem('fotos');

    try {
      const aux = await api.get('/offline/fotos',
        { params :{ data_recadastro : data}}
      );
      const dados = aux.data;

      const totalimgs = dados.length
      if ( totalimgs > 0 ){
        for (let i = 0; i < dados.length; i++ ) {
          const verifiImg:any = await useQueryFotos.selectByCodeAndSequenci(dados[i].produto, dados[i].sequencia);
          if (verifiImg.length > 0) {
            let data_recadastro =  useMoment.formatarDataHora( dados[i].data_recadastro);
            console.log(`foto: ${data_recadastro } > ${verifiImg[i].data_recadastro}` )
            if (data_recadastro > verifiImg[0].data_recadastro ) {
              await useQueryFotos.update( dados[i], dados[i].produto );
            }
          } else {
            await useQueryFotos.create(dados[i]);
          }
          const progressPercentage = Math.floor(((i + 1) / totalimgs) * 100);
          setProgress(progressPercentage); // Atualiza progresso
        }
      }else{
        console.log("Imagens: ", dados)
      }

    } catch (e:any) {
      console.log( "erro : ",e);
      if(e.status === 400){
      console.log( "erro : ",e.response.data.msg);
      }
    }
  };

  
  const fetchUsers = async (data:string ) => {
    setItem('usuarios');

    try {
      const aux = await api.get('/usuarios',
        { params :{ data_recadastro : data} }
      );
      const dados = aux.data;

      const totalUsers = dados.length
       if( totalUsers > 0 ){
        for (let i = 0; i < dados.length; i++ ) {
        const verifyUser:any = await useQueryUsuario.selectByCode(dados[i].codigo);
        if (verifyUser.length > 0) {
         
          await useQueryUsuario.create(dados[i]);
        }

        const progressPercentage = Math.floor(((i + 1) / totalUsers) * 100);
        setProgress(progressPercentage); // Atualiza progresso
      
        } 
      }else{
        console.log("Usuários: ", dados)
      }
    } catch (e:any) {
      console.log(e);
      console.log(e.response.data.msg);

    }
  };

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
 let dataSinc =  await verifyDateSinc();
    setIsLoading(true);
    setProgress(0);
    try {
        await fetchClientes(dataSinc);
        await fetchProdutos(dataSinc);
        await fetchFpgt(dataSinc);
        await fetchServices(dataSinc);
        await fetchTiposOs(dataSinc);
        await fetchVeiculos(dataSinc);
        await fetchCategorias(dataSinc);
        await fetchMarcas(dataSinc);
       await fetchImgs(dataSinc);
        await fetchUsers(dataSinc);
      setData([]); // Atualiza o estado para mostrar dados após a sincronização
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000); // Reseta o progresso após 1 segundo
    }
  };




  const handleSync = () => {

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
          <LoadingData isLoading={isLoading} item={item} progress={progress} />
          <LoadingOrders isLoadingOrder={isLoadingOrder}  />
          {/** */}
                
      
            {/***** enviar cadastros  */}
            <View style={{ marginTop:15, margin:5,borderRadius:5, padding:10, backgroundColor:'#FFF', elevation:3, width:' 98%', alignItems:"center", justifyContent:"center"  }} >
                  <View style={{ flexDirection:"row", gap:5}}>
                     <Text style={{ color:'#185FED', fontWeight:"bold", fontSize:17}} > cadastrar/atualizar cadastros </Text>
                  </View>         
                  
                  <TouchableOpacity  style={ { flexDirection:"row",alignItems:"center", margin:15, elevation:5,padding:5,borderRadius: 5,backgroundColor:'#185FED' }} onPress={()=>{ handleSync()}}>
                     <MaterialCommunityIcons name="database-sync" size={35} color="#FFF"  />
                    <Text style={{ color:'#FFF', fontWeight:"bold"}} > cadastrar/atualizar </Text>
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
              <TouchableOpacity  style={ { marginTop:50, alignItems:"center", elevation:3,padding:5, flexDirection:"row", borderRadius: 5,backgroundColor:'#185FED' }}  onPress={() =>   restart() } >
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
