import { View } from "react-native"
import { CustomHeader } from "../../components/custom-header"


type product = {
    codigo: number,
    quantidade: number
    preco:number
}

type actionOrderReducer =   
    { type: 'ADD_PRODUCT' , payload: product}  
   | { type: 'RM_PRODUCT' , payload: number}  
    


type orderItem =  product & { quantidade:number};

type objOrderReducer = {
    products: orderItem[],

}

 

function orderReducer(state:objOrderReducer, action:actionOrderReducer){
    switch(action.type){
        case 'ADD_PRODUCT':
                const productToadd = action.payload
              const productExists = state.products.find(( product )=>{ product.codigo == productToadd.codigo  })

                const newProducts: orderItem[]=[];

                    if(productExists){
                            for( const product of state.products){
                                if(product.codigo === productToadd.codigo){
                                    newProducts.push( { ...product, quantidade:  + 1})
                                }
                            }

                    }else{
                        // newProducts = [ ...state.products, { ...productToadd, quantidade:1}];
                    }
            
              return {
                ...state,
                products: newProducts
            };

            case 'RM_PRODUCT' : 
                const newProducts = state.products.filter(( i ) => i.codigo === action.payload)
                return { 
                    ...state,
                    products: newProducts
                }

    }   
}


export const PedidoComponent = ({ navigation }: any)=>{


    return (
            <View style={{ flex: 1, backgroundColor: '#EAF4FE' }}>

             <CustomHeader
                    title="novo componente pedido "
                    onBack={() => navigation.goBack()}
                  />
            
        </View>
    )
}