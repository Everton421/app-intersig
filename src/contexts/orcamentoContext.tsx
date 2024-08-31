import { createContext, useState } from "react";



       export  interface OrcamentoModel  {
            "produtos": [],
            "cliente":{},
            "parcelas":[]
        }
export const OrcamentoContext = createContext({
  orcamento: {
    produtos: [],
    cliente: {},
    parcelas: []
  },
  setOrcamento: (orcamento: OrcamentoModel) => {}
});
    function OrcamentoProvider({ children }:any){
            const [ orcamento , setOrcamento]  = useState  ( {
                "produtos": [],
                "cliente":{},
                "parcelas":[]
            } );

            return (
                <OrcamentoContext.Provider value={ {  orcamento, setOrcamento}}>
                    {children}
                </OrcamentoContext.Provider>
            )
    }
export default OrcamentoProvider;