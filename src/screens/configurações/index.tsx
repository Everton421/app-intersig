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

export const Configurações = () => {
    const [conectado, setConectado] = useState<boolean>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>()

    const [url, setUrl] = useState<string>();
    const [urlSave , setUrlSave] = useState<string>();
    const [sync, setSync] = useState(false);


    const {connected, setConencted} = useContext(ConnectedContext);
    
 
    const useQueryProdutos = useProducts();
    const useQueryClientes = useClients();
    const useQueryFpgt = useFormasDePagamentos();
    const useQuerypedidos = usePedidos();
    const useQueryParcelas = useParcelas();
    const useQueryItems = useItemsPedido();
 


    async function connect() {
        try {
            const response = await api.get('/');
            if (response.status === 200 && response.data.ok) {
                setConectado(true)
            console.log(response.data);

            } else {
                setConectado(false)
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
          const aux = await api.get('/offline/clientes');
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
                await useQueryProdutos.update(v, v.codigo);
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
              await useQueryFpgt.create(f);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }

  
    useEffect(  () => {
        connect();
        // Configura um temporizador para verificar a conexão com a API a cada 60 segundos
        const intervalId = setInterval(() => {
            connect();
        }, 30000);

        return () => clearInterval(intervalId); // Limpa o temporizador quando o componente é desmontado
    }, []);

    const LoadingData = () => (
        <Modal animationType='slide' transparent={true} visible={sync}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="red" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        </Modal>
      );

    useEffect(() => {
        if(!connected){
          setSync(false);
    
          Alert.alert('É necessario estabelecer conexão com a internet para efetuar o sicronismo dos dados! ')
        return
        } 
        if (sync  ) {
          const syncData = async () => {
            try {
              await Promise.all([fetchClientes(), fetchProdutos(), fetchFpgt()]);
            } catch (e) {
              console.log(e);
            } finally {
              setSync(false);
            }
          };
          syncData();
        }
      }, [sync]);
    
 

    return (
        <View>

                <LoadingData />


            <Text> status internet:  {connected ? 'conectado' : 'desconectado'}</Text>

            <Text>status api:</Text>{loading ? (

                <Text>Conectando...</Text>
                        ) : (
                            <>
                                {error ? (
                                    <Text>{error}</Text>
                                ) : (
                                    <View  >
                                    {conectado ? <Text style={{ color:'green' }}> Conectado! </Text> 
                                    : <Text style={{ color:'red' }}> Não conectado!</Text>}
                                    </View>
                                )}
                            </>
                        )}

            <View style={{margin:10 }}>
      <Button title='Sync' onPress={() => setSync(true)} />
               

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