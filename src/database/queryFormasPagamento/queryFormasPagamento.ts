import { useSQLiteContext } from "expo-sqlite"

export type fpgt = {
         codigo : number, 
		 descricao : string,   
		 desc_maximo : number,   
		 parcelas : number,   
		 intervalo : number,   
		 recebimento : number,   
         data_cadastro:string,
         data_recadastro:string 
}

export const useFormasDePagamentos = ()=> {


const db = useSQLiteContext();



    async function create( forma:fpgt  ) {
            try{
                
                let aux:any  = await selectByCode( forma.codigo ); 
                     if( aux.length  > 0 ){
                         console.log(` o item ${ forma.codigo } ja foi cadastrado!` )
                         return;
                     }else{

                 const result = await  db.runAsync(
                     `
                     INSERT INTO forma_pagamento 
                     (codigo,descricao, desc_maximo, parcelas, intervalo, recebimento ,  data_cadastro, data_recadastro 
                     ) values ( ${forma.codigo},'${forma.descricao}',  ${forma.desc_maximo},  ${forma.parcelas},  ${forma.intervalo}, ${forma.recebimento},'${forma.data_cadastro}',  '${forma.data_recadastro}' );`);

                      return result.lastInsertRowId;
                     }
            }catch( e ){ console.log(e) }
    }


    async function update(forma:fpgt, code:number) {
        let verifCode:any; 
        try{
              verifCode = await selectByCode(code);
              if(verifCode.length > 0 ){
                 // console.log('ja existe servico cadastrado com o codigo ', code );
                //  console.log(verifCode);
     let aux = await db.runAsync( `UPDATE forma_pagamento SET  
            descricao = '${forma.descricao}',
            desc_maximo = ${forma.desc_maximo},
            parcelas = ${forma.parcelas},
            intervalo = ${forma.intervalo},
             data_cadastro ='${forma.data_cadastro}' ,
             data_recadastro = '${forma.data_recadastro}',
            recebimento =  ${forma.recebimento}
            where codigo = ${code} ` 
        )
                console.log(`forma de pagamento codigo : ${ code} atualizada com sucesso! `)

                  return;
                  }else{
                    console.log('nao foi encontrado forma_pagamento com o codigo:', code)
                  }
        }catch(e){ console.log(e) }
       
    }

    async function selectByCode( code:number ):Promise<fpgt[] | undefined >{
        let aux = 0;
        if( isNaN(code)){
            aux = Number(code);
        }else{
            aux = code ; 
        }
        try{
            let result:fpgt[]   = await db.getAllAsync   ( `SELECT *   ,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro 
                   FROM forma_pagamento WHERE codigo = ${aux} `) 
            //console.log(result);
            return result;
        }catch(e){ console.log(`erro ao consultar a forma de pagamento com o codigo :  ${code}`,e)}
    }


    async function selectByDescription( descricao:string ){
        try{
            let result   = await db.getAllAsync   ( `SELECT *   ,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro 
                   FROM forma_pagamento WHERE descricao like  ? `, `%${descricao}%`)
            //console.log(result);
            return result;
        }catch(e){ console.log(`erro ao consultar a forma de pagamento  :  ${descricao}`,e)}
    }


    async function selectAll(){
        try{
            let result = await db.getAllAsync(`SELECT *  ,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro 
                from forma_pagamento;`);
           // console.log(result);
            return result;
        }catch(e){ console.log(e) }
    }  

    return { selectAll, selectByCode, create,update, selectByDescription} 

}