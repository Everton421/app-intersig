import { useSQLiteContext } from "expo-sqlite"

export const useServicosPedido = () =>{

const db = useSQLiteContext();

type servico_pedido = {
    codigo:number,
    desconto:number,
    quantidade:number,
    valor:number,
    total:number 
}
        async function create(servico:servico_pedido, codeOrder:number){
            try{
 
                let result = await db.runAsync(
                    `
                    INSERT INTO servicos_pedido 
                   (
                    pedido,
                    codigo,
                    desconto,
                    quantidade,
                    valor,
                    total 
                    ) VALUES (
                    ${codeOrder},
                    ${servico.codigo},
                    ${servico.desconto},
                    ${servico.quantidade},
                    ${servico.valor},
                    ${servico.total} 
                    ) `
                )

                console.log('')
                console.log(`produto inserido com sucesso para o orcamento codigo ${codeOrder} ${produto.codigo} `  );
                console.log('')
            }catch(e   ){ console.log( `erro ao inserir produto do orcamento` , e )}
        }


        async function selectByCodeOrder( codeOrder:number ){
            try{
                const result = await db.getAllAsync(` SELECT sp.codigo , sp.pedido, sp.desconto, sp.valor, sp.quantidade, sp.total,
                                                        s.aplicacao

                                                        FROM servicos_pedido as sp
                                                        JOIN servicos as s on s.codigo = sp.codigo
                                                        WHERE sp.pedido = ${codeOrder}`)

                return result;
            }catch(e){console.log(e)}
        }


        async function selectAll(  ){
            try{
                 const result = await db.getAllAsync(` SELECT sp.codigo , sp.pedido, sp.desconto, sp.valor, sp.quantidade, sp.total,
                                                        s.aplicacao
 
                                                         FROM servicos_pedido sp
                                                         JOIN servicos s on s.codigo = sp.codigo
                                                         `)
                    
              //  console.log(result);
                return result;
            }catch(e){console.log(e)}
        }

        async function deleteByCodeOrder( code:number){
               try{
                   await db.runAsync(` DELETE from servico_pedido where pedido = ${code}`)
                   console.log(`deletado servico do orcamento codigo: ${code}`)
                    return true;
                }catch(e){
                    console.log(e)
                    return false;
                }
        
            }



        return { selectByCodeOrder, create ,deleteByCodeOrder,selectAll }

}