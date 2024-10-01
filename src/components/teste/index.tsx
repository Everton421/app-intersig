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
import { orderServices } from '../../services/sync';
import { useVeiculos } from '../../database/queryVceiculos/queryVeiculos';

import moment from 'moment-timezone';
import { configMoment } from '../../services/moment';

export const Teste = () => {
 
    const useQueryProdutos = useProducts();
    const useQueryClientes = useClients();
    const useQueryFpgt = useFormasDePagamentos();
    const useQueryTipoOs = useTipoOs();
    const useQueryServices = useServices();
    const useQueryVeiculos = useVeiculos();
    const useQueryPedidos = usePedidos();
    const servicesPedidos= orderServices();
    
    const useMoment = configMoment()
    
    async function testePedidos(){
        const result = await useQueryPedidos.selectAll() ;
        console.log(result)
      }
        // Captura a data e hora atuais
        const now = moment.tz("America/Sao_Paulo");
        
        
        const formattedDate = useMoment.dataAtual()
        
        let aux = useMoment.formatarData("01/10/2024")
        let aux2 = useMoment.formatarDataHora("2024-10-01 12:11:10")

        return (
          <View style={styles.container}>
            <Text>{formattedDate}</Text>
          
            <Button
            title='press'
            onPress={()=> console.log(aux) }
            />
          </View>

        );
      };
      
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      });
