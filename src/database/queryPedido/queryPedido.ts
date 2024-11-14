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
    enviado:string,
    observacoes:string,
    quantidade_parcelas:number,
    total_geral:number,
    total_produtos:number,
    total_servicos:number,
    cliente:number ,
    produtos:produto_pedido[],
    parcelas:parcela[], 
    data_cadastro:string,
    data_recadastro:string,
    veiculo:number,
    tipo_os:number,
    tipo:number,
    contato:string
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
      try{
      
 
        let result = await db.runAsync(
            ` INSERT INTO pedidos 
            (
            codigo,
            situacao,
            contato,
            vendedor,
            descontos,
            forma_pagamento,
            enviado,
            observacoes,
            quantidade_parcelas,
            total_geral,
            total_produtos,
            total_servicos,
            cliente,
            data_cadastro,
            data_recadastro,
            veiculo,
            tipo_os,
              tipo  
            ) VALUES (
             ${ pedido.codigo}, 
            '${pedido.situacao}',
            '${ pedido.contato}',
             ${ pedido.vendedor},
             ${ pedido.descontos},
             ${ pedido.forma_pagamento},
             '${pedido.enviado}',
            '${ pedido.observacoes}',
             ${ pedido.quantidade_parcelas},
             ${ pedido.total_geral},
             ${ pedido.total_produtos},
             ${ pedido.total_servicos},
             ${ pedido.cliente.codigo},
            '${ pedido.data_cadastro }',
            '${pedido.data_recadastro}',
             ${ pedido.veiculo},
             ${ pedido.tipo_os},
             ${ pedido.tipo}
            )` 
        );
  

        console.log(' orcamento inserido codigo : ' ,result.lastInsertRowId);
        return result.lastInsertRowId;
        }catch( e ){ console.log(` ocorreu um erro ao gravar o orcamento `,e)}
    
        
      }

      async function createByCode( pedido:pedido , code:number){

        let data = getCurrentDate();
        try{
            if(pedido.codigo_site > 0 ) {
              pedido.enviado = 'S'
            }
          
          let result = await db.runAsync(
              ` INSERT INTO pedidos 
              (
              codigo,
              situacao,
              contato,
              vendedor,
              descontos,
              forma_pagamento,
              enviado,
              observacoes,
              quantidade_parcelas,
              total_geral,
              total_produtos,
              total_servicos,
              cliente,
              data_cadastro,
              data_recadastro,
              veiculo,
              tipo_os,
                tipo  
              ) VALUES (
               ${ code}, 
              '${pedido.situacao}',
              '${ pedido.contato}',
               ${ pedido.vendedor},
               ${ pedido.descontos},
               ${ pedido.forma_pagamento},
               '${pedido.enviado}',
              '${ pedido.observacoes}',
               ${ pedido.quantidade_parcelas},
               ${ pedido.total_geral},
               ${ pedido.total_produtos},
               ${ pedido.total_servicos},
               ${ pedido.cliente.codigo},
              '${ pedido.data_cadastro }',
              '${pedido.data_recadastro}',
               ${ pedido.veiculo},
               ${ pedido.tipo_os},
               ${ pedido.tipo}
              )` 
          );
    
  
           console.log(' orcamento inserido codigo : ' ,result.lastInsertRowId);
          return result.lastInsertRowId;
          }catch( e ){ console.log(` ocorreu um erro ao gravar o orcamento `,e)}
      
          
        }
  async function selectByCode( code:number ) {
      try{

        let result = await db.getAllAsync(
          `SELECT
          p.codigo,
          c.codigo as codigo_cliente,
          p.contato,
          p.quantidade_parcelas,
          c.nome,
          p.situacao,
          p.observacoes,
          p.descontos,
          p.forma_pagamento,
          p.enviado,
          p.vendedor,
          p.total_geral,
          p.total_produtos,
          p.total_servicos,
          p.veiculo,
          strftime('%Y-%m-%d', p.data_cadastro) AS data_cadastro,
          strftime('%Y-%m-%d %H:%M:%S', p.data_recadastro) AS data_recadastro,
          p.tipo_os,
          p.tipo
          FROM pedidos p
          JOIN  clientes c on c.codigo = p.cliente
          WHERE p.codigo = ${code}`
        );
        return result;
      }catch(e){console.log(e)}
  }

  async function selectByCode2( code:number ) {
    try{
      let result = await db.getAllAsync(
        `SELECT
         codigo,
         contato,
         quantidade_parcelas,
         situacao,
         descontos,
         forma_pagamento,
           enviado,
         observacoes,
         vendedor,
         total_geral,
         total_produtos,
         total_servicos,
         veiculo,
         strftime('%Y-%m-%d', data_cadastro) AS data_cadastro,
         strftime('%Y-%m-%d %H:%M:%S',  data_recadastro) AS data_recadastro,
         tipo_os,
         tipo
        FROM pedidos  
        WHERE codigo = ${code}`
      );
      return result;
    }catch(e){console.log(e)}
}


    async function selectAll(){
        try{ 
        let result = await db.getAllAsync(`SELECT 
          p.codigo,
          c.nome,
          p.contato,
          c.codigo as codigo_cliente,
          p.situacao,
          p.descontos,
          p.observacoes,
          p.forma_pagamento,
          p.enviado,
          p.total_geral,
          p.total_produtos, 
          p.veiculo,
          strftime('%Y-%m-%d', p.data_cadastro) AS data_cadastro,
          strftime('%Y-%m-%d %H:%M:%S', p.data_recadastro) AS data_recadastro,
          p.vendedor,
          p.tipo_os,
          p.tipo
          FROM pedidos p
          JOIN  clientes c on c.codigo = p.cliente
          `);
        //console.log(result);
          return result;
          }catch(e){ console.log(' erro ao consultar os pedidos! ',e) }
    }

      async function findByTipe( tipo:number, vendedor:number ){
        try{ 
        let result = await db.getAllAsync(`SELECT 
          p.codigo,
          c.nome,
          p.contato,
          c.codigo as codigo_cliente,
          p.situacao,
          p.observacoes,
          p.descontos,
          p.forma_pagamento,
          p.enviado,
          p.total_geral,
          p.total_produtos, 
          p.total_servicos,
          p.data_cadastro,
          p.veiculo,
          strftime('%Y-%m-%d', p.data_cadastro) AS data_cadastro,
          strftime('%Y-%m-%d %H:%M:%S', p.data_recadastro) AS data_recadastro,
          p.vendedor,
          p.tipo_os,
          p.tipo
          FROM pedidos p
          JOIN  clientes c on c.codigo = p.cliente
          WHERE p.tipo ='${tipo}' AND p.vendedor =  ${vendedor}         
          `);
      //   console.log(result);
          return result;
          }catch(e){ console.log(` erro ao consultar os pedidos  do vendedor : ${vendedor}  `,e) }
    }

    async function findByTipeAndDate( tipo:number, vendedor:number, data:any ){
      try{ 

//console.log(`SELECT 
//        p.codigo,
//        c.nome,
//        p.contato,
//        c.codigo as codigo_cliente,
//        p.situacao,
//        p.observacoes,
//        p.descontos,
//        p.forma_pagamento,
//        p.enviado,
//        p.total_geral,
//        p.total_produtos, 
//        p.total_servicos,
//        p.data_cadastro,
//        p.veiculo,
//        strftime('%Y-%m-%d', p.data_cadastro) AS data_cadastro,
//        strftime('%Y-%m-%d %H:%M:%S', p.data_recadastro) AS data_recadastro,
//        p.vendedor,
//        p.tipo_os,
//        p.tipo
//        FROM pedidos p
//        JOIN  clientes c on c.codigo = p.cliente
//        WHERE p.tipo ='${tipo}' AND p.vendedor =  ${vendedor} 
//        AND p.data_cadastro = '${data}'  `
//       )

      let result = await db.getAllAsync(`SELECT 
        p.codigo,
        c.nome,
        p.contato,
        c.codigo as codigo_cliente,
        p.situacao,
        p.observacoes,
        p.descontos,
        p.forma_pagamento,
        p.enviado,
        p.total_geral,
        p.total_produtos, 
        p.total_servicos,
        p.data_cadastro,
        p.veiculo,
        strftime('%Y-%m-%d', p.data_cadastro) AS data_cadastro,
        strftime('%Y-%m-%d %H:%M:%S', p.data_recadastro) AS data_recadastro,
        p.vendedor,
        p.tipo_os,
        p.tipo
        FROM pedidos p
        JOIN  clientes c on c.codigo = p.cliente
        WHERE p.tipo ='${tipo}' AND p.vendedor =  ${vendedor} 
        AND p.data_cadastro = '${data}'        
        `);
    //   console.log(result);
        return result;
        }catch(e){ console.log(` erro ao consultar os pedidos  do vendedor : ${vendedor}  `,e) }
  }


    async function findByTipeAndClient( tipo:number, vendedor:number , nome:any){
      try{ 
      let result = await db.getAllAsync(`SELECT 
        p.codigo,
        c.nome,
        p.contato,
        c.codigo as codigo_cliente,
        p.situacao,
        p.observacoes,
        p.descontos,
        p.forma_pagamento,
        p.enviado,
        p.total_geral,
        p.total_produtos, 
        p.total_servicos,
        p.data_cadastro,
        p.veiculo,
        strftime('%Y-%m-%d', p.data_cadastro) AS data_cadastro,
        strftime('%Y-%m-%d %H:%M:%S', p.data_recadastro) AS data_recadastro,
        p.vendedor,
        p.tipo_os,
        p.tipo
        FROM pedidos p
        JOIN  clientes c on c.codigo = p.cliente
        WHERE 
         p.tipo ='${tipo}'
          AND p.vendedor =  ${vendedor} 
          AND
           c.nome like '%${nome}%'
        `);
    //   console.log(result);
        return result;
        }catch(e){ console.log(` erro ao consultar os pedidos  do vendedor : ${vendedor}  `,e) }
  }
 


    async function selectCompleteOrderByCode( code:number )  {
      try{
          let dataOrder:any  = await  selectByCode(code)
          let order = dataOrder[0];

          let clientOrder  
          
          try{
          let dataClientOrder:any  = await queryClientes.selectByCode( order.codigo_cliente );
          clientOrder = dataClientOrder[0];
        }catch(e){console.log(e)}

        let producstOrder:any

          try{
            producstOrder   = await queryItems.selectByCodeOrder(code);
        }catch(e){console.log(e)}

        let servicesOrder:any

        try{
            servicesOrder  = await queryServicosPedido.selectByCodeOrder(code);
        }catch(e){console.log(e)}
        
        let parcelas:any

        try{
           parcelas  = await queryParcelas.selectByCodeOrder(code) 
        }catch(e){console.log(e)}
            
           order.produtos = producstOrder;
           order.parcelas = parcelas
           order.cliente = clientOrder
           order.servicos = servicesOrder
           return order

        }catch(e){ `erro ao consultar o pedido codigo: ${code}`}

        }

  async function selectLastId(){
    try{ 
      let result = await db.getAllAsync(`SELECT MAX(p.codigo) as codigo FROM pedidos p  `);
        return result;
        }catch(e){ console.log(' erro ao consultar os pedidos! ',e) }
   }


   async function createOrderByCode( order:pedido, code:number ){

    if(   !order.parcelas.length   ||  order.parcelas.length < 0 ){
      console.log(`nao foi informado os parcelas`)
      return;  
    } 
    let produtos:any = order.produtos;
    let parcelas: parcela[] = order.parcelas;
    let servicos: any = order.servicos;
       let codeOrder:any = await createByCode( order, code );

                   if( codeOrder > 0 || codeOrder !== undefined  ){
       
                          if(  produtos.length > 0    ){
                            produtos.forEach( async (prod:produto_pedido)=>{
                              await queryItems.create( prod, code )
                              })
                          } 

                          if( servicos.length > 0 ){
                            servicos.forEach( async ( s:servico_pedido )=>{
                              await queryServicosPedido.create( s,  code  )
                              })
                          }
                          
                          parcelas.forEach( async (par :parcela)=>{
                              await queryParcelas.create(par ,  code  )
                          })

                          return order.codigo ;
                  
                   }else{
                    console.log('ocorreu um erro ao tentar gravar o orcamento!')
               }
  //  }  

}


    async function createOrder( order:pedido , code:number){
          if(   !order.parcelas.length   ||  order.parcelas.length < 0 ){
            console.log(`nao foi informado os parcelas`)
            return;  
          } 
          let produtos:any = order.produtos;
          let parcelas: parcela[] = order.parcelas;
          let servicos: any = order.servicos;
             let codeOrder:any = await createByCode(order ,code );

                         if( codeOrder > 0 || codeOrder !== undefined  ){
             
                                if(  produtos.length > 0    ){
                                  produtos.forEach( async (prod:produto_pedido)=>{
                                    await queryItems.create( prod, code )
                                    })
                                } 

                                if( servicos.length > 0 ){
                                  servicos.forEach( async ( ser:servico_pedido )=>{
                                    await queryServicosPedido.create( ser, code  )
                                    })
                                }
                                
                                parcelas.forEach( async (par :parcela)=>{
                                    await queryParcelas.create(par , code   )
                                })

                                return code ;
                        
                         }else{
                          console.log('ocorreu um erro ao tentar gravar o orcamento!')
                     }
        //  }  

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

            let items = await  queryItems.selectByCodeOrder(code);
              if( items.length > 0 ){
                await queryItems.deleteByCodeOrder(code);
              }

              let parcelas = await queryParcelas.selectByCodeOrder(code);
              if( parcelas?.length > 0 ){
                await queryParcelas.deleteByCodeOrder(code);
              }

              let servicos = await queryServicosPedido.selectByCodeOrder(code);
              
              if( servicos?.length > 0 ){
                await queryServicosPedido.deleteByCodeOrder(code);
              }
          }

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



