import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { CustomHeader } from "../../components/custom-header" // Cuidado com esse caminho
import { useEffect, useReducer, useState } from "react"
import { ProductList } from "./_components/product-list/product-list"
import { RenderSelectedItem } from "./_components/render-itens-selected"
import { actionOrderReducer, cliente, objOrderReducer, orderItem, orderPaymentMethod, orderSituation, parcela, payloadCalculateInstallments, payloadEditDueInstallment, serviceItem, type orderProduct } from "./types/order"
import { CustomerList } from "./_components/customer/customer-list"
import { CustomHeaderOrderComponent } from "./_components/header"
import { Installments } from "./_components/installments"
import { configMoment } from "../../services/moment"
import { addDays, format } from "date-fns"
import { RenderSimpleItenInstallment } from "./_components/render-itens-installments"
import { OrderDetails } from "./_components/details"
import { TextInput } from "react-native-gesture-handler"
import { ServicesList } from "./_components/services-list/services-list"

function orderReducer(state: objOrderReducer, action: actionOrderReducer) {
    // ... MANTER TODO O SEU CÓDIGO DO REDUCER INTACTO AQUI ...
    switch(action.type){
        case 'ADD_SERVICE':{ 
                const serviceToadd = action.payload
                const { quantity } = action;
              const serviceExists = state.services.find( service  =>   service.codigo === serviceToadd.codigo   )
                let newServices: serviceItem[];
                    if(serviceExists){
                            newServices = state.services.map( ( item ) =>{ 
                                    if(item.codigo === serviceToadd.codigo){
                                        const newQuantity = item.quantidade = quantity;
                                        const newDesconto = newQuantity * item.desconto; 
                                         const newTotal = (newQuantity * item.valor) - newDesconto;  
                                        return { ...item, quantidade: newQuantity, descontos:newDesconto,desconto: item.desconto, total:newTotal }
                                    }else{
                                        return item;
                                    }   
                                }
                             )
                    }else{
                          newServices = [ ...state.services,{ ...serviceToadd, quantidade:quantity}];
                    }
                    let newTotalGeralservicesOrder = 0;
                    let newTotalDescountsOrder = 0;   
                    let newTotalProductsOrder=0;
                    let newTotalGeral = 0;

                    for( const item of newServices){
                            newTotalGeralservicesOrder+= item.total;
                            newTotalDescountsOrder+=item.desconto
                            newTotalProductsOrder+=(item.quantidade * item.preco)
                            newTotalGeral+= item.total;
                        }
                        for(const item of state.products){
                            newTotalGeral+= item.total;
                            newTotalDescountsOrder+= item.desconto;
                        }
                        newTotalGeral+= state.frete;
              return { 
                ...state,
                  total_geral: newTotalGeral, 
                  total_servicos: newTotalGeralservicesOrder,
                  descontos: newTotalDescountsOrder,
                  servicos:  newServices
                };
            }
    case 'RM_SERVICE': {
            const { quantity } = action;
                const newServices = state.services.map((item) =>{
                   if(item.codigo === action.payload  && item.quantidade >= quantity){    
                    let newQuantity = item.quantidade - quantity
                    return { ...item, quantidade: newQuantity, total: (newQuantity * item.valor) - item.desconto }
                   }else{
                    return item
                   }
               }).filter((item) =>  item.quantidade > 0)
                    let newTotalGeral = 0;
                    let newTotalDescountsOrder = 0;   
                    let newTotalServicesOrder = 0;
                    for( const item of newServices){
                            newTotalGeral+= item.total;
                            newTotalDescountsOrder+=item.descontos
                            newTotalServicesOrder+=(item.quantidade * item.valor)
                        } 

                    for(const item of state.products){
                          newTotalGeral+= item.total;
                            newTotalDescountsOrder+=item.descontos
                    }
                            newTotalGeral+=state.frete;
                        
              return { 
                ...state,
                  total_geral: newTotalGeral,
                  total_serviceos: newTotalServicesOrder,
                  descontos: newTotalDescountsOrder,
                  servicos: newServices
                 };
            }
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
                    let newTotalGeral = 0;
                    let newTotalDescountsOrder = 0;   
                    let newTotalProductsOrder=0;
                    for( const item of newProducts){
                            newTotalGeral+= item.total;
                            newTotalDescountsOrder+=item.desconto
                            newTotalProductsOrder+=(item.quantidade * item.preco)
                        } 
                        for(const item of state.services){
                            newTotalGeral+= item.total;
                            newTotalDescountsOrder+=item.desconto
                        }
                      newTotalGeral+= state.frete;

              return {
                 ...state,
                   total_geral: newTotalGeral,
                    total_produtos: newTotalProductsOrder,
                    descontos: newTotalDescountsOrder,
                    products: newProducts
                 };
            }


        case 'RM_PRODUCT': {
            const { quantity } = action;
                const newProducts = state.products.map((item) =>{
                   if(item.codigo === action.payload  && item.quantidade >= quantity){    
                    let newQuantity = item.quantidade - quantity
                    return { ...item, quantidade: newQuantity, total: (newQuantity * item.preco) - item.desconto }
                   }else{
                    return item
                   }
               }).filter((item) =>  item.quantidade > 0)
                    let newTotalGeral = 0;
                    let newTotalDescountsOrder = 0;   
                    let newTotalProductsOrder=0;
                    for( const item of newProducts){
                            newTotalGeral+= item.total;
                            newTotalDescountsOrder+=item.descontos
                            newTotalProductsOrder+=(item.quantidade * item.preco)
                        } 

                        for(const item of state.services){
                            newTotalGeral+=item.total;
                            newTotalDescountsOrder+=item.descontos
                        }
                            newTotalGeral+=state.frete;
                        
              return { 
                ...state,
                  total_geral: newTotalGeral,
                  total_produtos: newTotalProductsOrder,
                  descontos: newTotalDescountsOrder,
                  products: newProducts
                 };
            }
        case 'FREIGHT':{ return { ...state, frete: action.payload, total_geral: state.total_geral + action.payload }; }    
        case 'ADD_DISCOUNT_SERVICE':{
            const {   codeService, discount } = action
                             const newServices = state.services.map( ( item ) =>{ 
                                        if(item.codigo === codeService ){
                                            const newDiscounts = item.quantidade * discount; 
                                             let newTotal = (item.quantidade * item.valor) - newDiscounts;  
                                             if(newTotal <  0 ){ newTotal = 0 }
                                         return { ...item, descontos:newDiscounts, desconto:discount , total:newTotal }          
                                        }else{
                                            return item;
                                        }
                                }
                             )
                    let newTotalGeral = 0;
                    let newTotalDescountsOrder = 0;   
                    let newTotalservicesOrder=0;
                    for( const item of newServices){
                            newTotalGeral+= item.total;
                            newTotalDescountsOrder+=item.descontos
                            newTotalservicesOrder+=(item.quantidade * item.valor)
                        } 

                        for(const item of state.products){
                             newTotalGeral+= item.total;
                            newTotalDescountsOrder+=item.descontos
                        }

              return { ...state, total_geral: newTotalGeral, total_services: newTotalservicesOrder, descontos: newTotalDescountsOrder, services: newServices };
        }

        case 'ADD_CUSTOMER':{
            const { payload } = action;
            const { cep, cnpj, codigo, endereco, numero, nome} = payload;
            return { ...state, cliente:{ cep, cnpj, codigo, endereco, numero,nome } }
        }
        case 'CALCULATE_INSTALLMENTS': {
            const { payload } = action;
            const { intervalo_parcelas,quantidade_parcelas, total_geral } = payload;
            let novas_parcelas:parcela[] = [];
            let valorParcelas =   total_geral / quantidade_parcelas;
            for (let i = 1; i <=  quantidade_parcelas; i++) {
                const vencimento = addDays(new Date(), intervalo_parcelas * i);
                novas_parcelas.push({ parcela: i ,valor: valorParcelas, vencimento: format(vencimento, 'yyyy-MM-dd') });
            }
            return { ...state, parcelas: novas_parcelas }
        }   
        case 'ADD_PAYMENT_METHOD':{
            const { payload } = action;
            const { codigo, intervalo_parcelas, quantidade_parcelas   } = payload
            return { ...state, forma_pagamento: codigo }
        }
        case 'EDIT_DUE_INSTALLMENTS':{
                const { payload }= action
                const { parcela, vencimento} = payload           
                const newInstallments = state.parcelas.map( (i)=>{
                    if( i.parcela === parcela){ i.vencimento = vencimento }
                    return i
                })
                return { ...state, parcelas: newInstallments }
        }
        case 'EDIT_OBSERVATIONS':{ return { ...state, observacoes: action.payload } }
        case 'EDIT_SITUATION':{ return { ...state, situacao: action.payload } }
        case "EDIT_CONTACT":{
            return {
                ...state, 
                contato:action.payload
            }
        } 
    }   
}

