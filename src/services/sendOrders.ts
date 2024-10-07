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
import { useServicosPedido } from "../database/queryPedido/queryServicosPedido";
import { configMoment } from "./moment";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

export const buscaPedidos = () => {

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
    const { usuario } = useContext(AuthContext);





 
    async function filterOrders() {

        async function postItem(dados) {
            let aux = await api.post('/pedidos', dados);
            console.log(aux.data);
            console.log('');
            console.log("status:",aux.status);
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
            Alert.alert('nenhum orcamento pronto para o envio');
        }
    }

    return { filterOrders  };
}
