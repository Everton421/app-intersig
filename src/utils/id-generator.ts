import { usePedidos } from "../database/queryPedido/queryPedido";



export const generatorId = ()=>{
      const useQuerypedidos = usePedidos();
    
      const ultimoIten = useQuerypedidos.selectLastId();

            

}