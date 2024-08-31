import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Modal, Text, View } from "react-native";
import { useProducts } from '../../database/queryProdutos/queryProdutos';
import { api } from '../../services/api';
import NetInfo from '@react-native-community/netinfo';
import { ConnectedContext } from '../../contexts/conectedContext';
import { useClients } from '../../database/queryClientes/queryCliente';
import { useFormasDePagamentos } from '../../database/queryFormasPagamento/queryFormasPagamento';
import { usePedidos } from '../../database/queryPedido/queryPedido';
import { TextInput } from 'react-native-gesture-handler';
import * as Crypto from 'expo-crypto';
import { useParcelas } from '../../database/queryParcelas/queryParcelas';
import { Produto } from '../../screens/dados/produtos';
import { OrcamentoContext } from '../../contexts/orcamentoContext';
import { useItemsPedido } from '../../database/queryPedido/queryItems';
import { Cart } from '../../screens/orcamento/components/Cart';
 
export const ItemSQLITE = () => {
  const [sync, setSync] = useState(false);
  const db = useSQLiteContext();
  const { connected } = useContext(ConnectedContext);

  const useQueryProdutos = useProducts();
  const useQueryClientes = useClients();
  const useQueryFpgt = useFormasDePagamentos();
  const useQuerypedidos = usePedidos();
  const useQueryParcelas = useParcelas();
  const useQueryItems = useItemsPedido();

  const { orcamento, setOrcamento } = useContext(OrcamentoContext);

  const [codigoUsuario, setCodigoUsuario] = useState('12345');


 
      
  type pedido ={ 
    codigo?:number,
    descontos:number,
    forma_pagamento:number,
    observacoes:string,
    quantidade_parcelas:number,
    total_geral:number,
    total_produtos:number,
    cliente:number ,
    produtos:Produto[],
    parcelas:parcela[] 
}




  type parcela = {
    pedido:number,
    parcela:number,
    valor:number,
    vencimento:string
} 

let parcela1:parcela = {
'parcela':1,
'pedido':555,
'valor':2,
'vencimento':'2024-08-02'
}


let teste1:any  =  {
    'cliente':{ 'codigo':3756},
    'situacao':'EA',
    'descontos':0,
    'forma_pagamento':1,
    'observacoes':'ss',
    'quantidade_parcelas':1,
    'total_geral':1000,
    'total_produtos':2,
    'data_cadastro':'2024-08-29',
  'produtos':[
    {
     'codigo': 1120 ,
     'desconto': 0,
     'quantidade': 1, 
     'preco': 10,
     'total': 10
   }
 ],
  "parcelas": [
     {
     'parcela':1,
     'valor':2,
     'vencimento':'2024-08-02'
     }
  ]
  }

async function insertpedido(){
   let aux:number | undefined = await useQuerypedidos.createOrder(teste1);
}

async function deletepedido(){
  let aux:number | undefined = await useQuerypedidos.deleteAllOrder();
}


async function filterOrders(){
  let aux:any= await useQuerypedidos.selectCompleteOrderByCode(1725020909148);
  console.log(aux)
}
async function filterAllOrders(){
  let aux:any= await useQuerypedidos.selectAll();
  console.log(aux)
}
async function filterProducts( ){
  let aux:any= await useQueryItems.selectByCodeOrder(1724965227920);
  console.log(aux)
}
let aux:any[] = [
  {'codigo':1,'nome':'teste1', 'quantidade':0 },
  {'codigo':2,'nome':'teste2', 'quantidade':0 },
  {'codigo':3,'nome':'teste3', 'quantidade':0 },
  {'codigo':4,'nome':'teste4', 'quantidade':0 },
]
 

  return (
    <View style={styles.container}>
 
      
      <Text>Status internet: {connected ? 'Conectado' : 'Desconectado'}</Text>
 

    
        <Cart data={ aux}/>

    </View>
  );
}

const styles = {
  container: {
   flex:1
  },
  
};
