import { createContext, useState } from "react";


export const ConnectedContext = createContext({
    connected: false,
    setConnected: () => {} // Função vazia por padrão
  });
  

    function ConnectedProvider({ children }:any){
            const [ connected , setConnected ]  = useState <boolean> ( false );

            return (
                <ConnectedContext.Provider value={ { connected , setConnected } }>
                    {children}
                </ConnectedContext.Provider>
            )
    }
export default ConnectedProvider;







