import { Alert } from "react-native";
import { useClients } from "../database/queryClientes/queryCliente";
import { useFormasDePagamentos } from "../database/queryFormasPagamento/queryFormasPagamento";
import { useParcelas } from "../database/queryParcelas/queryParcelas";
import { useItemsPedido } from "../database/queryPedido/queryItems";
import { usePedidos } from "../database/queryPedido/queryPedido";
import { useProducts } from "../database/queryProdutos/queryProdutos";
import { useTipoOs } from "../database/queryTipoOs/queryTipoOs";
import { useVeiculos } from "../database/queryVceiculos/queryVeiculos";
import { api } from "./api";

export const orderServices = () => {
    const useQueryProdutos = useProducts();
    const useQueryClientes = useClients();
    const useQueryFpgt = useFormasDePagamentos();
    const useQuerypedidos = usePedidos();
    const useQueryParcelas = useParcelas();
    const useQueryItems = useItemsPedido();
    const useQueryTipoOs = useTipoOs();
    const useQueryVeiculos = useVeiculos();

    async function filterOrders() {
        async function postItem(dados) {
            let aux = await api.post('/orcamentos/v1', dados);
            console.log(aux.data);
            console.log('');
            console.log("status:",aux.status);
        }

        let orders = await useQuerypedidos.selectAll();

        if (orders?.length > 0) {
            const obj = []; // Inicializando como array
            const promises = orders.map(async (i) => {
                let aux = await useQuerypedidos.selectCompleteOrderByCode(i.codigo);
                obj.push(aux); // Adicionando ao array
            });

            await Promise.all(promises);  
            
              postItem(obj)  
          //  console.log(obj);
        } else {
            console.log('nenhum orcamento pronto para o envio');
            Alert.alert('nenhum orcamento pronto para o envio');
        }
    }

    return { filterOrders };
}
