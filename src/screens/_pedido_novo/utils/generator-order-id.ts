import { useContext } from "react";
import { usePedidos } from "../../../database/queryPedido/queryPedido";
import { AuthContext } from "../../../contexts/auth";
import { configMoment } from "../../../services/moment";


      const { usuario }: any = useContext(AuthContext);


export async function generatorOrderId(){
    
  const useQuerypedidos = usePedidos();

      let arrlasId = await useQuerypedidos.selectLastId();
      let lastId
      if (arrlasId && arrlasId[0]?.id) {
        lastId = arrlasId[0].id
      } else {
        lastId = `0000000000-${usuario.codigo}`
      }

      let codigoGerado = gerarCodigo();
      let id = generatorId(lastId, usuario.codigo);
      return id
}


 
  const gerarCodigo = () => {
      const useMoment = configMoment();
    let data = useMoment.generatorDate();
    let secret = data + usuario.codigo;
    const codigo = parseInt(secret);
    return codigo;
  };

  const generatorId = (code: string, codeComplement: number) => {
      

            let parteNumericaStr = code.split('-')[0]
                     let numero = parseInt(parteNumericaStr, 10);
                        let novoNumero = numero + 1;
            let resultadoFinal = String(novoNumero).padStart(10, '0') + '-'+codeComplement;

            return resultadoFinal

}