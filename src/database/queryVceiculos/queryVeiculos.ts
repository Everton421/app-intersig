import { useSQLiteContext } from "expo-sqlite"

export type  Veiculo = {
    codigo : number,
    cliente : number,
    placa :  String,
    marca : number,
    modelo : number,
    ano :  String,
    cor : number,
    combustivel :String,
    data_cadastro:string,
    data_recadastro:string 
   ativo?: 'S'|'N'

}


export const useVeiculos = ()=>{
 
const db = useSQLiteContext();



async function selectAll(){
    try{
        let result = await db.getAllAsync(`SELECT * ,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro  FROM veiculos `);
        //console.log(result);
        return result;
    }catch( e){
        console.log(`erro ao buscar veiculos `, e);
    } 
}
 

async function selectByCode( code:number ):Promise<Veiculo[] | undefined>{
    try{
        let result:Veiculo[] = await db.getAllAsync(`SELECT *,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro  FROM veiculos where codigo = ${ code } `);
       // console.log(result);
        return result;
    }catch( e){
        console.log(`erro ao buscar veiculo codigo : ${ code }`, e);
    } 
}

async function selectByClient( cliente:number ){
    try{
        let result = await db.getAllAsync(`SELECT * ,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro  FROM veiculos where cliente = '${ cliente }' `);
        //console.log(result);
        return result;
    }catch( e){
        console.log(`erro ao buscar veiculos do cliente ${cliente} `, e);
    } 
}

async function update(veiculo:Veiculo ){
    try{

        let result = await db.runAsync(
            `
            UPDATE veiculos SET 
            cliente = ${veiculo.cliente}, 
            placa = '${veiculo.placa}',
            marca =  '${veiculo.marca}',
            modelo = '${veiculo.modelo}',
            ano = '${veiculo.ano}',
            cor = '${veiculo.cor}',
            data_cadastro ='${veiculo.data_cadastro}' ,
            data_recadastro = '${veiculo.data_recadastro}',
            combustivel = '${veiculo.combustivel}'
             WHERE codigo = ${veiculo.codigo}
              `
        )

        console.log(` atualizado veiculo codigo: ${veiculo.codigo} `  );
        console.log('')
    }catch(e   ){ console.log( `erro ao  Veiculo ${ veiculo.codigo}  ` , e )}
}

 
async function create( veiculo:Veiculo ){
    try{

        let result = await db.runAsync(
            `
            INSERT INTO veiculos 
           (
            codigo,
            cliente,
            placa,
            marca,
            modelo,
            ano,
            cor,
            combustivel,
            data_cadastro,
            data_recadastro 
            ) VALUES (
            ${veiculo.codigo},
            ${veiculo.cliente},
            '${veiculo.placa}',
            '${veiculo.marca}',
            '${veiculo.modelo}',
            '${veiculo.ano}',
            '${veiculo.cor}',
            '${veiculo.combustivel}',
            '${veiculo.data_cadastro}',
            '${veiculo.data_recadastro}'           
            );`
        )

        console.log(`veicuLo codigo ${veiculo.codigo} registrado com sucesso `);
    }catch(e   ){ console.log( `erro ao inserir veicuLo codigo ${veiculo.codigo}` , e )}
}

async function selectByDescription( query:any, limit:number ) {
    const result = await db.getAllAsync(`SELECT *,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro  FROM veiculos WHERE  placa like ? OR codigo like ? LIMIT ?`, `%${query}%`, `%${query}%`,`${limit}` );
    return result;
     }


async function createVeiculo( veiculo:Veiculo ){

    let verifyVeic: any = await selectByCode( veiculo.codigo );
          
     if(verifyVeic.length > 0 ){
            await update(veiculo)
         }else{
            await create(veiculo)
         }
 }


return {   selectAll, create,selectByClient, selectByCode, update, createVeiculo, selectByDescription } 
}