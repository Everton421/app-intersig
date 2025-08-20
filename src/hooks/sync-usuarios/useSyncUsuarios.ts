import { useCallback, useContext, useState } from "react";
import { useProducts } from "../../database/queryProdutos/queryProdutos";
import useApi from "../../services/api";
import { configMoment } from "../../services/moment";
import { useServices } from "../../database/queryServicos/queryServicos";
import { AuthContext } from "../../contexts/auth";
import { cliente, useClients } from "../../database/queryClientes/queryCliente";
import { fpgt, useFormasDePagamentos } from "../../database/queryFormasPagamento/queryFormasPagamento";
import { useUsuario } from "../../database/queryUsuario/queryUsuario";

type propsSyncData = 
{
data:string,
setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
setItem: React.Dispatch<React.SetStateAction<String | undefined>>
setProgress: React.Dispatch<React.SetStateAction<number>>
}

  
type Usuario = {
    codigo:number,
    nome:string,
    senha:string,
    email:string
    token:string,
    lembrar:string
}

export const useSyncUsuarios = ()=>{
          const useQueryUsuario = useUsuario();

             const api = useApi();
         
              /**
               * data: data a ser consultado na api.
               * setIsLoading: seta loading como true, ideal para conponente que exibe carregamento
               * setProgress: seta o valor em porcentagem do progresso de carregamento 
               * setItem: seta o item que esta carregando no momento
               */
             const syncData = useCallback ( async( { data,setIsLoading, setProgress,   setItem }: propsSyncData ) =>{
                 
                  //setErrorProcess(null);
                setProgress(0);
                setItem('Usuários');
                setIsLoading(true)
                
                try {
                    
                        const resultApiData = await api.get('/usuarios',  { 
                            params :{
                                 data_recadastro : data,
                                }
                        } );
                        const dados:Usuario[] = resultApiData.data;
                        const totalFormaspagamento = dados.length;
                        if(totalFormaspagamento > 0 ){
                            for (let v = 0; v < totalFormaspagamento; v++) {
                            const verifyUser  = await useQueryUsuario.selectByCode(dados[v].codigo);
                      
                            if( verifyUser && verifyUser.length > 0 ){
                                await useQueryUsuario.create(dados[v] );

                            } 
                            const progressPercentage = Math.floor(((v + 1) / totalFormaspagamento) * 100);
                            setProgress(progressPercentage); // Atualiza progresso
                            }
                        }else{
                            console.log("Usuários: ", dados);        
                        }

                        } catch (e) {
                        console.log(e);
                         }finally{
                          setIsLoading(false)
                        }

                  },[])

                  
    return { syncData }
}