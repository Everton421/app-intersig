import { useSQLiteContext } from "expo-sqlite"

export const useUsuario = ()=>{

type Usuario = {
    codigo:number,
    nome:string
}

const db = useSQLiteContext();



async function selectAll(){
    try{
        let result = await db.getAllAsync(`SELECT * FROM usuarios `);
        console.log(result);
        return result;
    }catch( e){
        console.log(`erro ao buscar usuarios `, e);
    } 
}


async function selectByCode( code:number ){
    try{
        let result = await db.getAllAsync(`SELECT * FROM usuarios where usuario = ${ code } `);
        console.log(result);
        return result;
    }catch( e){
        console.log(`erro ao buscar usuarios `, e);
    } 
}


async function create ( user:Usuario ){

   let  { codigo , nome } = user;
   
   let verifyUser: any = await selectByCode( codigo );
   
   if(verifyUser.length > 0 ){

    console.log('Usuario', nome,' ja foi cadastrado!');    
   }else{
   
   try{



            let result = await db.runAsync(
                ` INSERT INTO usuarios
                    ( usuario, nome ) VALUES 
            ( ${codigo}, '${nome}'); `);
             console.log('Usuario cadatrado: ',result.lastInsertRowId);
             return result.lastInsertRowId

    }catch(e){
        console.log('Erro ao criar o usuario: ', codigo,' nome: ', nome ,' ', e)
    }
}
}
return  { selectAll, create  } 

}