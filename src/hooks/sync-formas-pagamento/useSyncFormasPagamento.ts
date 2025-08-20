import { useCallback, useContext, useState } from "react";
import { useProducts } from "../../database/queryProdutos/queryProdutos";
import useApi from "../../services/api";
import { configMoment } from "../../services/moment";
import { useServices } from "../../database/queryServicos/queryServicos";
import { AuthContext } from "../../contexts/auth";
import { cliente, useClients } from "../../database/queryClientes/queryCliente";
import { fpgt, useFormasDePagamentos } from "../../database/queryFormasPagamento/queryFormasPagamento";

type propsSyncData = 
{
data:string,
setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
setItem: React.Dispatch<React.SetStateAction<String | undefined>>
setProgress: React.Dispatch<React.SetStateAction<number>>
}

   export  type servico = {
        codigo:number,
        valor?:number,
        aplicacao:string,
        tipo_serv?:number,
        data_cadastro:string,
        data_recadastro:string 
    }

export const useSyncFormasPagamento = ()=>{
          const { usuario }:any = useContext(AuthContext);
        
              const useQueryFpgt = useFormasDePagamentos();

             const api = useApi();
             const useMoment = configMoment();
         
              /**
               * data: data a ser consultado na api.
               * setIsLoading: seta loading como true, ideal para conponente que exibe carregamento
               * setProgress: seta o valor em porcentagem do progresso de carregamento 
               * setItem: seta o item que esta carregando no momento
               */
             const syncData = useCallback ( async( { data,setIsLoading, setProgress,   setItem }: propsSyncData ) =>{
                 
                  //setErrorProcess(null);
                setProgress(0);
                setItem('Formas de Pagamento');
                setIsLoading(true)
                
                try {
                    
                        const resultApiData = await api.get('/offline/formas_pagamento',  { 
                            params :{
                                 data_recadastro : data,
                                }
                        } );
                        const dados:fpgt[] = resultApiData.data;
                        const totalFormaspagamento = dados.length;
                        if(totalFormaspagamento > 0 ){
                            for (let v = 0; v < totalFormaspagamento; v++) {
                            const verifyClient  = await useQueryFpgt.selectByCode(dados[v].codigo);
                            if (verifyClient && verifyClient.length > 0) {
                                let data_recadastro = useMoment.formatarDataHora( dados[v].data_recadastro ); // Ajuste se necessário
                        
                                console.log(`forma de pagamento : ${data_recadastro } > ${verifyClient[0].data_recadastro}` )

                                if (data_recadastro > verifyClient[0].data_recadastro ) {

                                await useQueryFpgt.update(dados[v], dados[v].codigo );
                                }
                            } else {
                                await useQueryFpgt.create(dados[v] );
                            }
                            const progressPercentage = Math.floor(((v + 1) / totalFormaspagamento) * 100);
                            setProgress(progressPercentage); // Atualiza progresso
                            }
                        }else{
                            console.log("formas de pagamento: ", dados);        
                        }

                        } catch (e) {
                        console.log(e);
                         }finally{
                          setIsLoading(false)
                        }

                  },[])

                  
    return { syncData }
}