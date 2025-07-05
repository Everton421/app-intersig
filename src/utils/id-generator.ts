import { usePedidos } from "../database/queryPedido/queryPedido";



export const generatorId = (code: number, codeComplement: number) => {
      const aux = code.toString().length;

      if (aux < 10) {
            let i = 10 - aux
            let comp = '0'
            while (true) {
                  if (comp.length == i) {
                        break
                  }
                  comp += '0'
            }
            console.log(comp + code + '-' + codeComplement)
      }

}