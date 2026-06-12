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


 
export type orderService = {
    codigo:number
    valor:number
    aplicacao:string
    data_cadastro:string
    data_recadastro:string
    tipo_serv:number
    desconto:number
    descontos:number
    quantidade:number
    total:number
}

type photoOrdeProduct = { 
    link:string
}

export type payloadCalculateInstallments = {
    intervalo_parcelas : number
    total_geral: number
    quantidade_parcelas:number
}

export type orderPaymentMethod = {
    codigo:number   
     intervalo_parcelas : number
    quantidade_parcelas:number
}

export type payloadEditDueInstallment = {
    parcela:number // sequencia da parcela
    vencimento:string
}

export  type actionOrderReducer =   
    { type: 'ADD_SERVICE' , payload: orderService, quantity:number} 
      
   | { type: 'RM_SERVICE' , payload: number, quantity:number }  
   | { type: 'ADD_DISCOUNT_SERVICE' , discount: number , codeService:number }
   |
    { type: 'ADD_PRODUCT' , payload: orderProduct, quantity:number}  
   | { type: 'RM_PRODUCT' , payload: number, quantity:number }  
   | { type: 'FREIGHT' , payload: number}  
   
   | { type: 'ADD_DISCOUNT_PRODUCT' , discount: number , codeProduct:number }
   | { type: 'ADD_CUSTOMER', payload: cliente}
    | { type: 'CALCULATE_INSTALLMENTS', payload :  payloadCalculateInstallments}
    | { type: 'ADD_PAYMENT_METHOD', payload :  orderPaymentMethod}
    | { type: 'EDIT_DUE_INSTALLMENTS', payload:payloadEditDueInstallment }
    | { type: 'EDIT_OBSERVATIONS', payload: string}
    | { type: 'EDIT_SITUATION', payload: orderSituation}
    | { type: 'EDIT_CONTACT', payload: string}
    | { type: 'LOAD_ORDER', payload: objOrderReducer }

export type orderItem =  orderProduct & { quantidade:number};
export type serviceItem = orderService & { quantidade: number };
export type cliente ={ 
    codigo:number
    cep:string
    cnpj:string
    endereco:string
    numero:number
    nome:string
}

export type parcela = {
    valor: number
    vencimento:string
    parcela:number
}
export type orderSituation =  
    'EA' | 'AI' | 'FI' | 'RE' | 'FP' 
 

export type objOrderReducer = {
    codigo:string
    produtos: orderItem[]  ,
    servicos:orderService[]  ,
    parcelas: parcela[],
    cliente: cliente
    forma_pagamento: number
    frete:number
    total_geral:number
    total_produtos:number
    total_servicos:number
    descontos:number
    descontos_servicos:number
    descontos_produtos:number
    observacoes:string
    situacao: orderSituation
    contato:string
    id_externo:string  
    vendedor:number 
    enviado: 'S '| 'N' 
    quantidade_parcelas:number,
    data_cadastro:string,
    data_recadastro:string,
    veiculo:number,
    tipo_os:number,
    tipo:number
}
