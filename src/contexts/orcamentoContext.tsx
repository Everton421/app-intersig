import { createContext, useState } from "react";

const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se o mês for menor que 10
    const day = String(now.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se o dia for menor que 10

    return `${year}-${month}-${day}`;
  };
  
  let data_atual = getCurrentDate();

       export  interface OrcamentoModel  {
            "produtos": [],
            "cliente":{},
            "parcelas":[],
            "servicos":[],
            "data_cadastro":string,
            "data_recadastro":string,
            "total_produtos": number,
            "total_servicos":  number,
            "contato": `react-native `,
            "total_geral": number,
            "descontos": number,  
            "vendedor":number
        }
export const OrcamentoContext = createContext({
  orcamento: {
    produtos: [],
    cliente:  { codigo:0},
    parcelas: [],
     servicos :[],
    data_cadastro: "",
    data_recadastro: "",
     total_produtos : 0,
     total_servicos :  0,
     contato : `react-native `,
     total_geral : 0,
     descontos : 0,  
     vendedor :0,
     observacoes :   "",
     quantidade_parcelas : 0,
     enviado : "N",
     situacao : "EA",
     veiculo : 0,
     tipo_os : 0,
     tipo : 0,

  },
  setOrcamento: (orcamento: any) => {}
});
    function OrcamentoProvider({ children }:any){
            const [ orcamento , setOrcamento]  = useState  ( {
                "produtos": [],
                "cliente":{},
                "parcelas":[],
                "servicos":[],
                "data_cadastro": "",
                "data_recadastro": "",
               "total_produtos": 0,
              "total_servicos":  0,
              "contato": `react-native `,
              "total_geral": 0,
              "descontos": 0,  
              "vendedor":0,
              "observacoes":   "",
              "quantidade_parcelas": 0,
              "enviado": "N",
              "situacao": "EA",
              "veiculo": 0,
              "tipo_os": 0,
              "tipo": 0,
              } );

            return (
                <OrcamentoContext.Provider value={ {  orcamento, setOrcamento}}>
                    {children}
                </OrcamentoContext.Provider>
            )
    }
export default OrcamentoProvider;