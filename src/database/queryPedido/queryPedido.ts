import { useSQLiteContext } from "expo-sqlite"
import { useItemsPedido } from "./queryItems";
import { useParcelas } from "../queryParcelas/queryParcelas";
import { useProducts } from "../queryProdutos/queryProdutos";
import { useClients } from "../queryClientes/queryCliente";


export const usePedidos = () =>{

    const db =  useSQLiteContext();
  const queryItems    = useItemsPedido();
  const queryParcelas = useParcelas(); 
  const queryProdutos = useProducts();
  const queryClientes = useClients();

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

  type pedido ={ 
    codigo?:number,
    situacao:string,
    descontos:number,
    forma_pagamento:number,
    observacoes:string,
    quantidade_parcelas:number,
    total_geral:number,
    total_produtos:number,
    cliente:number ,
    produtos:produto_pedido[],
    parcelas:parcela[], 
    data_cadastro:string
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

     

        let result = await db.runAsync(
            ` INSERT INTO pedidos 
            (
            codigo,
            situacao,
            descontos,
            forma_pagamento,
            observacoes,
            quantidade_parcelas,
            total_geral,
            total_produtos,
            cliente,
            data_cadastro  
            ) VALUES (
             ${ pedido.codigo}, 
             '${ pedido.situacao}',
            ${ pedido.descontos},
            ${ pedido.forma_pagamento},
            '${ pedido.observacoes}',
            ${ pedido.quantidade_parcelas},
            ${ pedido.total_geral},
            ${ pedido.total_produtos},
            ${ pedido.cliente.codigo},
          '${ data }' 
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
          p.total_geral,
          p.total_produtos,
             p.data_cadastro
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
          p.data_cadastro
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
           let parcelas:any = await queryParcelas.selectByCodeOrder(code) 
            
           order.produtos = producstOrder;
           order.parcelas = parcelas
           order.cliente = clientOrder
           //console.log(order);
           return order

        }catch(e){ `erro ao consultar o pedido codigo: ${code}`}

        }

    async function createOrder( order:pedido ){
       
         if( !order.codigo ){
           let code = Date.now();
          order.codigo = code;

          if(   !order.produtos.length   ||  order.produtos.length < 0 ){
            console.log(`nao foi informado os produtos`)
            return;
          }//else{
           //  console.log('')
           //   console.log(order.produtos)
           //   console.log('')
           //} 

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
             let codeOrder:any = await create(order);
                         if( codeOrder !== undefined  ){
                          produtos.forEach( async (prod:produto_pedido)=>{
                            await queryItems.create( prod, order.codigo )
                            })
                             parcelas.forEach( async (par :parcela)=>{
                                await queryParcelas.create(par , order.codigo  )
                             })
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
               await queryItems.deleteByCodeOrder(order.codigo);
               await queryParcelas.deleteByCodeOrder(order.codigo)

               order.produtos.forEach( async (p)=>{
                await queryItems.create( p,order.codigo)
              })

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
          cliente  =  ${ pedido.cliente.codigo} 
          WHERE codigo = ${ pedido.codigo}  
           ` 
      );

  
      
    console.log(' orcamento codigo : ' ,result.lastInsertRowId,' atualizado com sucesso !');
      return result;
      }catch( e ){ console.log(` ocorreu um erro ao gravar o orcamento `,e)}
    }
  
      

    return {deleteAllOrder, updateOrder , create , selectAll,selectByCode , createOrder, selectCompleteOrderByCode , deleteOrder}

}