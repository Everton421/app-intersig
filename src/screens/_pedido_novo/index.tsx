import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import { CustomHeader } from "../../components/custom-header"
import { useReducer, useState } from "react"
import { ProductList } from "./_components/product-list/product-list"
import { RenderSelectedItem } from "./_components/render-itens-selected"
import { actionOrderReducer, cliente, objOrderReducer, orderItem, type orderProduct } from "./types/order"
import { CustomerList } from "./_components/customer/customer-list"





 

function orderReducer(state:objOrderReducer, action:actionOrderReducer){
    switch(action.type){
        case 'ADD_PRODUCT':{ 
                const productToadd = action.payload
                const { quantity } = action;

              const productExists = state.products.find( product  =>   product.codigo === productToadd.codigo   )

                let newProducts: orderItem[];

                    if(productExists){
                            newProducts = state.products.map( ( item ) =>{ 
                                    if(item.codigo === productToadd.codigo){
                                        const newQuantity = item.quantidade = quantity;
                                        const newDesconto = newQuantity * item.desconto; 
                                         const newTotal = (newQuantity * item.preco) - newDesconto;  
                                        return { ...item, quantidade: newQuantity, descontos:newDesconto,desconto: item.desconto, total:newTotal }
                                    }else{
                                        return item;
                                    }   
                                }
                             )
                    }else{
                          newProducts = [ ...state.products,{ ...productToadd, quantidade:quantity}];
                    }
                    let newTotalGeralProductsOrder = 0;
                    let newTotalDescountsOrder = 0;   
                    let newTotalProductsOrder=0;
                    for( const item of newProducts){
                            newTotalGeralProductsOrder+= item.total;
                            newTotalDescountsOrder+=item.desconto
                            newTotalProductsOrder+=(item.quantidade * item.preco)
                        } 

              return {
                ...state,
                 total_geral: newTotalGeralProductsOrder,
                 total_produtos: newTotalProductsOrder,
                 descontos: newTotalDescountsOrder,
                 products: newProducts
            };
            }

        case 'RM_PRODUCT' : {
            const { quantity } = action;
                const newProducts = state.products.map((item) =>{
                   if(item.codigo === action.payload  && item.quantidade >= quantity){    
                    let newQuantity = item.quantidade - quantity
                    return { ...item, quantidade: newQuantity, total: (newQuantity * item.preco) - item.desconto }
                   }else{
                    return item
                   }
               }
                ).filter((item) =>  item.quantidade > 0)

                    let newTotalGeralProductsOrder = 0;
                    let newTotalDescountsOrder = 0;   
                    let newTotalProductsOrder=0;
                    for( const item of newProducts){
                            newTotalGeralProductsOrder+= item.total;
                            newTotalDescountsOrder+=item.descontos
                            newTotalProductsOrder+=(item.quantidade * item.preco)
                        } 

              return {
                ...state,
                 total_geral: newTotalGeralProductsOrder,
                 total_produtos: newTotalProductsOrder,
                 descontos: newTotalDescountsOrder  ,
                 products: newProducts
            };
            }
        case 'FREIGHT':{
              return {
                ...state,
                  frete: action.payload,
                 total_geral: state.total_geral + action.payload,
            
            };
        }    
        case 'ADD_DISCOUNT':{
            const { codeProduct, discount } = action

                             const newProducts  = state.products.map( ( item ) =>{ 
                                        if(item.codigo === codeProduct ){

                                            const newDiscounts = item.quantidade * discount; 
                                             let newTotal = (item.quantidade * item.preco) - newDiscounts;  

                                             if(newTotal <  0 ){
                                                newTotal = 0
                                             }

                                                
                                         return { ...item,   descontos:newDiscounts, desconto:discount , total:newTotal }          
                                        }else{
                                            return item;
                                        }
                                        
                                }
                             )
                   
                    let newTotalGeralProductsOrder = 0;
                    let newTotalDescountsOrder = 0;   
                    let newTotalProductsOrder=0;
                    for( const item of newProducts){
                            newTotalGeralProductsOrder+= item.total;
                            newTotalDescountsOrder+=item.descontos
                            newTotalProductsOrder+=(item.quantidade * item.preco)
                        } 

              return {
                ...state,
                 total_geral: newTotalGeralProductsOrder,
                 total_produtos: newTotalProductsOrder,
                 descontos: newTotalDescountsOrder,
                 products: newProducts
            };
        }
        case 'ADD_CUSTOMER':{
            const { payload } = action;
                const { cep, cnpj, codigo, endereco, numero } = payload;

            return {
                ...state,
                cliente:{   
                     cep, cnpj, codigo, endereco, numero 
                     }
            }
        }

    }   
}


