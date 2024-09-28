import { View, Text, Button, Alert, Modal, ActivityIndicator, StyleSheet } from "react-native"
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
import { orderServices    } from "../../services/sync"
import { formatItem } from "../../services/formatStrings"
import { restartDatabaseService } from "../../services/restartDatabase"






export const Configurações = () => {
    const [conectado, setConectado] = useState<boolean>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>()

    const [url, setUrl] = useState<string>();
    const [urlSave , setUrlSave] = useState<string>();
    const [sync, setSync] = useState(false);


    const {connected, setConnected } = useContext(ConnectedContext);
    const { usuario } = useContext(AuthContext);
 
    const useQueryProdutos = useProducts();
    const useQueryClientes = useClients();
    const useQueryFpgt = useFormasDePagamentos();
    const useQuerypedidos = usePedidos();
    const useQueryParcelas = useParcelas();
    const useQueryItems = useItemsPedido();
    const useQueryTipoOs = useTipoOs();
    const useQueryVeiculos =     useVeiculos();
    const useQueryServices = useServices();
    const useRestartService = restartDatabaseService()

    const formatData = formatItem()

    const servicesPedidos= orderServices();

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

    async function teste (){
        try {
            const response = await api.get('/');
            if (response.status === 200 && response.data.ok) {
                setConectado(true)
            console.log(response.data)
            Alert.alert(' ',"conectado!");

            } else {
                setConectado(false)
                console.log({"err":"erro ao conectar"})
            Alert.alert(' ',"falha ao conectar!");

            }
            setError(undefined)
        } catch (err) {
            setError("Erro ao conectar na API. Por favor, tente novamente.")
        }
    }


    async function fetchClientes() {
        try {
          const aux = await api.get(`/offline/clientes?vendedor=${usuario.codigo}`);  
          const dados = aux.data;
          if (dados.length > 0) {
            for (const v of dados) {
              await useQueryClientes.createByCode(v);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    
      async function fetchProdutos() {
        try {
          const aux = await api.get('/offline/produtos');
          const dados = aux.data;
          if (dados.length > 0) {
            for (const v of dados) {
              const verifyProduct = await useQueryProdutos.selectByCode(v.codigo);

              if (verifyProduct.length > 0) {
                  let data_recadastro = formatData.formatDateTime(v.data_recadastro);
                    if(  data_recadastro > verifyProduct[0].data_recadastro   ){
                        await useQueryProdutos.update(v, v.codigo);
                      }else{
                        console.log(` nao será atualizao do produto ${v.codigo} ${data_recadastro} > ${verifyProduct[0].data_recadastro}`)
                      }
              } else {
                await useQueryProdutos.createByCode(v, v.codigo);
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    
      async function fetchFpgt() {
        try {
          const aux = await api.get('/formas_pagamento');
          const data = aux.data;
          if (data.length > 0) {
            for (const f of data) {
                  const verifiFpgt:any =  await useQueryFpgt.selectByCode( f.codigo );
                  
                     if(verifiFpgt.length > 0 ){
                       await useQueryFpgt.update(f, f.codigo);
                     }else{
                       await useQueryFpgt.create(f);
                     }
            }
          }
        } catch (e) {
          console.log(e);
        }
      }

      async function fetchServices() {
        try {
          const aux = await api.get('/offline/servicos');
          const dados = aux.data;
          if (dados.length > 0) {
            for (const v of dados) {
              const verifyServices = await useQueryServices.selectByCode(v.codigo);
              if (verifyServices.length > 0) {
              //  await useQueryServices.update(v, v.codigo);
              } else {
                await useQueryServices.createByCode(v, v.codigo);
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
       
      }
 
      async function fetchVeiculos() {
        try {
          const aux = await api.get('/offline/veiculos');
          const dados = aux.data;
          if (dados.length > 0) {
            for (const v of dados) {
               await useQueryVeiculos.createVeiculo(v);
          }
        }
        } catch (e) {
          console.log(e);
        }
       
      }


      async function fetchTiposOs() {
        try {
          const aux = await api.get('/offline/tipos_os');
          const data = aux.data;
          console.log(data)
            if (data.length > 0) {
              for (const o of data) {
                  let verifiTipOs:any = await  useQueryTipoOs.selectByCode(o.codigo);
                    
                      if ( verifiTipOs.length > 0 ){
                          await useQueryTipoOs.update(o,o.codigo);
                      }else{
                        await useQueryTipoOs.create(o);
                      }
              }
            }
        } catch (e) {
          console.log(e);
        }
      }
 
    
    const LoadingData = () => (
        <Modal animationType='slide' transparent={true} visible={sync}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="red" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        </Modal>
      );
/////////////////////////////////////////////
    useEffect(() => {
        if(!connected){
          setSync(false);
    
          Alert.alert('É necessario estabelecer conexão com a internet para efetuar o sicronismo dos dados! ')
        return
        } else{
        if (sync  ) {
          const syncData = async () => {
            try {
              await Promise.all( 
                [
                  fetchClientes(),
                 fetchProdutos(),
                  fetchFpgt(),
                   fetchServices(),
                   fetchTiposOs(),
                  // fetchVeiculos()
                  ]);
            } catch (e) {
              console.log(e);
            } finally {
              setSync(false);
            }
          };
          syncData();
        }
      }
      }, [sync]);
/////////////////////////////////////////////
      useEffect(  () => {
         connect();

       // const intervalId = setInterval(() => {
       //     connect();
       // }, 60000);
//
       // return () => clearInterval(intervalId); // Limpa o temporizador quando o componente é desmontado
    }, []);
/////////////////////////////////////////////



async function testedate(){
  const dateTimeString = '2024-09-26T15:30:00'; // String de exemplo
  const formattedDateTime = formatData.formatDateTime(dateTimeString);
  console.log(formattedDateTime); 
}
 

async function testeServices(){
  const result = await servicesPedidos.filterOrders() ;
}


    return (
       <View>
           <LoadingData />
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

            <View style={{margin:10 }}>
            <Button title='teste' onPress={() => connect() } />
              <Button title='Sync' onPress={() => setSync(true)} />
                
              <Button title='enviar dados' onPress={() => testeServices()} />

                     <View style={{ margin:35 }}>
                        <Button title='clean Clients' onPress={() => useQueryClientes.deleteAll()} />
                        <Button title='clean products' onPress={() => useQueryProdutos.deleteAll()} />
                        
                        <Button title='clean database' onPress={() => useRestartService.restart()} />
                        
                        

                   </View>

              
              

              </View>
        </View>
    )
}
 
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)' // Background color with opacity
      },
})