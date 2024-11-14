import { useSQLiteContext } from "expo-sqlite"

export const queryConfig_api = ()=>{

    const db = useSQLiteContext();

    type ApiConfig = {
        codigo?:number
        url: String,
        porta: number,
        token: String
    }

    async function  select( codigo:number ) {

        try{

            let data = await db.execAsync(
                ` select * from api_config where codigo = ${codigo} `
            )
            return data;

        }catch(e){ console.log(`erro ao consultar as configurações da api `, e )}

    }

    async function update( api:ApiConfig ){
      try{
         await db.runAsync( ` update api_config set  
                     url   ='${api.url}',
                     porta = ${api.porta},
                     token = '${api.token}'
                     where codigo = ${api.codigo}
                    ` )
            }catch(e){ console.log(`Erro ao tentar atualizar as configurações da api `, e)}
        }


 async function create( api:ApiConfig ){

    try{
        let aux = await db.runAsync(
            `INSERT INTO api_config 
            ( codigo, url, porta , token )
             VALUES ( ${api.codigo}, ${api.porta}, '${api.token}','${api.url}' ) 
            `)
            return aux;
    } catch ( e) { console.log(' erro ao cadastrar a configuracao da api ',e)} 
    
 }

    return { select, update , create}
}