export const PedidoComponent = ({ navigation }: any)=>{
        const initalValuecustomer:cliente = {
            cep:'',
            cnpj:'',
            codigo:0,
            endereco:'',
            numero:0
        }
    const [ state, dispatch ] = useReducer(orderReducer, {codigo: '1', cliente:  initalValuecustomer,total_geral:12, total_produtos:4, descontos:1, frete:0, products:[
        

    ]} )

    const handleAddProduct = (product:orderProduct, quantity:number )=>{
        dispatch({
            type: "ADD_PRODUCT",
            payload: { 
                codigo: product.codigo,
                preco: product.preco,
                descricao: product.descricao,
                estoque: product.estoque,
                unidade_medida: product.unidade_medida,
                quantidade: product.quantidade,
                desconto: product.desconto,
                descontos: product.descontos,
                quantidade_faturada:0,
                quantidade_separada:0,
                total: product.total,
                fotos:product.fotos
            },
            quantity
        })
    }

    const handleRmProduct = (product:orderProduct, quantity: number )=>{
        dispatch({
            type: 'RM_PRODUCT',
            payload: product.codigo,
            quantity:quantity
        })
    }
    const handleNewCustomer = (customer: cliente)=>{
        dispatch({
            type: "ADD_CUSTOMER",
            payload: customer
        })
    }
    const handleAddFreight = (freight:number)=>{
        dispatch({
            type:"FREIGHT",
            payload: freight
        })
    }

const handleDiscount = ( discount:number, codeProduct:number )=>{
    console.log(discount, codeProduct)
     dispatch({
         type: 'ADD_DISCOUNT',
         codeProduct,
         discount 
     })
}

    const RenderItemProduct = (  { item }: {item: orderProduct} )=>{

        return(
               <View style={{flex:1, width:'90%', borderWidth:1,margin:1 }}>
                        <Text> Cód: {item.codigo }</Text>
                        <Text>   Price: $ {item.preco }</Text>
                        <Text>   Qtd: {item.quantidade }</Text>
                       <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-around'}} >
                            <TouchableOpacity style={{width:50, height:50, backgroundColor:'#CCC', alignItems:'center', justifyContent:'center'}}
                             onPress={ ()=> handleAddProduct(item, 1)}>
                                < Text> + </Text>
                            </TouchableOpacity> 
                            <TouchableOpacity style={{width:50, height:50, backgroundColor:'#CCC', alignItems:'center',justifyContent:'center'}}
                                     onPress={ ()=> handleRmProduct(item, 1)}>
                                < Text> -  </Text>
                                
                            </TouchableOpacity> 
                        </View>
                       <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-around'}} >
                                < Text> Total: ${item.total} </Text>
                                < Text> Descontos: ${item.descontos} </Text>
                                < Text> Desconto Un: ${item.desconto} </Text>
                        </View>

                            <Text>
                                desconto
                            </Text>
                             <TextInput
                                style={{ backgroundColor:'#CCC', borderWidth:0.5, borderColor:'red', width:'80%'}}
                               // onChangeText={(value)=>{ setDiscount(value) }}
                                keyboardType="decimal-pad"
                                 // value={  String(discount.toFixed(2)) || '0'  }  

                            />


                         

                    </View>
            )    
    }


    return (
            <View style={{ flex: 1, backgroundColor: '#EAF4FE' }}>

             <CustomHeader
                    title="novo componente pedido "
                    onBack={() => navigation.goBack()}
                  />

            <View style={{ backgroundColor:'#CCC', justifyContent:'space-between' , flexDirection:'row',marginBottom:10}} >
               <Text style={{ fontSize:15, fontWeight:"bold"}}>
                    Total Pedido: {state.total_geral}
               </Text>
                <Text style={{ fontSize:15, fontWeight:"bold"}}>
                    Total Descontos: {state.descontos}
               </Text>
             </View>



            
         <CustomerList
         handleNewCustomer={handleNewCustomer}
         />
                 { state.cliente .codigo > 0 &&  
           <View style={{ backgroundColor:'#CCC', justifyContent:'space-between' , flexDirection:'row',marginBottom:10}} >
               <Text style={{ fontSize:15, fontWeight:"bold"}}>
                  cliente {state.cliente.nome }
               </Text>
             </View>
}

            <ProductList 
                     handleAddProduct={handleAddProduct}
                     handleDiscount={handleDiscount}
            />
            
                <FlatList
                  data={state.products}
                  horizontal={true}
                  renderItem={ ( {item}  )=>  
                    <RenderSelectedItem  item={item}  
                     removeItem={handleRmProduct }    
                     handleAddProduct={handleAddProduct}
                     handleDiscount={handleDiscount}
                     />
                    
                    }            
                />
                
                
                
                { /** <ProductList  products={state.products}/> */}

        </View>
    )
}