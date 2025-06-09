import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
 

const useApi = () => {
    const { usuario }:any = useContext(AuthContext);

 

    const api = axios.create({
            //url teste local
            //  baseURL: "http://192.168.100.179:3000/v1/",
                    baseURL: "https://server.intersig.com.br:3000/v1/",
                    //baseURL:"https://template-api-nu.vercel.app/v1/",
                 
    });

    // Interceptor para adicionar headers dinâmicosz
    api.interceptors.request.use(
        async (config) => {
            // Adiciona o CNPJ se o usuário estiver definido
            if (usuario && usuario.token) {
                config.headers["token"] = usuario.token;
            }
//config.headers["authorization"] = `token h43895jt9858094bun6098grubn48u59dsgfg234543tf `;
                
            return config;
        },

        (error) => {
            return Promise.reject(error);
        }
    );

    return api;
};

export default useApi;

