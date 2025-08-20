import { useCallback, useState } from "react";
import { useProducts } from "../../database/queryProdutos/queryProdutos";
import useApi from "../../services/api";
import { configMoment } from "../../services/moment";
import { useServices } from "../../database/queryServicos/queryServicos";

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

export const useSyncServices = ()=>{
         const useQueryServicos = useServices();


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
                setItem('Serviços');
                setIsLoading(true)
                
                try {
                    
                        const resultApiData = await api.get('/offline/servicos',  { 
                            params :{ data_recadastro : data}
                        } );
                        const dados:servico[] = resultApiData.data;
                        const totalServicos = dados.length;
                        if(totalServicos > 0 ){
                            for (let v = 0; v < totalServicos; v++) {
                            const verifyService  = await useQueryServicos.selectByCode(dados[v].codigo);
                            if (verifyService.length > 0) {
                                let data_recadastro = useMoment.formatarDataHora( dados[v].data_recadastro ); // Ajuste se necessário
                        
                                console.log(`Servicos : ${data_recadastro } > ${verifyService[0].data_recadastro}` )

                                if (data_recadastro > verifyService[0].data_recadastro ) {

                                await useQueryServicos.update(dados[v] );
                                }
                            } else {
                                await useQueryServicos.createByCode(dados[v], dados[v].codigo );
                            }
                            const progressPercentage = Math.floor(((v + 1) / totalServicos) * 100);
                            setProgress(progressPercentage); // Atualiza progresso
                            }
                        }else{
                            console.log("Servicos: ", dados);        
                        }

                        } catch (e) {
                        console.log(e);
                         }finally{
                          setIsLoading(false)
                        }

                  },[])

                  
    return { syncData }
}