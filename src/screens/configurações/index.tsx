import { View, Text, Button, Alert, Modal, ActivityIndicator, StyleSheet,Animated } from "react-native"
import { api } from "../../services/api"
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


const LoadingData = ({ isLoading, item , progress }) => (
  <Modal animationType='slide' transparent={true} visible={isLoading}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFF" />
      <Text style={styles.loadingText}>Carregando  {item} ... {progress}%</Text>
      <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  </Modal>
);

export const Configurações = () => {
  const { usuario } = useContext(AuthContext);
  const {connected, setConnected } = useContext(ConnectedContext);

  const useQueryProdutos = useProducts();
  const useQueryClientes = useClients();
  const useQueryFpgt = useFormasDePagamentos();
  const useQueryTipoOs = useTipoOs();
  const useQueryServices = useServices();
  const useQueryVeiculos = useVeiculos();
  const useQueryPedidos = usePedidos();
  const  useRestartService = restartDatabaseService();
  const useMoment = configMoment();


  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState([]);
  const [ item , setItem ] = useState<String>();
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>()
  const [conectado, setConectado] = useState<boolean>()


  const useGetOrders = receberPedidos();
  const useSendOrders = enviaPedidos();

  const formataDados =  formatItem();


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
        const aux = await api.get(`/offline/clientes?vendedor=${usuario.codigo}`);
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
        const verifyProduct = await useQueryProdutos.selectByCode(dados[v].codigo);
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
        const verifiFpgt = await useQueryFpgt.selectByCode( data[f].codigo);

              if (verifiFpgt.length > 0) {
                await useQueryFpgt.update(data[f], data[f].codigo);
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
      const dados = aux.data;
        const totalServicos = dados.length;

      for (let v = 0; v <  totalServicos; v++ ) {
      
        const verifyServices = await useQueryServices.selectByCode(dados[v].codigo);
        if (verifyServices.length > 0) {
          useQueryServices.update(dados[v])
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
      const aux = await api.get('/offline/tipos_os');
      const data = aux.data;
      
      let totalTipos_os = data.length
      for (let i = 0; i < data.length; i++ ) {
        const verifiTipOs:any = await useQueryTipoOs.selectByCode(data[i].codigo);
        
        if (verifiTipOs.length > 0) {
          await useQueryTipoOs.update( data[i], data[i].codigo);
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


  const fetchVeiculos = async () => {
    setItem('veiculos');

    try {
      const aux = await api.get('/offline/veiculos');
      const data = aux.data;

      const totalVeiculos = data.length

      for (let i = 0; i < data.length; i++ ) {
        const verifiVeic = await useQueryVeiculos.selectByCode(data[i].codigo);
        
        if (verifiVeic.length > 0) {
          await useQueryVeiculos.update( data[i] );
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
  await useGetOrders.getPedidos();
  await useSendOrders.postPedidos();

  } 

      useEffect(  () => {
        connect();
       }, []);

  return (
    <View style={{ flex: 1 }}>

    <View style={{flexDirection:"row"}}>
    
    <Text>status api: </Text>{loading ? (

          <Text>Conectando...</Text>
                  ) : (
                      <>
                          {error ? (
                              <Text>{error}</Text>
                          ) : (
                              <View  >
                              {connected ? <Text style={{ color:'green' }}> Conectado! </Text> 
                              : <Text style={{ color:'red' }}> Não conectado!</Text>}
                              </View>
                          )}
                      </>
                  )}
    </View>
    
    
    <LoadingData isLoading={isLoading} item={item} progress={progress} />


     <View >
           
           <View style={{margin:5}} >
             <Button title='teste conexao' onPress={() => connect() } />
           </View >

           <View style={{margin:5}} >
            <Button title='cadastrar/atualizar cadastros' onPress={handleSync} />
           </View >

           <View style={{margin:5}} >
            <Button title='enviar pedidos' onPress={() => syncOrders()} />
           </View >

           <View style={{margin:5}} >
            <Button title='restart database' onPress={() => useRestartService.restart()} />
           </View >
           


       
           
          {/**  <View style={{margin:5}} >
            <Button title='clean Clients' onPress={() => useQueryClientes.deleteAll()} />
           </View >
    
          <View style={{margin:5}} >
            <Button title='clean products' onPress={() => useQueryProdutos.deleteAll()} />
          </View>
         */}

     </View>
 

    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 18,
    marginBottom: 10,
    color:'#FFF'
  },
  progressBar: {
    height: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    width: '100%', // Garantir que a barra de progresso tenha uma largura inicial
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Cor de fundo com opacidade
  },
});
