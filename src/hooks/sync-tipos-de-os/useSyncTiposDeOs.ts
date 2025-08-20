import { useCallback, useState } from "react";
import useApi from "../../services/api";
import { configMoment } from "../../services/moment";
import { useVeiculos, Veiculo } from "../../database/queryVceiculos/queryVeiculos";
import { tipoOs, useTipoOs } from "../../database/queryTipoOs/queryTipoOs";

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

export const useSyncTiposDeOs = ()=>{
  const useQueryTipoOs = useTipoOs();

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
                setItem('Tipos de OS');
                setIsLoading(true)
                
                try {
                        const resultApiData = await api.get('/offline/tipo_os',  { 
                            params :{ data_recadastro : data}
                        } );
                        const dados:tipoOs[] = resultApiData.data;
                        const totalTipoOs = dados.length;
                        if(totalTipoOs > 0 ){
                            for (let v = 0; v < totalTipoOs; v++) {
                            const verifyTipoOs  = await useQueryTipoOs.selectByCode(dados[v].codigo);
                            if (verifyTipoOs && verifyTipoOs.length > 0) {
                                let data_recadastro = useMoment.formatarDataHora( dados[v].data_recadastro ); // Ajuste se necessário
                        
                                console.log(`Tipo  de OS  : ${data_recadastro } > ${verifyTipoOs[0].data_recadastro}` )

                                if (data_recadastro > verifyTipoOs[0].data_recadastro ) {

                                await useQueryTipoOs.update(dados[v] , dados[v].codigo);
                                }
                            } else {
                                await useQueryTipoOs.create(dados[v]  );
                            }
                            const progressPercentage = Math.floor(((v + 1) / totalTipoOs) * 100);
                            setProgress(progressPercentage); // Atualiza progresso
                            }
                        }else{
                            console.log("Tipos de OS: ", dados);        
                        }

                        } catch (e) {
                        console.log(e);
                         }finally{
                          setIsLoading(false)
                        }

                  },[])

                  
    return { syncData }
}