import { useSQLiteContext } from "expo-sqlite";


export const useServices = ()=>{

  function normalizeString(str) {
    if (!str) return str; // Retorna undefined ou null sem alteração
    return str
        .normalize("NFD") // Normaliza para remover acentos
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/['"]/g, ""); // Remove aspas simples e duplas
}

    const db = useSQLiteContext();
 
      type servico = {
        codigo:number,
        valor?:number,
        aplicacao:string,
        tipo_serv?:number,
        data_cadastro:string,
        data_recadastro:string 
    }
    
   
        async function selectByCode( codigo:number ) {
            let aux = 0;
            if( isNaN(codigo)){
                aux = Number(codigo);
            }else{
                aux = codigo ; 
            }
                const result = await db.getAllAsync(`SELECT 
                  *,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro 

                  FROM servicos where codigo = ${codigo}`);
           // console.log(result);
            return result;
          }

          async function selectAll() {
                 const result = await db.getAllAsync(`SELECT *,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro  FROM servicos`);
            console.log(result);
            return result;
          }

          
          async function selectByDescription( query:any, limit:number ) {
            const result = await db.getAllAsync(`
              SELECT * ,
                  strftime('%Y-%m-%d',  data_cadastro) AS data_cadastro,
                  strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro 
          
              FROM servicos WHERE  aplicacao like ? OR codigo like ? LIMIT ?`, `%${query}%`, `%${query}%`,`${limit}` );
          
               //  console.log(result);
            return result;
             }
     

            async function create( servico:servico){

              servico.aplicacao = normalizeString(servico.aplicacao)
             
                try{
                  const result = await db.runAsync( 
                      `INSERT INTO servicos 
                        (
                        valor,
                        aplicacao,
                        tipo_serv,
                        data_cadastro,
                        data_recadastro 
                        )
                       VALUES (
                        ${servico.valor},
                       '${servico.aplicacao}' ,
                        ${servico.tipo_serv} ,
                        '${servico.data_cadastro}' ,
                        '${servico.data_recadastro}'  

                       );`
                    
                    );
                //  console.log(result);
                  console.log(`servico ${servico.codigo} cadastrado com sucesso! `)
                }catch( e ) { 
                    console.log('erro ao cadastrar o servico ' , e )
                }
                }


                async function createByCode2( servico:servico, codigo:number){

                  servico.aplicacao = normalizeString(servico.aplicacao)
                 
                    try{
                      const result = await db.runAsync( 
                          `INSERT INTO servicos 
                            (
                          codigo,
                            valor,
                            aplicacao,
                            tipo_serv,
                            data_cadastro,
                            data_recadastro 
                            )
                           VALUES (
                            ${servico.codigo},
                            ${servico.valor},
                           '${servico.aplicacao}' ,
                            ${servico.tipo_serv} ,
                            '${servico.data_cadastro}' ,
                            '${servico.data_recadastro}'  
    
                           );`
                        
                        );
                    //  console.log(result);
                      console.log(`servico ${servico.codigo} cadastrado com sucesso! `)
                    }catch( e ) { 
                        console.log('erro ao cadastrar o servico ' , e )
                    }
                    }
    
            
            async function updateByCode(servico:servico, code:number ){
                let verifCode:any[]; 
                try{
                      verifCode = await selectByCode(code);
                      if(verifCode.length > 0 ){
                         // console.log('ja existe servico cadastrado com o codigo ', code );
                        //  console.log(verifCode);

                        let aplicacao = normalizeString(servico.aplicacao)
 
             let aux = await db.runAsync( `UPDATE servicos SET  
                    valor = ${servico.valor},
                    aplicacao = '${aplicacao}',
                      data_cadastro ='${servico.data_cadastro}' ,
                        data_recadastro = '${servico.data_recadastro}',
                    tipo_serv = ${servico.tipo_serv} where codigo = ${code} ` 
                )
                        console.log( ` atualizado servico codigo: ${code} `)
                          return;
                          }else{
                            console.log('nao foi encontrado servico com o codigo:', code)
                          }
                }catch(e){ console.log(e) }
               
            }


            async function update ( servico:servico ) {
              try {

                let aplicacao = normalizeString(servico.aplicacao)

                let aux = await db.runAsync( `UPDATE servicos SET  
                  valor = ${servico.valor},
                  aplicacao = '${aplicacao}',
                  data_cadastro ='${servico.data_cadastro}' ,
                        data_recadastro = '${servico.data_recadastro}',
                  tipo_serv = ${servico.tipo_serv} where codigo = ${servico.codigo} ` 
              )

              console.log(`servico ${servico.codigo} atualizado com sucesso !`)
              return aux;
              
              }catch(e){
                console.log('erro ao atualizar o servico', servico.codigo );
              }
            }




            async function createByCode( servico:servico, code:number ){
                let verifCode:any[]; 
                try{
                      verifCode = await selectByCode(code);
                      if(verifCode.length > 0 ){
                          console.log('ja existe servico cadastrado com o codigo ', code );
                        //  console.log(verifCode);
                          return;
                          }
                }catch(e){ console.log(e) }
                servico.aplicacao = normalizeString(servico.aplicacao)

                  const result = await db.runAsync( 
                      
                       `INSERT INTO servicos 
                       (
                       codigo,
                       valor,
                       aplicacao,
                       tipo_serv ,
                       data_cadastro,
                       data_recadastro 
                       )
                      VALUES (
                       ${code},
                       ${servico.valor},
                      '${servico.aplicacao}' ,
                       ${servico.tipo_serv},
                        '${servico.data_cadastro}' ,
                        '${servico.data_recadastro}'  
                      );`

                    );
                //  console.log(result);
                  console.log( 'servico cadastrado codigo: ',result.lastInsertRowId)
            }
            
                

            async function deleteByCode( codigo:number ){
                    const statement = await db.prepareAsync(` DELETE FROM servicos WHERE codigo = $codigo`)
                    try{
                        await statement.executeAsync({$codigo:codigo})
                        console.log(' servico  deletado com sucesso! ')
                    }catch(e){ console.log(e) }
            }

            async function deleteAll(){
                const statement = await db.prepareAsync(` DELETE FROM servicos`)
                try{
                    await statement.executeAsync()
                    console.log(' servicos deletado com sucesso! ')
                }catch(e){ console.log(e) }
        }



        return { update ,  selectByCode,createByCode2, create, deleteByCode, selectAll, createByCode,deleteAll,selectByDescription  }
    }

        
         

