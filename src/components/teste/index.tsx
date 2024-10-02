import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Modal, StyleSheet, Text, View, Animated } from "react-native";
import { useProducts } from '../../database/queryProdutos/queryProdutos';
import { ConnectedContext } from '../../contexts/conectedContext';
import { useClients } from '../../database/queryClientes/queryCliente';
import { useFormasDePagamentos } from '../../database/queryFormasPagamento/queryFormasPagamento';
import { useServices } from '../../database/queryServicos/queryServicos';
import { api } from '../../services/api';
import { useTipoOs } from '../../database/queryTipoOs/queryTipoOs';
import { AuthContext } from '../../contexts/auth';
import { formatItem } from '../../services/formatStrings';
import { usePedidos } from '../../database/queryPedido/queryPedido';

const LoadingData = ({ isLoading, item , progress }) => (
  <Modal animationType='slide' transparent={true} visible={isLoading}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="red" />
      <Text style={styles.loadingText}>Carregando  {item} ... {progress}%</Text>
      <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  </Modal>
);

export const Teste = () => {
  const { connected } = useContext(ConnectedContext);
  const { usuario } = useContext(AuthContext);

  const useQueryProdutos = useProducts();
  const useQueryClientes = useClients();
  const useQueryFpgt = useFormasDePagamentos();
  const useQueryTipoOs = useTipoOs();
  const useQueryServices = useServices();
  const useQuerypedidos = usePedidos();



  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState([]);
  const [ item , setItem ] = useState<String>();



  const formataDados =  formatItem();




  const fetchClientes = async () => {
    try {
        setItem('clientes');
        const aux = await api.get(`/offline/clientes?vendedor=${usuario.codigo}`);
        const dados = aux.data;

          const totalClientes = dados.length;

          if( totalClientes > 0 ){
        
              for (let v = 0;  v<= totalClientes; v++) {
                
                let result:any  = await useQueryClientes.selectByCnpjAndCode(dados[v]);
                
                    if(result?.length > 0  ){

                      const data_recadastro =   formataDados.formatDate(dados[v].data_recadastro)
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
          let data_recadastro = dados[v].data_recadastro; // Ajuste se necessário
          if (data_recadastro > verifyProduct[0].data_recadastro) {
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
      const aux = await api.get('/formas_pagamento');
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
      
      for (let i = 0; i < data.length; i++ ) {
        const verifiTipOs = await useQueryTipoOs.selectByCode(data[i].codigo);
        
        if (verifiTipOs.length > 0) {
          await useQueryTipoOs.update( data[i], data[i].codigo);
        } else {
          await useQueryTipoOs.create(data[i]);
        }
      
      }        const progressPercentage = Math.floor(((v + 1) / totalServicos) * 100);
      setProgress(progressPercentage); // Atualiza progresso
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

  async function filterOrders() {
    let orders:any = await useQuerypedidos.selectAll();

    if (orders?.length > 0) {
        const obj:any = []; // Inicializando como array
        const promises = orders.map(async (i) => {
            let aux = await useQuerypedidos.selectCompleteOrderByCode(i.codigo);
            obj.push(aux); // Adicionando ao array
        });

        await Promise.all(promises);  
         
        
         console.log(obj);

    } else {
        console.log('nenhum orcamento pronto para o envio');
        Alert.alert('nenhum orcamento pronto para o envio');
    }
}

  return (
    <View style={{ flex: 1 }}>
     
     <Button
      title='press'
      onPress={()=> filterOrders() }
     />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 18,
    marginBottom: 10,
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Cor de fundo com opacidade
  },
});
