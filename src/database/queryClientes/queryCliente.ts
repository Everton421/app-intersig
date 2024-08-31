import { useSQLiteContext } from "expo-sqlite";


export const  useClients = ()=>{

type cliente = {
 codigo: number,
 celular: string,   
 cep: string,
 cidade:string,
 cnpj:string,
 endereco:string,    
 ie: string,
 nome: string,
 numero: string
}

    const db = useSQLiteContext();

    async function selectByCode( code:number ) {
        let aux = 0;
        if(isNaN(code)){
            aux = Number(code);
        }else{
            aux = code;
        }
try{
        const result = await db.getAllAsync(` SELECT * FROM clientes where codigo = ${aux}`);
      // console.log(result);
        return result;
    }catch(e){ console.log(`erro ao consultar o produto ${code} `, e)}
    }

    async function selectByCnpjAndCode(  client:cliente ) {
            try{
            const result = await db.getAllAsync(` SELECT * FROM clientes where cnpj = '${client.cnpj}' AND codigo = ${client.codigo}`);
            //console.log(result);
            return result;
        }catch( e ){console.log(`erro ao consultar o cliente ${client.codigo} `, e) }
    }


    async function selectAll( ) {
        try{
        const result = await db.getAllAsync(` SELECT * FROM clientes  `);
        console.log(result);
        return result;
    }catch( e ){ console.log(`erro ao consultar o clientes`,e )} 
    }

    async function selectByDescription( query:any, limit:number){
        try{
              let result =  await db.getAllAsync(
                `   SELECT * FROM clientes WHERE nome like ? or codigo like ? limit ? `, `%${query}%`,`%${query}%`, `${limit}` )
               // console.log(result)
                return result;
            }catch(e){console.log(e)}
        }      

    async function create(client:cliente) {
        try{
            const result = await db.runAsync( 
                ` INSERT INTO clientes (   celular, cep, cidade, cnpj, endereco, ie, nome, numero ) VALUES 
                    (  '${client.celular}', '${client.cep}', '${client.cidade}', '${client.cnpj}', '${client.endereco}', '${client.ie}','${client.nome}', ${client.numero});`
            )
//            console.log(result)
            return result

        }catch(e){ console.log(`erro ao inserir o cliente `,e) }
    } 

    async function update( client:cliente , code:number) {
        try{
            const result = await db.execAsync( 
                ` UPDATE clientes SET celular = '${client.celular}', cep = '${client.cep}', cidade = '${client.cidade}', cnpj = '${client.cnpj}',
                endereco ='${client.endereco}', ie = '${client.ie}', nome = '${client.nome}', numero = '${client.numero}'
                WHERE codigo = ${code}                
                ` 
            )
            console.log('update client code: ', code);
        }catch(e){ console.log( `erro ao atualizar o cliente `,e) }
    }

    async function createByCode(client:cliente) {
            let result:any  ;
            if( client.codigo){
        result  = await selectByCnpjAndCode(client);
                
                    if( result.length > 0 ){
                         let aux = await update(client, client.codigo);
                        return;
                    }else{
                        try{
                        const result = await db.runAsync( 
                            ` INSERT INTO clientes (  codigo, celular, cep, cidade, cnpj, endereco, ie, nome, numero ) VALUES 
                                ( '${client.codigo}', '${client.celular}', '${client.cep}', '${client.cidade}', '${client.cnpj}', '${client.endereco}', '${client.ie}','${client.nome}', ${client.numero});`
                        )
                        console.log( `cliente cadastrado `,result.lastInsertRowId)
                        return;

                    }catch(e){ console.log(`erro ao cadastrar o cliente : ${client.codigo}  `,e) }
                    }
            }else{
                    let result:any  = await create(client)
                    console.log( `cliente cadastrado `, result.lastInsertRowId)
                        return;
            }   
    } 

    async function deleteByCode( code:number ){
        try{
            let result = await db.execAsync(`DELETE FROM clientes WHERE codigo = ${code} `)
            console.log(`clientes codigo: ${code} excluido com sucesso! `)
            console.log( result);
        }catch( e ) { console.log(e) }
    }


    async function deleteAll(){
        try{
            let result = await db.execAsync('DELETE FROM clientes')
            console.log('clientes excluidos ')
            console.log( result);
        }catch( e ) { console.log(e) }
    }

    return {selectByDescription,selectByCode, selectAll, create,createByCode,update,deleteAll, deleteByCode}
}
