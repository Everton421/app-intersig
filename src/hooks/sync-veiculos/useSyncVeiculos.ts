import { useCallback, useState } from "react";
import useApi from "../../services/api";
import { configMoment } from "../../services/moment";
import { useVeiculos, Veiculo } from "../../database/queryVceiculos/queryVeiculos";

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

export const useSyncVeiculos = ()=>{
     const useQueryVeiculos = useVeiculos();

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
                setItem('Veículos');
                setIsLoading(true)
                
                try {
                    
                        const resultApiData = await api.get('/offline/veiculos',  { 
                            params :{ data_recadastro : data}
                        } );
                        const dados:Veiculo[] = resultApiData.data;
                        const totalVeiculos = dados.length;
                        if(totalVeiculos > 0 ){
                            for (let v = 0; v < totalVeiculos; v++) {
                            const verifyVeic  = await useQueryVeiculos.selectByCode(dados[v].codigo);
                            if (verifyVeic && verifyVeic.length > 0) {
                                let data_recadastro = useMoment.formatarDataHora( dados[v].data_recadastro ); // Ajuste se necessário
                        
                                console.log(`Veículo  : ${data_recadastro } > ${verifyVeic[0].data_recadastro}` )

                                if (data_recadastro > verifyVeic[0].data_recadastro ) {

                                await useQueryVeiculos.update(dados[v] );
                                }
                            } else {
                                await useQueryVeiculos.create(dados[v]  );
                            }
                            const progressPercentage = Math.floor(((v + 1) / totalVeiculos) * 100);
                            setProgress(progressPercentage); // Atualiza progresso
                            }
                        }else{
                            console.log("Veículos: ", dados);        
                        }

                        } catch (e) {
                        console.log(e);
                         }finally{
                          setIsLoading(false)
                        }

                  },[])

                  
    return { syncData }
}