import { View, Text, Button, Alert, Modal, ActivityIndicator, StyleSheet,Animated, TouchableOpacity } from "react-native"
import useApi from "../../services/api"
import { useContext, useEffect, useState } from "react"
import { TextInput } from "react-native-gesture-handler"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ConnectedContext } from "../../contexts/conectedContext"
import { useItemsPedido } from "../../database/queryPedido/queryItems"
import { useParcelas } from "../../database/queryParcelas/queryParcelas"
import { usePedidos } from "../../database/queryPedido/queryPedido"
import { useFormasDePagamentos } from "../../database/queryFormasPagamento/queryFormasPagamento"
import { useClients } from "../../database/queryClientes/queryCliente"
import { useProducts } from "../../database/queryProdutos/queryProdutos"
import { AuthContext } from "../../contexts/auth"
import { useServices } from "../../database/queryServicos/queryServicos"
import { useTipoOs } from "../../database/queryTipoOs/queryTipoOs"
import {    useVeiculos } from "../../database/queryVceiculos/queryVeiculos"
import { formatItem } from "../../services/formatStrings"
import { restartDatabaseService } from "../../services/restartDatabase"
import { configMoment } from "../../services/moment"
import { enviaPedidos } from "../../services/sendOrders"  
import { receberPedidos } from "../../services/getOrders"
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useCategoria } from "../../database/queryCategorias/queryCategorias"
import { useMarcas } from "../../database/queryMarcas/queryMarcas"
import { useFotosProdutos } from "../../database/queryFotosProdutos/queryFotosProdutos"

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
      {/** <Animated.View style={[styles.progressBar, { width: `${1}%` }]} />*/}
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

  const useGetOrders = receberPedidos();
  const useSendOrders = enviaPedidos();

  const formataDados =  formatItem();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
     return `${year}-${month}-${day}`;

  };

  async function connect() {
    try {
        const response = await api.get('/');
        if (response.status === 200 && response.data.ok) {
            setConectado(true)
            setConnected(true)
        console.log(response.data);

        } else {
            setConectado(false)
            setConnected(false)
            console.log({"err":"erro ao conectar"})
        }
        setError(undefined)
    } catch (err) {
        setError("Erro ao conectar na API. Por favor, tente novamente.")
    } finally {
        setLoading(false)
    }
}

  const fetchClientes = async () => {
    try {
        setItem('clientes');
        const aux = await api.get(`/offline/clientes?vendedor=${usuario.codigo}` , 
       
        );
        const dados = aux.data;

          const totalClientes = dados.length;

        
              for (let v = 0;  v<= totalClientes; v++) {
                
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
        } catch (e) {
        console.log(e);
    }
  };

  const fetchProdutos = async () => {
    try {
      setItem('produtos');
  
      const aux = await api.get('/offline/produtos');
      const dados = aux.data;
      const totalProdutos = dados.length;
  
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
    } catch (e) {
      console.log(e);
    }
  };

  const fetchFpgt = async () => {
    setItem('formas de pagamento');

    try {
      const aux = await api.get('/offline/formas_pagamento');
      const data = aux.data;

      const totalFormas = data.length
      for (let f =0; f <  data.length; f++ ) {
        const verifiFpgt:any = await useQueryFpgt.selectByCode( data[f].codigo);

              if (verifiFpgt.length > 0) {

          let data_recadastro =  useMoment.formatarDataHora( data[f].data_recadastro);
          console.log(`fpgt:  ${data_recadastro } > ${verifiFpgt[0].data_recadastro}` )

              if (data_recadastro > verifiFpgt[0].data_recadastro ) {
                await useQueryFpgt.update(data[f], data[f].codigo);
              }

              } else {
                await useQueryFpgt.create(data[f]);
              }
        const progressPercentage = Math.floor(((f + 1) / totalFormas) * 100);
        setProgress(progressPercentage); // Atualiza progresso
      }
       
    } catch (e) {
      console.log(e);
    }
  };

  const fetchServices = async () => {
    try {
    setItem('serviços');

      const aux = await api.get('/offline/servicos');
      const dados:any = aux.data;
        const totalServicos = dados.length;
      for (let v = 0; v <  totalServicos; v++ ) {
        
        const verifyServices:any = await useQueryServices.selectByCode(dados[v].codigo);
        if (verifyServices.length > 0) {
        
          let data_recadastro =  useMoment.formatarDataHora( dados[v].data_recadastro);

          console.log(`servicos: ${data_recadastro } > ${verifyServices[0].data_recadastro}` )

          if (data_recadastro > verifyServices[0].data_recadastro ) {
             await useQueryServices.update(dados[v])
          }

        }else{
          await useQueryServices.create(dados[v], dados[v].codigo);

        }
        const progressPercentage = Math.floor(((v + 1) / totalServicos) * 100);
        setProgress(progressPercentage); // Atualiza progresso

      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTiposOs = async () => {
    setItem('tipo de os');
    try {
      const aux = await api.get('/offline/tipo_os');
      const data = aux.data;
      let totalTipos_os = data.length
      for (let i = 0; i < data.length; i++ ) {
        const verifiTipOs:any = await useQueryTipoOs.selectByCode(data[i].codigo);
        
        if (verifiTipOs.length > 0) {
        
          let data_recadastro =  useMoment.formatarDataHora( data[i].data_recadastro);

          console.log(`tipo de os: ${data_recadastro } > ${verifiTipOs[0].data_recadastro}` )
          
          if (data_recadastro > verifiTipOs[0].data_recadastro ) {
            await useQueryTipoOs.update( data[i], data[i].codigo);
          
          }
        } else {
          await useQueryTipoOs.create(data[i]);
        }
      
        const progressPercentage = Math.floor(((i + 1) / totalTipos_os) * 100);
        setProgress(progressPercentage); // Atualiza progresso

      }        
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCategorias = async () => {
    setItem('categorias');
    try {
      const aux = await api.get('/offline/categorias');
      console.log("request categorias ", aux.data )
      const data = aux.data;
      let TotalCategorias = data.length
      for (let i = 0; i < data.length; i++ ) {
        const verifiCategoria:any = await useQueryCategoria.selectByCode(data[i].codigo);
        
        if (verifiCategoria.length > 0) {
        
          let data_recadastro =  useMoment.formatarDataHora( data[i].data_recadastro);

          console.log(`categoria: ${data_recadastro } > ${verifiCategoria[0].data_recadastro}` )
          
          if (data_recadastro > verifiCategoria[0].data_recadastro ) {
            await useQueryCategoria.update( data[i], data[i].codigo);
          
          }
        } else {
          await useQueryCategoria.create(data[i]);
        }
        const progressPercentage = Math.floor(((i + 1) / TotalCategorias) * 100);
        setProgress(progressPercentage); // Atualiza progresso

      }        
    } catch (e) {
      console.log(" ocorreu um erro ao processar as categorias", e);
    }
  };

  const fetchMarcas = async () => {
    setItem('marcas');
    try {
      const aux = await api.get('/offline/marcas');
      const data = aux.data;
      let TotalMarcas = data.length
      for (let i = 0; i < data.length; i++ ) {
        const verifiMarca:any = await useQueryMarcas.selectByCode(data[i].codigo);
        
        if (verifiMarca.length > 0) {
           let data_recadastro =  useMoment.formatarDataHora( data[i].data_recadastro);
       console.log(`marca: ${data_recadastro } > ${verifiMarca[0].data_recadastro}` )
          
          if (data_recadastro > verifiMarca[0].data_recadastro ) {
            await useQueryMarcas.update( data[i], data[i].codigo);
          
          }
        } else {
          await useQueryMarcas.create(data[i]);
        }
        const progressPercentage = Math.floor(((i + 1) / TotalMarcas) * 100);
        setProgress(progressPercentage); // Atualiza progresso

      }        
    } catch (e) {
      console.log(" ocorreu um erro ao processar as marcas", e);
    }
  };

  const fetchVeiculos = async () => {
    setItem('veiculos');

    try {
      const aux = await api.get('/offline/veiculos');
      const data = aux.data;

      const totalVeiculos = data.length

      for (let i = 0; i < data.length; i++ ) {
        const verifiVeic:any = await useQueryVeiculos.selectByCode(data[i].codigo);
        
        if (verifiVeic.length > 0) {

          let data_recadastro =  useMoment.formatarDataHora( data[i].data_recadastro);

          console.log(`Veiculos: ${data_recadastro } > ${verifiVeic[i].data_recadastro}` )

          if (data_recadastro > verifiVeic[0].data_recadastro ) {
            await useQueryVeiculos.update( data[i] );
          }

        } else {
          await useQueryVeiculos.create(data[i]);
        }

        const progressPercentage = Math.floor(((i + 1) / totalVeiculos) * 100);
        setProgress(progressPercentage); // Atualiza progresso
      
      } 
    } catch (e) {
      console.log(e);
    }
  };

  const fetchImgs = async () => {
    setItem('fotos');

    try {
      const aux = await api.get('/offline/fotos');
      const data = aux.data;

      const totalimgs = data.length

      for (let i = 0; i < data.length; i++ ) {
        const verifiImg:any = await useQueryFotos.selectByCodeAndSequenci(data[i].produto, data[i].sequencia);
        
        if (verifiImg.length > 0) {

          let data_recadastro =  useMoment.formatarDataHora( data[i].data_recadastro);

          console.log(`foto: ${data_recadastro } > ${verifiImg[i].data_recadastro}` )

          if (data_recadastro > verifiImg[0].data_recadastro ) {
            await useQueryFotos.update( data[i], data[i].produto );
          }

        } else {
          await useQueryFotos.create(data[i]);
        }

        const progressPercentage = Math.floor(((i + 1) / totalimgs) * 100);
        setProgress(progressPercentage); // Atualiza progresso
      
      } 
    } catch (e) {
      console.log(e);
    }
  };


  const syncData = async () => {
    setIsLoading(true);
    setProgress(0);

    try {
      await fetchClientes();
      await fetchProdutos();
      await fetchFpgt();
      await fetchServices();
      await fetchTiposOs();
      await fetchVeiculos();
      await fetchCategorias();
      await fetchMarcas();
      await fetchImgs(),
      setData([]); // Atualiza o estado para mostrar dados após a sincronização
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000); // Reseta o progresso após 1 segundo
    }
  };




  const handleSync = () => {
    if (!connected) {
      Alert.alert('É necessário estabelecer conexão com a internet para efetuar o sincronismo dos dados!');
      return;
    }
    syncData();
  };

  async function syncOrders(){
    try{
      setIsLoadingOrder(true)
      let aux:any = formatDate(date)
     console.log('');
     console.log('data pedidos ',aux);
     console.log('');

    await useGetOrders.getPedidos(aux);
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

      async function teste(){
        let aux = await useQueryPedidos.selectAll();
        console.log(aux)
       }


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

  return (
    <View style={{ flex: 1 , backgroundColor:'#EAF4FE', alignItems:"center",   width:'98%' }}>

    <View style={{flexDirection:"row"  }}>
      <Text   > status api: </Text>{loading ? (
            <Text>Conectando...</Text>
                    ) : (
                        <>
                            {error ? (
                                <Text>{error}</Text>
                            ) : (
                                <View  >
                                {connected ? <Text style={{ color:'green' }}> Conectado! </Text> 
                                : <Text style={{ color:'red',width:'100%' }}> Não conectado!</Text>}
                                
                                
                                </View>

                            )}
                        </>
                    )}
    </View>
    <TouchableOpacity  style={ { alignItems:"center",elevation:3,padding:5,borderRadius: 5,backgroundColor:'#185FED', justifyContent:"center" }} onPress={()=>{ connect()}}>
                 <Text style={{ color:'#FFF' }} > testar conexão </Text>
      </TouchableOpacity>
    
    {/** */}
    <LoadingData isLoading={isLoading} item={item} progress={progress} />

    <LoadingOrders isLoadingOrder={isLoadingOrder}  />
    {/** */}
           
     

          {/***** enviar cadastros  */}
           <View style={{ marginTop:15, margin:5,borderRadius:5, padding:10, backgroundColor:'#FFF', elevation:3, width:' 98%', alignItems:"center", justifyContent:"center"  }} >
           <Text> cadastrar/atualizar cadastros </Text>
            <TouchableOpacity  style={ {margin:15, elevation:3,padding:5,borderRadius: 5,backgroundColor:'#185FED' }} onPress={()=>{ handleSync()}}>
                 <Text style={{ color:'#FFF' }} > cadastrar/atualizar </Text>
                </TouchableOpacity>

           </View >


      {/***** enviar/receber pedidos */}
           <View style={{margin:5,borderRadius:5, padding:10, backgroundColor:'#FFF', elevation:3, width:'98%', alignItems:"center", justifyContent:"center"  }} >
                  <Text>
                    enviar/receber pedidos a partir de :
                  </Text>
                  
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
                    locale="pt-BR"
                  />
              )
              }
                
                <TouchableOpacity  style={ {margin:15, elevation:3,padding:5,borderRadius: 5,backgroundColor:'#185FED' }} onPress={()=>{ syncOrders()}}>
                 <Text style={{ color:'#FFF' }} > enviar/receber pedidos</Text>
                </TouchableOpacity>
           </View >

     
           <TouchableOpacity  style={ { marginTop:50, elevation:3,padding:5,borderRadius: 5,backgroundColor:'#185FED' }}  onPress={() =>   restart() } >
                 <Text style={{ color:'#FFF' }} > limpar base de dados</Text>
                </TouchableOpacity>

       
        
           
          {/**  <View style={{margin:5}} >
            <Button title='clean Clients' onPress={() => useQueryClientes.deleteAll()} />
           </View >
    
          <View style={{margin:5}} >
            <Button title='clean products' onPress={() => useQueryProdutos.deleteAll()} />
          </View>
         */}

 

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
});
