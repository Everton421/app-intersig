export type orderProduct = {
    codigo: number,
    quantidade: number
    preco:number
    desconto:number
    descontos:number
    descricao:string
    estoque:number
    total:number
    unidade_medida:string
    quantidade_separada:number 
    quantidade_faturada:number
    fotos:[] | photoOrdeProduct[]
}

type photoOrdeProduct = { 
    link:string
}


export  type actionOrderReducer =   
    { type: 'ADD_PRODUCT' , payload: orderProduct, quantity:number}  
   | { type: 'RM_PRODUCT' , payload: number, quantity:number }  
   | { type: 'FREIGHT' , payload: number}  
   | { type: 'ADD_DISCOUNT' , discount: number , codeProduct:number }
   | { type: 'ADD_CUSTOMER', payload: cliente}


export type orderItem =  orderProduct & { quantidade:number};

export type cliente ={ 
    codigo:number
    cep:string
    cnpj:string
    endereco:string
    numero:number
}


export type objOrderReducer = {
    codigo:string
    products: orderItem[],
    cliente: cliente
    frete:number
    total_geral:number
    total_produtos:number
    descontos:number
}
