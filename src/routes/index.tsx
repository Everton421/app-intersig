

import { NavigationContainer, useNavigation } from "@react-navigation/native"
import * as React from 'react';
import { MyStack } from "./stack/stack"

import { useContext } from "react"
import { AuthContext } from "../contexts/auth"
import ProdutosProvider from "../contexts/produtosDoOrcamento";
import OrcamentoProvider from "../contexts/orcamentoContext";
import ConnectedProvider, { ConnectedContext } from "../contexts/conectedContext";
import NetInfo from '@react-native-community/netinfo';
import { AuthStack } from "./stack/authStack";

export const Routes = ( )=>{
    const { logado, setLogado, usuario , setUsuario }:any = useContext(AuthContext)
 
    const {connected,  setConnected} = useContext(ConnectedContext)
    

      
    React.useEffect(() => {

     function setConexao(){
        const unsubscribe = NetInfo.addEventListener(state => {
                setConnected(state.isConnected);
                console.log('conexao com a internet :', state.isConnected);
        
           });
        // Remove o listener quando o componente for desmontado
        return () => {
            unsubscribe();
        };
    }
    setConexao();

    }, []);
     
        

    return(
        <NavigationContainer>
          { 
             logado ?
                         <OrcamentoProvider>
                                    <MyStack/> 
                                  {/**     <MyDrawer/> */}
                                    
                       </OrcamentoProvider>
               :
               <AuthStack/>
          }  

   {/**  <MyDrawer/>  */}
        </NavigationContainer> 
         
         
              
    )
}