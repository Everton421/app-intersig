import { useSQLiteContext } from "expo-sqlite"
import { useItemsPedido } from "./queryItems";
import { useParcelas } from "../queryParcelas/queryParcelas";
import { useProducts } from "../queryProdutos/queryProdutos";
import { useClients } from "../queryClientes/queryCliente";
import { useServicosPedido } from "./queryServicosPedido";


export const usePedidos = () =>{

    const db =  useSQLiteContext();
  const queryItems          = useItemsPedido();
  const queryParcelas       = useParcelas(); 
  const queryProdutos       = useProducts();
  const queryClientes       = useClients();
  const queryServicosPedido =  useServicosPedido();
      
  type produto_pedido = {
        codigo:number,
        desconto:number,
        quantidade:number,
        preco:number,
        total:number 
    }
    type parcela = {
      pedido:number,
      parcela:number,
      valor:number,
      vencimento:string
    } 
    type servico_pedido = {
      codigo:number,
      desconto:number,
      quantidade:number,
      valor:number,
      total:number 
  }
  type pedido ={ 
    codigo?:number,
    situacao:string,
    descontos:number,
    vendedor:number,
    forma_pagamento:number,
    observacoes:string,
    quantidade_parcelas:number,
    total_geral:number,
    total_produtos:number,
    total_servicos:number,
    cliente:number ,
    produtos:produto_pedido[],
    parcelas:parcela[], 
    data_cadastro:string,
    tipo:number
}

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se o mês for menor que 10
  const day = String(now.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se o dia for menor que 10

  return `${year}-${month}-${day}`;
};

    async function create( pedido:pedido ){

      let data = getCurrentDate();
      pedido.situacao = 'EA';
      try{
        console.log(  ` INSERT INTO pedidos 
          (
          codigo,
          situacao,
          vendedor,
          descontos,
          forma_pagamento,
          observacoes,
          quantidade_parcelas,
          total_geral,
          total_produtos,
          total_servicos,
          cliente,
          data_cadastro,
          tipo  
          ) VALUES (
           ${ pedido.codigo}, 
           '${ pedido.situacao}',
            ${ pedido.vendedor},
           ${ pedido.descontos},
          ${ pedido.forma_pagamento},
          '${ pedido.observacoes}',
          ${ pedido.quantidade_parcelas},
          ${ pedido.total_geral},
          ${ pedido.total_produtos},
          ${ pedido.total_servicos},
          ${ pedido.cliente.codigo},
        '${ pedido.data_cadastro }',
         ${ pedido.tipo}
          )`  )
          console.log('');
          console.log('');
  
     

        let result = await db.runAsync(
            ` INSERT INTO pedidos 
            (
            codigo,
            situacao,
            vendedor,
            descontos,
            forma_pagamento,
            observacoes,
            quantidade_parcelas,
            total_geral,
            total_produtos,
            total_servicos,
            cliente,
            data_cadastro,
              tipo  
            ) VALUES (
             ${ pedido.codigo}, 
             '${ pedido.situacao}',
              ${ pedido.vendedor},
             ${ pedido.descontos},
            ${ pedido.forma_pagamento},
            '${ pedido.observacoes}',
            ${ pedido.quantidade_parcelas},
            ${ pedido.total_geral},
            ${ pedido.total_produtos},
            ${ pedido.total_servicos},
            ${ pedido.cliente.codigo},
          '${ pedido.data_cadastro }',
           ${ pedido.tipo}
            )` 
        );
  

        console.log(' orcamento inserido codigo : ' ,result.lastInsertRowId);
        console.log('');
        return result.lastInsertRowId;
        }catch( e ){ console.log(` ocorreu um erro ao gravar o orcamento `,e)}
    
        
      }

  async function selectByCode( code:number ) {
      try{
        let result = await db.getAllAsync(
          `SELECT
          p.codigo,
          c.codigo as codigo_cliente,
          p.quantidade_parcelas,
          c.nome,
          p.situacao,
          p.descontos,
          p.forma_pagamento,
          p.vendedor,
          p.total_geral,
          p.total_produtos,
          p.data_cadastro,
          p.tipo
          FROM pedidos p
          JOIN  clientes c on c.codigo = p.cliente
          WHERE p.codigo = ${code}`
        );
        return result;
      }catch(e){console.log(e)}
  }

    async function selectAll(){
        try{ 
        let result = await db.getAllAsync(`SELECT 
           p.codigo,
          c.nome,
          c.codigo as codigo_cliente,
          p.situacao,
          p.descontos,
          p.forma_pagamento,
          p.total_geral,
          p.total_produtos, 
          p.data_cadastro,
          p.vendedor,
          p.tipo
          FROM pedidos p
          JOIN  clientes c on c.codigo = p.cliente
          `);
        //console.log(result);
          return result;
          }catch(e){ console.log(' erro ao consultar os pedidos! ',e) }
    }

    async function selectCompleteOrderByCode( code:number )  {
      try{
          let dataOrder:any  = await  selectByCode(code)
          let order = dataOrder[0];
          
          let dataClientOrder:any  = await queryClientes.selectByCode( order.codigo_cliente );
          let clientOrder = dataClientOrder[0];

          let producstOrder:any  = await queryItems.selectByCodeOrder(code);
          let servicesOrder:any = await queryServicosPedido.selectByCodeOrder(code);
           let parcelas:any = await queryParcelas.selectByCodeOrder(code) 
            
           order.produtos = producstOrder;
           order.parcelas = parcelas
           order.cliente = clientOrder
           order.servicos = servicesOrder
           //console.log(order);
           return order

        }catch(e){ `erro ao consultar o pedido codigo: ${code}`}

        }



    async function createOrder( order:pedido ){
       
         if( !order.codigo ){
           let code = Date.now();
          order.codigo = code;
 

          if(   !order.parcelas.length   ||  order.parcelas.length < 0 ){
            console.log(`nao foi informado os parcelas`)
            return;  
          }//else{
           // console.log('')
           // console.log(order.parcelas)
           // console.log('')
           //}
          let produtos:any = order.produtos;
          let parcelas: parcela[] = order.parcelas;
          let servicos: any = order.total_servicos;
             let codeOrder:any = await create(order);

                         if( codeOrder > 0 || codeOrder !== undefined  ){
             
                                if(  produtos.length > 0    ){
                                  produtos.forEach( async (prod:produto_pedido)=>{
                                    await queryItems.create( prod, order.codigo )
                                    })
                                } 

                                if( servicos.length > 0 ){
                                  servicos.forEach( async ( ser:servico_pedido )=>{
                                    await queryServicosPedido.create( ser, order.codigo )
                                    })
                                }
                                
                                parcelas.forEach( async (par :parcela)=>{
                                    await queryParcelas.create(par , order.codigo  )
                                })

                                return order.codigo ;
                        
                         }else{
                          console.log('ocorreu um erro ao tentar gravar o orcamento!')
                     }
          }  

    }

    async function deleteOrder( code:number){

      let verifyOrder = await selectByCode(code);
      
      if( verifyOrder?.length > 0 ){
        console.log(verifyOrder)
        console.log(`nao existe pedido com o codigo ${code} `)
      }else{

      }
      try{
          const result = await db.runAsync(` DELETE from pedidos where codigo = ${code}`)
          console.log(result);
          
          if( result.lastInsertRowId  ){
            await queryItems.deleteByCodeOrder(code);
            await  queryParcelas.deleteByCodeOrder(code);
            await queryServicosPedido.deleteByCodeOrder(code);
          }

          console.log(`deletado parcelas do orcamento codigo: ${code}`)

       }catch(e){
        console.log(e)
      }
   }


   async function deleteAllOrder(  ){

    try{
        const result = await db.runAsync(` DELETE from pedidos  `)
     
     }catch(e){
      console.log(e)
    }
 }

   async function updateOrder(order ){
       if( !order.codigo ){
      console.log('é necessario informar um orcamento com um codigo valido')
        return 
      }
    let verifyOrder:any = await selectByCode(order.codigo);
    console.log(verifyOrder)
  


     if(verifyOrder?.length > 0 ){
        console.log(order);
       let aux:any =  await update(order);


            if(aux.lastInsertRowId){
                
                
                await queryParcelas.deleteByCodeOrder(order.codigo)
                
                  if( order.produtos.length > 0 ){
                    await queryItems.deleteByCodeOrder(order.codigo);
                    order.produtos.forEach( async (p)=>{
                        await queryItems.create( p,order.codigo)
                        })

                    }
                
                    if( order.servicos.length > 0  ){
                      await queryServicosPedido.deleteByCodeOrder(order.codigo)
                      order.servicos.forEach( async (s)=>{
                        await queryServicosPedido.create( s,order.codigo)
                        })
                    }


                  
                  order.parcelas.forEach( async (pa)=>{
                    await queryParcelas.create( pa, order.codigo);
                  })
             } 

      }
    
  } 

  async function update( pedido:pedido ){
    pedido.situacao = 'EA';
    try{


      let result = await db.runAsync(
          ` UPDATE   pedidos SET
          situacao  =  '${ pedido.situacao}', 
          descontos =  ${ pedido.descontos},
          forma_pagamento = ${pedido.forma_pagamento},
          observacoes = '${ pedido.observacoes}', 
          quantidade_parcelas = ${ pedido.quantidade_parcelas},
          total_geral  =  ${ pedido.total_geral},
          total_produtos =  ${ pedido.total_produtos}, 
          cliente  =  ${ pedido.cliente.codigo},
          data_cadastro = ${ pedido.data_cadastro}
          WHERE codigo = ${ pedido.codigo}  
           ` 
      );

  
      
    console.log(' orcamento codigo : ' ,result.lastInsertRowId,' atualizado com sucesso !');
      return result;
      }catch( e ){ console.log(` ocorreu um erro ao gravar o orcamento `,e)}
    }
  
      

    return {deleteAllOrder, updateOrder , create , selectAll,selectByCode , createOrder, selectCompleteOrderByCode , deleteOrder}

}