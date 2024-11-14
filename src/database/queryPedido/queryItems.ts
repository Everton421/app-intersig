import { useSQLiteContext } from "expo-sqlite"

export const useItemsPedido = () =>{

const db = useSQLiteContext();

type produto_pedido = {
    
    codigo:number,
    desconto:number,
    quantidade:number,
    preco:number,
    total:number 
}
        async function create(produto:produto_pedido, codeOrder:number){
            try{
 
                let result = await db.runAsync(
                    `
                    INSERT INTO produtos_pedido 
                   (
                    pedido,
                    codigo,
                    desconto,
                    quantidade,
                    preco,
                    total 
                    ) VALUES (
                    ${codeOrder},
                    ${produto.codigo},
                    ${produto.desconto},
                    ${produto.quantidade},
                    ${produto.preco},
                    ${produto.total} 
                    ) `
                )

                console.log(`produto inserido com sucesso para o orcamento codigo ${codeOrder} ${produto.codigo} `  );
            }catch(e   ){ console.log( `erro ao inserir produto do orcamento` , e )}
        }


        async function selectByCodeOrder( codeOrder:number ){
            try{

                const result = await db.getAllAsync(` SELECT pp.codigo , pp.pedido, pp.desconto, pp.preco, pp.quantidade, pp.total,
                                                        p.descricao

                                                        FROM produtos_pedido as pp
                                                        JOIN produtos as p on p.codigo = pp.codigo
                                                        WHERE pp.pedido = ${codeOrder}`)

                return result;
            }catch(e){console.log( `Erro ao consultar os produtos do pedido codigo: ${codeOrder} `, e )}
        }


        async function selectAll(  ){
            try{
                 const result = await db.getAllAsync(` SELECT pp.codigo , pp.pedido,  pp.desconto, pp.preco, pp.quantidade, pp.total,
                                                         p.descricao
 
                                                         FROM produtos_pedido pp
                                                         JOIN produtos p on p.codigo = pp.codigo
                                                         `)
                    
              //  console.log(result);
                return result;
            }catch(e){console.log(e)}
        }

        async function deleteByCodeOrder( code:number){
               try{
                   await db.runAsync(` DELETE from produtos_pedido where pedido = ${code}`)
                   console.log(`deletado itens do orcamento codigo: ${code}`)
                    return true;
                }catch(e){
                    console.log(e)
                    return false;
                }
        
            }

            async function selectProductByCodeOrder( codigoProduto:number, code:number){
                try{
                    let aux = await db.getAllAsync(`
                        SELECT pp.codigo , pp.pedido,  pp.desconto, pp.preco, pp.quantidade, pp.total, p.descricao
                                                         FROM produtos_pedido pp
                                                         JOIN produtos p on p.codigo = pp.codigo
                                                         where pp.pedido = ${code}
                                                            AND pp.codigo = ${codigoProduto}  `)
                        
                        
                     return aux;
                 }catch(e){
                     console.log(` Erro ao filtrar o produto ${codigoProduto } do orcamento ${code}`, e)
                 }
         
             }
 

            async function deleteProductByCodeOrder(  codigoProduto:number , code:number){
                try{
                    await db.runAsync(` DELETE from produtos_pedido where  codigo = ${codigoProduto} AND pedido = ${code}`)
                    console.log(`deletado iten  ${codigoProduto} do orcamento codigo: ${code}`)
                     return true;
                 }catch(e){
                     console.log(e)
                     return false;
                 }
         
             }



             async function update(produto , codeOrder:number){
                try{
     
                    let result = await db.runAsync(
                        `
                        UPDATE produtos_pedido SET 
                        desconto = ${produto.desconto}, 
                        quantidade = ${produto.quantidade},
                        preco =     ${produto.preco},
                        total = ${produto.total} 
                         WHERE codigo = ${produto.codigo}
                          AND pedido = ${codeOrder}
                          `
                    )
    
                    console.log('')
                    console.log(`produto ${produto.codigo} atualizado para o orcamento numero:  ${codeOrder}  `  );
                    console.log('')
                }catch(e   ){ console.log( `erro ao atualizar produto ${ produto.codigo} do orcamento` , e )}
            }

        return { selectByCodeOrder, selectProductByCodeOrder,  create ,deleteByCodeOrder,selectAll ,deleteProductByCodeOrder, update}

}