///
/// efetua update no pedido caso exista
/// caso nao exista efetua o cadastro do pedido
   async function updateOrder(order, codigoOrcamento ){
       
    if( !order.codigo ){
      console.log('é necessario informar um orcamento com um codigo valido')
        return 
      }
    
      let verifyOrder:any = await selectByCode2(order.codigo);

      let codigoRgistrado ;

    if(verifyOrder?.length > 0 ){
       let aux:any =  await update(order);
       codigoRgistrado = aux 
      }else{
        
        console.log('nao foi encontrado orcamento com o codigo ', order.codigo)
        return;
      //  let aux:any =  await create(order);
        //codigoRgistrado = aux 
      }

             if( codigoRgistrado  > 0 ){

                if( order.produtos.length === 0 ){
                  let verifyProductsPedido:any = await  queryItems.selectByCodeOrder(codigoOrcamento);
                  if( verifyProductsPedido?.length > 0 ){
                    await queryItems.deleteByCodeOrder( codigoOrcamento )
                    }
                }

                  if( order.produtos.length > 0  ){
                      let verifyProductsPedido:any = await  queryItems.selectByCodeOrder(codigoOrcamento);
                    
                      if( verifyProductsPedido?.length > 0 ){
                         const produtosParaExcluir = verifyProductsPedido.filter(prodBd => !order.produtos.some( p => p.codigo === prodBd.codigo));
                         for (const produto of produtosParaExcluir) {
                           await queryItems.deleteProductByCodeOrder(produto.codigo, codigoOrcamento);
                         }
                     } else{
                        console.log('nao foi encontrado produtos para este pedido')
                    } 

                    for( const p of order.produtos ){
                      let aux = await queryItems.selectProductByCodeOrder( p.codigo , codigoOrcamento );
                      console.log('')
                      console.log('produto ', p.codigo,' encontrado', aux)


                          if( aux?.length > 0    ){
                            await queryItems.update(p, codigoOrcamento)
                            console.log('atualizando produto', p.codigo )
                        }else{
                            await queryItems.create(p, codigoOrcamento);
                            console.log('inserindo produto', p.codigo )
                        }
                    }  
                }


               if( order.servicos.length === 0 ){
                let verifyServicesPedido:any = await   queryServicosPedido.selectByCodeOrder(codigoOrcamento);

                if( verifyServicesPedido?.length > 0 ){
                console.log("servicos encontrados" )
                console.log(  verifyServicesPedido)

                  await queryServicosPedido.deleteByCodeOrder( codigoOrcamento )
                  }
              }
                     if( order.servicos.length > 0  ){
                            let verifyServicesPedido:any = await   queryServicosPedido.selectByCodeOrder(codigoOrcamento);
                          
                            if( verifyServicesPedido?.length > 0 ){
                              const servicosParaExcluir = verifyServicesPedido.filter(servicoBd => !order.servicos.some(servico => servico.codigo === servicoBd.codigo));
                              for (const servico of servicosParaExcluir) {
                                await queryServicosPedido.deleteServiceByCodeOrder(servico.codigo, codigoOrcamento);
                              }
                          } else{
                              console.log('nao foi encontrado servicos para este pedido')
                          } 

                          for( const s of order.servicos ){
                            let aux = await queryServicosPedido.selectServiceByCodeOrder( s.codigo , codigoOrcamento   );
                            if( aux?.length > 0    ){
                                await queryServicosPedido.update(s, codigoOrcamento)
                            }else{
                                await queryServicosPedido.create(s, codigoOrcamento );
                            }
                        }  

                     }
 
                      if( order.parcelas.length > 0 ){
                             await queryParcelas.deleteByCodeOrder( order.codigo );
                        order.parcelas.forEach( async (pa)=>{
                          await queryParcelas.create( pa, order.codigo);
                        })
                      }
                  
              } 

              return codigoRgistrado ;
    
  } 

  async function update( pedido:pedido ){
    try{

     // console.log( ` UPDATE   pedidos SET
     //   situacao  =  '${ pedido.situacao}', 
     //   contato  =  '${ pedido.contato}', 
     //   descontos =  ${ pedido.descontos},
     //   forma_pagamento = ${pedido.forma_pagamento},
     //   enviado     = '${pedido.enviado}',
     //   observacoes = '${ pedido.observacoes}', 
     //   quantidade_parcelas = ${ pedido.quantidade_parcelas},
     //   total_geral  =  ${ pedido.total_geral},
     //   total_produtos =  ${ pedido.total_produtos}, 
     //   cliente  =  ${ pedido.cliente.codigo},
     //   data_cadastro = '${pedido.data_cadastro}',
     //   data_recadastro = '${pedido.data_recadastro}',
     //   veiculo = ${pedido.veiculo},
     //   tipo_os = ${pedido.tipo_os}
     //   WHERE codigo = ${ pedido.codigo}  
     //    ` )
         

      let result = await db.runAsync(
          ` UPDATE   pedidos SET
          situacao  =  '${ pedido.situacao}', 
          contato  =  '${ pedido.contato}', 
          descontos =  ${ pedido.descontos},
          forma_pagamento = ${pedido.forma_pagamento},
          enviado     = '${pedido.enviado}',
          observacoes = '${ pedido.observacoes}', 
          quantidade_parcelas = ${ pedido.quantidade_parcelas},
          total_geral  =  ${ pedido.total_geral},
          total_produtos =  ${ pedido.total_produtos}, 
          cliente  =  ${ pedido.cliente.codigo},
          data_cadastro = '${pedido.data_cadastro}',
          data_recadastro = '${pedido.data_recadastro}',
          veiculo = ${pedido.veiculo},
          tipo_os = ${pedido.tipo_os}
          WHERE codigo = ${ pedido.codigo}  
           ` 
      );

    console.log(' orcamento codigo : ' ,result.lastInsertRowId,' atualizado com sucesso !');
      return result.lastInsertRowId;
      }catch( e ){ 
    
        console.log( ` UPDATE   pedidos SET
          situacao  =  '${ pedido.situacao}', 
          contato  =  '${ pedido.contato}', 
          descontos =  ${ pedido.descontos},
          forma_pagamento = ${pedido.forma_pagamento},
          enviado     = '${pedido.enviado}',
          observacoes = '${ pedido.observacoes}', 
          quantidade_parcelas = ${ pedido.quantidade_parcelas},
          total_geral  =  ${ pedido.total_geral},
          total_produtos =  ${ pedido.total_produtos}, 
          cliente  =  ${ pedido.cliente.codigo},
          data_cadastro = '${pedido.data_cadastro}',
          data_recadastro = '${pedido.data_recadastro}',
          veiculo = ${pedido.veiculo},
          tipo_os = ${pedido.tipo_os}
          WHERE codigo = ${ pedido.codigo}  
           ` )
           console.log(` ocorreu um erro ao atualizar o orcamento `, e)

      }
    }
  

    async function updateByCode( pedido:pedido, code:number ){
      try{
  
        let result = await db.runAsync(
            ` UPDATE   pedidos SET
            situacao  =  '${pedido.situacao}', 
            contato  =  '${pedido.contato}', 
            descontos =  ${pedido.descontos},
            forma_pagamento = ${pedido.forma_pagamento},
            enviado     = '${pedido.enviado}',
            observacoes = '${ pedido.observacoes}', 
            quantidade_parcelas = ${ pedido.quantidade_parcelas},
            total_geral  =  ${ pedido.total_geral},
            total_produtos =  ${ pedido.total_produtos}, 
            cliente  =  ${ pedido.cliente.codigo},
            data_cadastro = '${pedido.data_cadastro}',
            data_recadastro = '${pedido.data_recadastro}',
            veiculo = ${pedido.veiculo},
            tipo_os = ${pedido.tipo_os}
            WHERE codigo = ${ code}  
             ` 
        );

      console.log(' orcamento codigo : ' ,code,' atualizado com sucesso !');
      return result ;
        }catch( e ){ 

          console.log(` ocorreu um erro ao atualiza o orcamento `, e)
          console.log(
            ` UPDATE   pedidos SET
            situacao  =  '${pedido.situacao}', 
            contato  =  '${pedido.contato}', 
            descontos =  ${pedido.descontos},
            forma_pagamento = ${pedido.forma_pagamento},
            enviado     = '${pedido.enviado}',
            observacoes = '${ pedido.observacoes}', 
            quantidade_parcelas = ${ pedido.quantidade_parcelas},
            total_geral  =  ${ pedido.total_geral},
            total_produtos =  ${ pedido.total_produtos}, 
            cliente  =  ${ pedido.cliente.codigo},
            data_cadastro = '${pedido.data_cadastro}',
            data_recadastro = '${pedido.data_recadastro}',
            veiculo = ${pedido.veiculo},
            tipo_os = ${pedido.tipo_os}
            WHERE codigo = ${ code}  
             `
          )
        }
      }

      
      async function updateSentOrderByCode( enviado:String, code:number ){
        try{

          let result = await db.runAsync(
              ` UPDATE   pedidos SET
              enviado  =  '${enviado}'  
              WHERE codigo = '${code}'  
               ` 
          );
  
        //console.log(' Atualizado a situação orcamento codigo : ' ,code );
        return result ;
          }catch( e ){ 
            console.log(` ocorreu um erro ao atualiza o orcamento `, e)
    
          }
        }
  



    return {
      update,createOrderByCode,findByTipeAndDate,updateSentOrderByCode, findByTipeAndClient, updateByCode, selectLastId , findByTipe, deleteAllOrder, updateOrder , create , selectAll,selectByCode , createOrder, selectCompleteOrderByCode , deleteOrder}

}