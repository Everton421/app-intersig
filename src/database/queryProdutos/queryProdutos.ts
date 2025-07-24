import { useSQLiteContext } from "expo-sqlite";
import { formatItem } from "../../services/formatStrings";
import { useFotosProdutos } from "../queryFotosProdutos/queryFotosProdutos";

 export type produto = {
        codigo:number,
        estoque?:number,
        preco?:number,
        grupo?:number,
        origem?:string,
        descricao:string,
        ativo?:string,
        sku?:string,
        marca:number,
        class_fiscal:string,
        cst:string,
        num_fabricante:string,
        num_original:string,
        observacoes1:string,
        observacoes2:string,
        observacoes3:string,
        data_cadastro:string,
        data_recadastro:string,
        tipo?:string

    }
    
export const useProducts = ()=>{
 
    const db = useSQLiteContext();
    const formataDados =  formatItem();

    const useQueryFotos = useFotosProdutos()

      
    
        async function selectByCode( codigo:number ) {
            let aux = 0;
            if( isNaN(codigo)){
                aux = Number(codigo);
            }else{
                aux = codigo ; 
            }
                const result = await db.getAllAsync(`SELECT * FROM produtos where codigo = ${codigo}`);
           // console.log(result);
            return result;
          }

          async function selectAll() {
                 const result = await db.getAllAsync(
                  `SELECT * 
                  FROM produtos
                 
                  `);
          //  console.log(result);
                 return result;
          }

          async function selectAllLimit(limit:number) {
            const result = await db.getAllAsync(
             `SELECT * 
             FROM produtos
              limit ${limit}
             `);
     //  console.log(result);
            return result;
     }

          
          async function selectByDescription( query:any, limit:number ) {
            const result = await db.getAllAsync(`SELECT * FROM produtos WHERE  descricao like ? OR codigo like ? LIMIT ?`, `%${query}%`, `%${query}%`,`${limit}` );
          //  console.log(result);
            return result;
             }
     
             async function selectProductAndImgsByDescription( query:any, limit:number ) {
              const result = await db.getAllAsync(
                `SELECT p.codigo, p.descricao, p.preco, p.estoque   FROM produtos as p
                WHERE  p.descricao like ? OR  p.codigo like ? LIMIT ?`, `%${query}%`, `%${query}%`,`${limit}` );
            //  console.log(result);

                  if(result.length > 0 ){
                     result.forEach( async (i)=>{
                          let fotos = await useQueryFotos.selectByCode(i.codigo)
                          if(fotos.length > 0 ){
                            i.fotos = fotos;
                          }else{
                            i.fotos = [];
                          }
                       
                         })
                  }
                  console.log(result)  

                  return result;

               }

            /// cria produto sem Informar o codigo 
            async function create( produto:produto){

              const descricao  = formataDados.normalizeString(produto.descricao)
               const observacoes1 =   formataDados.normalizeString(produto.observacoes1);
               const observacoes2 =   formataDados.normalizeString(produto.observacoes2);
               const observacoes3 =   formataDados.normalizeString(produto.observacoes3);

               const data_recadastro = formataDados.formatDateTime(produto.data_recadastro);
               const data_cadastro = formataDados.formatDate(produto.data_cadastro);


              const result = await db.runAsync( 

                      `INSERT INTO produtos 
                      ( 
                       estoque,
                       preco,
                       grupo,
                       origem,
                       descricao,
                       ativo,
                       sku, 
                       marca, 
                       class_fiscal,
                       cst,
                       num_fabricante,
                       data_cadastro,
                       data_recadastro,
                       observacoes1,
                       observacoes2,
                       observacoes3,
                       tipo  
                       )
                       VALUES
                        (
                         ${produto.estoque},
                         ${produto.preco},
                         ${produto.grupo} ,
                        '${produto.origem}', 
                        '${descricao}',
                        '${produto.ativo}',
                        '${produto.sku}',
                         ${produto.marca}, 
                        '${produto.class_fiscal}',
                        '${produto.cst}', 
                        '${produto.num_fabricante}',
                        '${data_cadastro}',
                        '${data_recadastro}',
                        '${observacoes1}',
                        '${observacoes2}', 
                        '${observacoes3}',
                        '${produto.tipo}'
                            );`
                  );
                  console.log(result);
            }

            
            async function update(produto:produto, code:number ){

              const descricao  = formataDados.normalizeString(produto.descricao)
              const observacoes1 =   formataDados.normalizeString(produto.observacoes1);
              const observacoes2 =   formataDados.normalizeString(produto.observacoes2);
              const observacoes3 =   formataDados.normalizeString(produto.observacoes3);

                const data_recadastro = formataDados.formatDateTime(produto.data_recadastro);
                const data_cadastro = formataDados.formatDate(produto.data_cadastro);

                let verifCode:any[]; 
                try{
                      verifCode = await selectByCode(code);
                      if(verifCode.length > 0 ){
                         // console.log('ja existe produto cadastrado com o codigo ', code );
                        //  console.log(verifCode);
                  let aux = await db.runAsync( 
                      `UPDATE produtos SET  
                      estoque         = ${produto.estoque},  
                      preco           = ${produto.preco},
                      grupo           = ${produto.grupo},  
                      origem          = '${produto.origem}',
                      descricao       = '${descricao}',
                      ativo           = '${produto.ativo}',
                      sku             = '${produto.sku}',    
                      marca           = ${produto.marca},
                      class_fiscal    = '${produto.class_fiscal}',   
                      cst             = '${produto.cst}', 
                      num_fabricante  = '${produto.num_fabricante}',
                      num_original  = '${produto.num_original}',
                      data_cadastro   = '${data_cadastro}',
                      data_recadastro = '${data_recadastro}',
                      observacoes1    = '${observacoes2}', 
                      observacoes2    = '${observacoes2}',
                      observacoes3    = '${observacoes3}',  
                      tipo            = '${produto.tipo}'
                      WHERE codigo =  ${code}`
                      )
                         
                  console.log( 'produto atualizado codigo: ',code)
                          }else{
                            console.log('nao foi encontrado produto com o codigo:', code)
                          }
                }catch(e){ console.log(` Erro ao tentar atualizar o produto codigo: ${code} `,e) }
               
            }

     async function updateByParam(produto:Partial<produto>, code:number ){

                if( produto.descricao )  produto.descricao = formataDados.normalizeString(produto.descricao)
                if( produto.observacoes1 )  produto.observacoes1 =  formataDados.normalizeString(produto.observacoes1);
                if( produto.observacoes2 )  produto.observacoes2 =  formataDados.normalizeString(produto.observacoes2);
                if( produto.observacoes3 )  produto.observacoes3 =  formataDados.normalizeString(produto.observacoes3);
          
                 if( produto.data_recadastro) produto.data_recadastro = formataDados.formatDateTime(produto.data_recadastro);
                 if( produto.data_cadastro) produto.data_cadastro = formataDados.formatDate(produto.data_cadastro);

                let verifCode:any[]; 

                let sql = `UPDATE produtos SET`;
                let conditions =[]
                let values=[]
                  if(produto.estoque){
                    conditions.push(' estoque = ? ');
                    values.push(produto.estoque )
                  }
                  if(produto.preco){
                    conditions.push(' preco = ? ');
                    values.push( produto.preco )
                  }
                  if(produto.grupo){
                    conditions.push(' grupo = ? ');
                    values.push( produto.grupo )
                  }
                  if(produto.origem){
                    conditions.push(' origem = ? ');
                    values.push(`${produto.origem}`)
                  }
                  if(produto.descricao){
                    conditions.push(' descricao = ? ');
                    values.push(`${produto.descricao}`)
                  }
                  if(produto.ativo){
                    conditions.push(' ativo = ? ');
                    values.push(`${produto.ativo}`)
                  }
                  if(produto.sku){
                    conditions.push(' sku = ? ');
                    values.push(`${produto.sku}`)
                  }
                    if(produto.num_original){
                    conditions.push(' num_original = ? ');
                    values.push(`${produto.num_original}`)
                  }
                  if(produto.marca){
                    conditions.push(' marca = ? ');
                    values.push(produto.marca)
                  }
                  if(produto.class_fiscal){
                    conditions.push(' class_fiscal = ? ');
                    values.push(`${produto.class_fiscal}`)
                  }
                  if(produto.cst){
                    conditions.push(' cst = ? ');
                    values.push(`${produto.cst}`)
                  }
                  if(produto.num_fabricante){
                    conditions.push(' num_fabricante = ? ');
                    values.push(`${produto.num_fabricante}`)
                  }
                  if(produto.data_cadastro){
                    conditions.push(' data_cadastro = ? ');
                    values.push(`${produto.data_cadastro}`)
                  }
                  if(produto.data_recadastro){
                    conditions.push(' data_recadastro = ? ');
                    values.push(`${produto.data_recadastro}`)
                  }
                  if(produto.observacoes1){
                    conditions.push(' observacoes1 = ? ');
                    values.push(`${produto.observacoes1}`)
                  }
                  if(produto.observacoes2){
                    conditions.push(' observacoes2 = ? ');
                    values.push(`${produto.observacoes2}`)
                  }
                  if(produto.observacoes3){
                    conditions.push(' observacoes3 = ? ');
                    values.push(`${produto.observacoes3}`)
                  }
                  if(produto.tipo){
                    conditions.push(' tipo = ? ');
                    values.push(`${produto.tipo}`)
                  } 
                  let whereClause = ' WHERE codigo = ? '
                    values.push(code)

                  let finalsql = sql + conditions.join(' , ') + whereClause;
                try{
                      verifCode = await selectByCode(code);
                      if(verifCode.length > 0 ){
                  let aux = await db.runAsync(finalsql,values  )
                         
                  console.log( 'produto atualizado codigo: ',code)
                          }else{
                            console.log('nao foi encontrado produto com o codigo:', code)
                          }
                }catch(e){ console.log(` Erro ao tentar atualizar o produto codigo: ${code} `,e) }
               
            }
            /// cria produto informando  o codigo 
            async function createByCode( produto:produto, code:number ){
              const descricao  = formataDados.normalizeString(produto.descricao)
              const observacoes1 =   formataDados.normalizeString(produto.observacoes1);
              const observacoes2 =   formataDados.normalizeString(produto.observacoes2);
              const observacoes3 =   formataDados.normalizeString(produto.observacoes3);

              const data_recadastro = formataDados.formatDateTime(produto.data_recadastro);
              const data_cadastro = formataDados.formatDate(produto.data_cadastro);

                let verifCode:any[]; 
                try{
                      verifCode = await selectByCode(code);
                      if(verifCode.length > 0 ){
                          console.log('ja existe produto cadastrado com o codigo ', code );
                        //  console.log(verifCode);
                         // return;
                          }
                }catch(e){ console.log(e) }

                  const result = await db.runAsync( 
                      `INSERT INTO produtos 
                      ( 
                      codigo, 
                      estoque,
                      preco,
                      grupo,
                      origem,
                      descricao,
                      ativo,
                      sku,
                      marca,
                      class_fiscal,
                      cst,
                      num_fabricante,
                      num_original,
                      data_cadastro,
                      data_recadastro,
                      observacoes1,
                      observacoes2,
                      observacoes3,
                      tipo  )
                       VALUES
                        ( 
                       ${code} ,
                       ${produto.estoque},
                       ${produto.preco},
                       ${produto.grupo},
                      '${produto.origem}',
                      '${descricao}',
                      '${produto.ativo}',
                      '${produto.sku}', 
                       ${produto.marca},
                      '${produto.class_fiscal}' ,
                      '${produto.cst}',
                      '${produto.num_fabricante}',
                      '${produto.num_original}',
                      '${data_cadastro}',
                      '${data_recadastro}',
                      '${observacoes1}',
                      '${observacoes2}',
                      '${observacoes3}',
                      '${produto.tipo}'
                       );`
                  );
                 // console.log(result);
                  console.log( 'produto cadastrado codigo: ',result.lastInsertRowId)
            }
            
                

            async function deleteByCode( codigo:number ){
                    const statement = await db.prepareAsync(` DELETE FROM produtos WHERE codigo = $codigo`)
                    try{
                        await statement.executeAsync({$codigo:codigo})
                        console.log(' produto deletado com sucesso! ')
                    }catch(e){ console.log(e) }
             }

            async function deleteAll(){
                const statement = await db.prepareAsync(` DELETE FROM produtos`)
                try{
                    await statement.executeAsync()
                    console.log(' produtos deletado com sucesso! ')
                }catch(e){ console.log(e) }
             }



        return { update ,updateByParam ,selectAllLimit,  selectByCode, create, deleteByCode, selectAll, createByCode,deleteAll,selectByDescription ,selectProductAndImgsByDescription }
    }

        
         

