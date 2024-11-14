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
import { configMoment } from '../../services/moment';
import { useItemsPedido } from '../../database/queryPedido/queryItems';
import { useServicosPedido } from '../../database/queryPedido/queryServicosPedido';
import { useParcelas } from '../../database/queryParcelas/queryParcelas';

import { VictoryBar, VictoryChart,VictoryPie, VictoryTheme, Bar, CartesianChart } from "victory-native";

const LoadingData = ({ isLoading, item , progress }) => (
  <Modal animationType='slide' transparent={true} visible={isLoading}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="red" />
      <Text style={styles.loadingText}>Carregando  {item} ... {progress}%</Text>
      <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  </Modal>
);

export const Grafico = () => {
  const { connected } = useContext(ConnectedContext);
  const { usuario } = useContext(AuthContext);

  const useQueryProdutos = useProducts();
  const useQueryClientes = useClients();
  const useQueryFpgt = useFormasDePagamentos();
  const useQueryTipoOs = useTipoOs();
  const useQueryServices = useServices();
  const useQuerypedidos = usePedidos();
  const useQueryItemsPedido = useItemsPedido();
  const usequeryServicosPedido = useServicosPedido();
  const useQueryParcelas = useParcelas();


  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState([]);
  const [ item , setItem ] = useState<String>();



  const formataDados =  formatItem();
  const useMoment = configMoment();  


   
  const aux = [
    { x: 'FI',  y: 5000 },
    { x: 'EA',  y: 3000 },
    { x: 'RE',  y: 2000 },
    { x: 'AI',  y: 19000 }
  ];
  
 
    

  return (
   
      <VictoryPie 
      width={250}
       theme={VictoryTheme.material}
       data={aux}
       animate={{
        duration: 2000
      }}
      />


 
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