export const PedidoComponent = ({ navigation }: any) => {

    const moment = configMoment();

    const initalValuecustomer: cliente = { cep: '', cnpj: '', codigo: 0, endereco: '', numero: 0, nome: ''}
    const initialInstallments: parcela = { parcela: 0, valor: 0, vencimento: moment.dataHoraAtual() }
    const initialBodyOrder:objOrderReducer ={ 
        codigo: '1',
         contato:'', forma_pagamento: 0, observacoes: '', situacao: 'EA', cliente: initalValuecustomer, total_geral: 0, total_produtos: 0, descontos: 0, frete: 0, 
        descontos_produtos:0,
        descontos_servicos:0,
        services:[
        ],
         products: [ ], parcelas: [initialInstallments],

        }
    const [state, dispatch] = useReducer(orderReducer, initialBodyOrder)

    const [isLoadingSaveOrder, setIsLoadingSaveOrder] = useState(false)
    const [paymentMothod, setPaymentMethod] = useState<orderPaymentMethod>({ quantidade_parcelas: 1, intervalo_parcelas: 0, codigo: 0 });

    const handleAddProduct = (product: orderProduct, quantity: number) => {
        dispatch({
            type: "ADD_PRODUCT",
            payload: {
                codigo: product.codigo, preco: product.preco, descricao: product.descricao, estoque: product.estoque, unidade_medida: product.unidade_medida, quantidade: product.quantidade, desconto: product.desconto, descontos: product.descontos, quantidade_faturada: 0, quantidade_separada: 0, total: product.total, fotos: product.fotos
            },
            quantity
        })
    }

    const handleRmProduct = (product: orderProduct, quantity: number) => { dispatch({ type: 'RM_PRODUCT', payload: product.codigo, quantity: quantity }) }
    const handleNewCustomer = (customer: cliente) => { dispatch({ type: "ADD_CUSTOMER", payload: customer }) }
    const handleAddFreight = (freight: number) => { dispatch({ type: "FREIGHT", payload: freight }) }
    const handleAddObservations = (observations: string) => { dispatch({ type: "EDIT_OBSERVATIONS", payload: observations }) }
    const handleDiscount = (discount: number, codeProduct: number) => { dispatch({ type: 'ADD_DISCOUNT_PRODUCT', codeProduct, discount }) }
    
    const handleCalculateInstallments = (payload: payloadCalculateInstallments) => { dispatch({ type: 'CALCULATE_INSTALLMENTS', payload }) }
    const handleAddPaymentMethod = (payload: orderPaymentMethod) => {
        setPaymentMethod(payload)
        dispatch({ type: "ADD_PAYMENT_METHOD", payload })
    }
    const handleEditDueInstallment = (payload: payloadEditDueInstallment) => { dispatch({ type: "EDIT_DUE_INSTALLMENTS", payload }) }
    const handleEditSituation = (payload: orderSituation) => { dispatch({ type: 'EDIT_SITUATION', payload: payload }) }

const handleEditContact = ( payload:string ) =>{
    dispatch({
        type:'EDIT_CONTACT',
        payload
    })
}
    useEffect(() => {
        handleCalculateInstallments({
            intervalo_parcelas: paymentMothod.intervalo_parcelas,
            quantidade_parcelas: paymentMothod.quantidade_parcelas,
            total_geral: state.total_geral
        })
    }, [state.total_geral, paymentMothod])

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: '#EAF4FE' }}
        >

            <CustomHeaderOrderComponent
                title="Novo Pedido"
                onBack={() => navigation.goBack()}
            />

            <ScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} 
            >
                { /* LISTA CLIENTES*/}
                <CustomerList handleNewCustomer={handleNewCustomer} customer={state.cliente}/>
 
 

        {/* LISTA DE PRODUTOS*/}
            <View style={{
                    backgroundColor: '#FFF',
                    borderRadius: 12,
                    marginHorizontal: 10,
                    marginBottom: 20,
                    padding: 10,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3
                }}>

            <ProductList
                        handleAddProduct={handleAddProduct}
                        handleDiscount={handleDiscount}
                    />

                

                    {state.products.length > 0 && (
                        <View style={{ paddingBottom: 10 , marginBottom:5}}>
                            <FlatList
                                data={state.products}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) =>
                                    <RenderSelectedItem item={item}
                                        removeItem={handleRmProduct}
                                        handleAddProduct={handleAddProduct}
                                        handleDiscount={handleDiscount}
                                    />
                                }
                            />
                            <View style={{ flexDirection:"row", justifyContent:'space-between', marginTop:5}}>
                          <View style={{ width: 'auto', height: 20,padding:3, borderRadius: 18, backgroundColor: '#EAF4FE', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#185FED', fontSize: 12, fontWeight:"bold"}}> R$ {state.total_produtos?.toFixed(2)}</Text>
                         </View>
                            
                          <View style={{ width: 'auto', height: 20,padding:3, borderRadius: 18, backgroundColor: '#feeaea', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'red', fontSize: 12, fontWeight:"bold"}}> - R$ {state.descontos?.toFixed(2)}</Text>
                         </View>
                        </View>

                        </View>
                    )}
            </View>
             
        {/* LISTA DE SERVICOS*/}
             
                 <View style={{
                    backgroundColor: '#FFF',
                    borderRadius: 12,
                    marginHorizontal: 10,
                    marginBottom: 20,
                    padding: 10,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3
                }}>


             <ServicesList
                    />
                </View>
             
                {/** --- PARCELAS --- */}
          <View style={{
                        backgroundColor: '#FFF',
                        borderRadius: 12,
                        marginHorizontal: 10,
                        marginBottom: 20,
                        padding: 10,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3
                    }}>

                    <View style={{ paddingBottom: 10 }}>
                        <Installments
                            parcelas={state.parcelas}
                            paymentMothod={paymentMothod}
                            handleAddPaymentMethod={handleAddPaymentMethod}
                            handleEditDueInstallment={handleEditDueInstallment}
                        />

                        <FlatList
                            data={state.parcelas}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) =>
                                <RenderSimpleItenInstallment item={item} />
                            }
                        />
                    </View>
                    <View style={{ flexDirection:"row" }}>
                         <Text style={{ color: '#185FED', fontWeight: 'bold' }}> parcelas </Text>  

                          <View style={{ width: 'auto', height: 'auto', padding:2, borderRadius: 18, backgroundColor: '#EAF4FE', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#185FED', fontWeight: 'bold' }}>{state.parcelas.length } </Text>  
                          </View>
                     </View>
                </View>

                {/* --- DETALHES --- */}
                <OrderDetails
                    handleAddObservations={handleAddObservations}
                    observations={state.observacoes}
                    handleEditSituation={handleEditSituation}
                    situation={state.situacao}
                    contact={state.contato}
                    handleEditContact={handleEditContact}
                />

            </ScrollView>

            {/* Footer */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#333' }}>
                        Total: <Text style={{ color: '#185FED', fontSize: 18 }}>R$ {state.total_geral?.toFixed(2)}</Text>
                    </Text>
                    <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                        Descontos: R$ {state.descontos.toFixed(2)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => console.log(state)}
                >
                    {isLoadingSaveOrder ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#FFF' }}>Salvar</Text>
                    )}
                </TouchableOpacity>
            </View>

            {isLoadingSaveOrder && (
                <View style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 30, alignItems: 'center', elevation: 10 }}>
                        <ActivityIndicator size={50} color="#185FED" />
                        <Text style={{ marginTop: 15, color: '#333', fontWeight: '600' }}>Salvando...</Text>
                    </View>
                </View>
            )}

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    bottomBar: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    saveButton: {
        backgroundColor: '#185FED',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        elevation: 4,
    }
})