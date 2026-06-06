import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import { CustomHeader } from "../../components/custom-header"
import { useReducer, useState } from "react"
import { ProductList } from "./_components/product-list"


type product = {
    codigo: number,
    quantidade: number
    preco:number
    desconto:number
    descontos:number
    total:number
    quantidade_separada:number 
    quantidade_faturada:number
}

type actionOrderReducer =   
    { type: 'ADD_PRODUCT' , payload: product, quantity:number}  
   | { type: 'RM_PRODUCT' , payload: number}  
   | { type: 'FREIGHT' , payload: number}  
    | { type: 'ADD_DISCOUNT' , discount: number , codeProduct:number }

    | { type: 'ADD_CLIENT', payload: number}


type orderItem =  product & { quantidade:number};

type cliente ={ 
    codigo:number
}


type objOrderReducer = {
    codigo:string
    products: orderItem[],
    cliente: cliente
    frete:number
    total_geral:number
    total_produtos:number
    descontos:number

}

 

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
                                        const newQuantity = item.quantidade + quantity;
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
                const newProducts = state.products.map((item) =>{
                   if(item.codigo === action.payload  ){    
                    let newQuantity = item.quantidade - 1
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
        case 'ADD_CLIENT':{
            const { payload } = action;

            return {
                ...state,
                cliente:{ codigo: payload}
            }
        }

    }   
}


export const PedidoComponent = ({ navigation }: any)=>{
     
    const [ state, dispatch ] = useReducer(orderReducer, {codigo: '1', cliente: { codigo:0},total_geral:12, total_produtos:4, descontos:1, frete:0, products:[
        {
            codigo: 1 ,
             preco:1,
            quantidade:1,
            desconto:0,
            descontos:0,
            quantidade_faturada:0,
            quantidade_separada:0,
            total:1,
        },
        {
            codigo: 2 ,
             preco:10,
            quantidade:1,
            desconto:1,
            descontos:1,
            quantidade_faturada:0,
            quantidade_separada:0,
            total:9
        },
        {
            codigo: 4 ,
            preco:1,
            quantidade:1,
            desconto:0,
            descontos:0,
            quantidade_faturada:0,
            quantidade_separada:0,
            total:1
        },
        {
            codigo: 6 ,
            preco:1,
            quantidade:1,
            desconto:0,
            descontos:0,
            quantidade_faturada:0,
            quantidade_separada:0,
            total:1
        }

    ]} )

    const handleAddProduct = (product:product, quantity:number )=>{
        dispatch({
            type: "ADD_PRODUCT",
            payload: { 
                codigo: product.codigo,
                preco: product.preco,
                quantidade: product.quantidade,
                desconto: product.desconto,
                descontos: product.descontos,
                quantidade_faturada:0,
                quantidade_separada:0,
                total: product.total
            },
            quantity
        })
    }

    const handleRmProduct = (product:product )=>{
        dispatch({
            type: 'RM_PRODUCT',
            payload: product.codigo
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

    const RenderItemProduct = (  { item }: {item: product} )=>{

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
                                     onPress={ ()=> handleRmProduct(item)}>
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
             <View>
                <Text style={{ fontSize:15, fontWeight:"bold"}}>
                    Frete:
               </Text>

                    <TextInput
                        style={{ backgroundColor:'#CCC', borderWidth:0.5, borderColor:'red'}}
                        onChangeText={(frete)=>{handleAddFreight(Number(frete))}}
                        keyboardType="number-pad"
                    />
               </View>
            
            { 
                <FlatList
                data={state.products}
                renderItem={ ( {item}  )=>  <RenderItemProduct item={item}/>
                   }            
             />
                  }
                
                { /** <ProductList  products={state.products}/> */}

        </View>
    )
}