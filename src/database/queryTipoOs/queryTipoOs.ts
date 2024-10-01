import { useSQLiteContext } from "expo-sqlite"

export const useTipoOs = ()=> {


const db = useSQLiteContext();

 type tipoOs= {
    codigo:number,
    descricao:string
 }


    async function create(  tipoOs:tipoOs ) {
            try{
                
                let aux:any  = await selectByCode( tipoOs.codigo ); 
                  

                 const result = await  db.runAsync(
                     `
                     INSERT INTO tipos_os 
                     (codigo, descricao     
                     ) values ( ${tipoOs.codigo},'${tipoOs.descricao}')`);
                      console.log('');
                      console.log(result);
                      console.log('');
                      
            }catch( e ){ console.log(e) }
    }


    async function update(tipoOs:tipoOs , code:number) {
        try{
                let aux = await db.runAsync( `UPDATE tipos_os SET  
                        descricao = '${tipoOs.descricao}' 
                        where codigo = ${code} ` 
                    )
                console.log(`tipo_os codigo : ${ code} atualizada com sucesso! `)
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
            let result   = await db.getAllAsync   ( `SELECT * FROM tipos_os WHERE codigo = ${aux} `)
            //console.log(result);
            return result;
        }catch(e){ console.log(`erro ao consultar o tipos_os com o codigo :  ${code}`,e)}
    }

    async function selectAll(){
        try{
            let result = await db.getAllAsync(`SELECT * from tipos_os;`);
          //  console.log(result);
            return result;
        }catch(e){ console.log(e) }
    }  

    return { selectAll, selectByCode, create,update} 

}