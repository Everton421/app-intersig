import { Alert } from "react-native";
import { useClients } from "../database/queryClientes/queryCliente";
import { useFormasDePagamentos } from "../database/queryFormasPagamento/queryFormasPagamento";
import { useParcelas } from "../database/queryParcelas/queryParcelas";
import { useItemsPedido } from "../database/queryPedido/queryItems";
import { usePedidos } from "../database/queryPedido/queryPedido";
import { useProducts } from "../database/queryProdutos/queryProdutos";
import { useTipoOs } from "../database/queryTipoOs/queryTipoOs";
import { useVeiculos } from "../database/queryVceiculos/queryVeiculos";
import useApi from "./api";
import { useServicosPedido } from "../database/queryPedido/queryServicosPedido";
import { configMoment } from "./moment";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

export const enviaPedidos = () => {

    const useQueryProdutos = useProducts();
    const useQueryClientes = useClients();
    const useQueryFpgt = useFormasDePagamentos();
    const useQuerypedidos = usePedidos();
    const useQueryParcelas = useParcelas();
    const useQueryItems = useItemsPedido();
    const useQueryTipoOs = useTipoOs();
    const useQueryVeiculos = useVeiculos();

    const useQueryItemsPedido = useItemsPedido();
    const usequeryServicosPedido = useServicosPedido();
    const useMoment = configMoment();  
    const { usuario }:any = useContext(AuthContext);

    const api = useApi();




 
    async function postPedidos() {

        async function postItem(dados) {
            let resultApi:any
            let aux = await api.post('/pedidos', dados);
            if(aux.data ){
                resultApi   = aux.data;
                resultApi.results.forEach(  async ( i:any )=>{
                    if( i !== null ){
                        await useQuerypedidos.updateSentOrderByCode('S',i.codigo)
                    }
                })  
            }
            return resultApi;
        }



        let orders:any = await useQuerypedidos.selectAll();

        if (orders?.length > 0) {

            const obj:any = []; // Inicializando como array
            const promises = orders.map(async (i) => {
                let aux = await useQuerypedidos.selectCompleteOrderByCode(i.codigo);
                obj.push(aux); // Adicionando ao array
            });

            await Promise.all(promises);  
            
              postItem(obj)  
           // console.log(obj[0]);
        } else {
            console.log('nenhum orcamento pronto para o envio');
          //  Alert.alert('nenhum orcamento pronto para o envio');
        }
    }

    return { postPedidos  };
}
