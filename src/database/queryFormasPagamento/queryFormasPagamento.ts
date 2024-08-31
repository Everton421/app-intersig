import { useSQLiteContext } from "expo-sqlite"

export const useFormasDePagamentos = ()=> {


const db = useSQLiteContext();

type fpgt = {
         codigo : number, 
		 descricao : string,   
		 desc_maximo : number,   
		 parcelas : number,   
		 intervalo : number,   
		 recebimento : number,   
}

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
                     (codigo,descricao, desc_maximo, parcelas, intervalo, recebimento  
                     ) values ( ${forma.codigo},'${forma.descricao}',  ${forma.desc_maximo},  ${forma.parcelas},  ${forma.intervalo}, ${forma.recebimento} );`);

                      console.log('');
                      console.log(result);
                      console.log('');
                     }
            }catch( e ){ console.log(e) }
    }

    async function selectByCode( code:number ){
        let aux = 0;
        if( isNaN(code)){
            aux = Number(code);
        }else{
            aux = code ; 
        }
        try{
            let result   = await db.getAllAsync   ( `SELECT * FROM forma_pagamento WHERE codigo = ${aux} `)
            //console.log(result);
            return result;
        }catch(e){ console.log(`erro ao consultar a forma de pagamento com o codigo :  ${code}`,e)}
    }

    async function selectAll(){
        try{
            let result = await db.getAllAsync(`SELECT * from forma_pagamento;`);
            console.log(result);
            return result;
        }catch(e){ console.log(e) }
    }  

    return { selectAll, selectByCode, create} 

}