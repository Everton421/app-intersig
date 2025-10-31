import { useSQLiteContext } from "expo-sqlite"




export type caracteristica = {
    codigo:number,
    descricao:string,
    unidade:string
     data_cadastro:string,
     data_recadastro:string 
 }

export const useCaracteristica = ()=> {


const db = useSQLiteContext();
 
  
    async function create(  caracteristica:caracteristica ) {
            try{
                let aux:any  = await selectByCode( caracteristica.codigo ); 
                 const result = await  db.runAsync(
                     `
                     INSERT INTO caracteristicas 
                     (codigo, descricao , unidade ,data_cadastro, data_recadastro  
                     ) values ( ${caracteristica.codigo},'${caracteristica.descricao}','${caracteristica.unidade}', '${caracteristica.data_cadastro}','${caracteristica.data_recadastro}' )`);
                      console.log(`caracteristica ${caracteristica.descricao} registrada com sucesso! `)
            }catch( e ){ console.log(`erro ao cadastrar caracteristica `,e) }
    }
 

    async function update(caracteristica:caracteristica , code:number) {
        try{
                let aux = await db.runAsync( `UPDATE caracteristicas SET  
                        descricao = '${caracteristica.descricao}',
                        unidade='${caracteristica.unidade}',
                          data_cadastro ='${caracteristica.data_cadastro}' ,
                         data_recadastro = '${caracteristica.data_recadastro}'
                        where codigo = ${code} ` 
                    )
                console.log(`caracteristica codigo : ${ code} atualizada com sucesso! `)
                  return;
        }catch(e){ console.log(e) }
       
    }

    async function selectByCode( code:number ){
        let aux = 0;
        if( isNaN(code)){
            aux = Number(code);
        }else{
            aux = code ; 
        }
        try{
            let result   = await db.getAllAsync   ( `SELECT * ,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro FROM caracteristicas WHERE codigo = ${aux} `)
            //console.log(result);
            return result;
        }catch(e){ console.log(`erro ao consultar o caracteristica com o codigo :  ${code}`,e)}
    }

    async function selectAll(){
        try{
            let result = await db.getAllAsync(`SELECT *,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro  from caracteristicas;`);
          //  console.log(result);
            return result;
        }catch(e){ console.log( "erro ao buscar as caracteristica ",e) }
    }  



    async function selectByDescription( descricao:string ){
        try{
            let result   = await db.getAllAsync   ( `SELECT * ,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro FROM caracteristicas WHERE descricao like ?   `,  `%${descricao}%` )
            //console.log(result);
            return result;
        }catch(e){ console.log(`erro ao consultar o caracteristica ${descricao} `,e)}
    }
 
    return { selectAll, selectByCode, create,update,selectByDescription  } 
 
}