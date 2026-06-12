import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { ProductList } from "./_components/product-list/product-list"
import { RenderSelectedItem } from "./_components/render-itens-selected"
import { cliente, orderItem, orderPaymentMethod, orderService, orderSituation, parcela, payloadCalculateInstallments, payloadEditDueInstallment, serviceItem, type orderProduct } from "./types/order"
import { CustomerList } from "./_components/customer/customer-list"
import { CustomHeaderOrderComponent } from "./_components/header"
import { Installments } from "./_components/installments"
import { RenderSimpleItenInstallment } from "./_components/render-itens-installments"
import { OrderDetails } from "./_components/details"
import { ServicesList } from "./_components/services-list/services-list"
import { RenderSelectedServicesItem } from "./_components/render-itens-services-selected"
import { usePedidos } from "../../database/queryPedido/queryPedido"
import { AuthContext } from "../../contexts/auth"
import { NavigationProp } from '@react-navigation/native';
import { orderReducer } from "./reducers/orderReducer"
import { initialOrderState } from "./reducers/orderInitalState"



type Props = {
    navigation: NavigationProp<any>
    route?: any
  isNewOrder:boolean  
  orderIdEdit?: number
}


 
export const PedidoComponent = ({ navigation, isNewOrder, orderIdEdit }:Props) => {

  const useQuerypedidos = usePedidos();
  const { usuario }: any = useContext(AuthContext);

    const [state, dispatch] = useReducer(orderReducer, initialOrderState)

    const [isLoadingSaveOrder, setIsLoadingSaveOrder] = useState(false)
    const [newOrderId, setNewOrderId] = useState('0');
    const orderCodigoRef = useRef<number | null>(null);

    const [paymentMothod, setPaymentMethod] = useState<orderPaymentMethod>({ quantidade_parcelas: 1, intervalo_parcelas: 0, codigo: 0 });

    const handleAddProduct = (product: orderProduct, quantity: number) => {
        const preco = product.preco || 0;
        const descUnit = product.desconto || 0;
        const descTotal = descUnit * quantity;
        const total = (preco * quantity) - descTotal;
        dispatch({
            type: "ADD_PRODUCT",
            payload: {
                codigo: product.codigo,
                preco,
                descricao: product.descricao,
                estoque: product.estoque,
                unidade_medida: product.unidade_medida,
                quantidade: quantity,
                desconto: descUnit,
                descontos: descTotal,
                quantidade_faturada: 0,
                quantidade_separada: 0,
                total,
                fotos: product.fotos || []
            },
            quantity
        })
    }

    const handleRmProduct = (product: orderProduct, quantity: number) => { dispatch({ type: 'RM_PRODUCT', payload: product.codigo, quantity: quantity }) }
    const handleRmService = (service: orderService, quantity: number) => { dispatch({ type: 'RM_SERVICE', payload: service.codigo, quantity: quantity }) }
    const handleNewCustomer = (customer: cliente) => { dispatch({ type: "ADD_CUSTOMER", payload: customer }) }
    const handleAddFreight = (freight: number) => { dispatch({ type: "FREIGHT", payload: freight }) }
    const handleAddObservations = (observations: string) => { dispatch({ type: "EDIT_OBSERVATIONS", payload: observations }) }
    const handleDiscount = (discount: number, codeProduct: number) => { dispatch({ type: 'ADD_DISCOUNT_PRODUCT', codeProduct, discount }) }
    
    const handleDiscountService = (discount: number, codeService: number) => { dispatch({ type: 'ADD_DISCOUNT_SERVICE', codeService, discount }) }
    
    const handleCalculateInstallments = (payload: payloadCalculateInstallments) => { dispatch({ type: 'CALCULATE_INSTALLMENTS', payload }) }
    const handleAddPaymentMethod = (payload: orderPaymentMethod) => {
        setPaymentMethod(payload)
        dispatch({ type: "ADD_PAYMENT_METHOD", payload })
    }
    const handleEditDueInstallment = (payload: payloadEditDueInstallment) => { dispatch({ type: "EDIT_DUE_INSTALLMENTS", payload }) }
    const handleEditSituation = (payload: orderSituation) => { dispatch({ type: 'EDIT_SITUATION', payload: payload }) }

    const handleEditContact = ( payload:string ) =>{ dispatch({ type:'EDIT_CONTACT', payload   }) }

    const handleAddServices = (service: orderService, quantity:number)=>{ 
        dispatch(
            {
                     type: 'ADD_SERVICE',
                    payload: {
                        codigo: service.codigo,
                        aplicacao: service.aplicacao,
                        data_cadastro: service.data_cadastro,
                        data_recadastro: service.data_recadastro,
                        desconto: service.desconto,
                        descontos: service.descontos,
                        quantidade: quantity,
                        tipo_serv: service.tipo_serv,
                        total: service.total,
                        valor: service.valor 
                    },
                    quantity:quantity
                    })
    }

    useEffect(() => {
        handleCalculateInstallments({
            intervalo_parcelas: paymentMothod.intervalo_parcelas,
            quantidade_parcelas: paymentMothod.quantidade_parcelas,
            total_geral: state.total_geral
        })
    }, [state.total_geral, paymentMothod])

    
    async function generateid (){
        let newCode =0;
         let arrlastCode = await useQuerypedidos.selectLastCode();
        if(arrlastCode && arrlastCode?.length > 0 ){
                if( !arrlastCode[0].codigo ){
                   newCode = 1; 
                }
                if(arrlastCode[0].codigo && arrlastCode[0].codigo > 0 ){
                   newCode = arrlastCode[0].codigo + 1; 

                }
        }   

             setNewOrderId(  String(newCode) );
             orderCodigoRef.current = newCode;
        return newCode

    }

    useEffect(()=>{
        if(isNewOrder){
                generateid();
        }
    },[])

    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const loadedOrderRef = useRef(false);

    useEffect(() => {
        if (!isNewOrder && orderIdEdit && !loadedOrderRef.current) {
            loadedOrderRef.current = true;
            setIsLoadingOrder(true);
            (async () => {
                try {
                    const data = await useQuerypedidos.selectCompleteOrderByCode(orderIdEdit);
                    if (data) {
                        const produtos: orderItem[] = (data.produtos || []).map((p: any) => ({
                            codigo: p.codigo,
                            preco: p.preco,
                            descricao: p.descricao || '',
                            estoque: p.estoque || 0,
                            unidade_medida: p.unidade_medida || '',
                            quantidade: p.quantidade,
                            desconto: p.desconto || 0,
                            descontos: (p.desconto || 0) * p.quantidade,
                            quantidade_faturada: p.quantidade_faturada || 0,
                            quantidade_separada: p.quantidade_separada || 0,
                            total: p.total,
                            fotos: p.fotos || []
                        }));
                        const servicos: serviceItem[] = (data.servicos || []).map((s: any) => ({
                            codigo: s.codigo,
                            valor: s.valor,
                            aplicacao: s.aplicacao || '',
                            data_cadastro: s.data_cadastro || '',
                            data_recadastro: s.data_recadastro || '',
                            tipo_serv: s.tipo_serv || 0,
                            desconto: s.desconto || 0,
                            descontos: (s.desconto || 0) * s.quantidade,
                            quantidade: s.quantidade,
                            total: s.total
                        }));
                        const parcelas: parcela[] = (data.parcelas || []).map((pa: any) => ({
                            parcela: pa.parcela,
                            valor: pa.valor,
                            vencimento: pa.vencimento
                        }));
                        const cliente: cliente = {
                            codigo: data.codigo_cliente || data.cliente?.codigo || 0,
                            cep: data.cliente?.cep || '',
                            cnpj: data.cliente?.cnpj || '',
                            endereco: data.cliente?.endereco || '',
                            numero: data.cliente?.numero || 0,
                            nome: data.nome || data.cliente?.nome || ''
                        };

                        setNewOrderId(String(data.codigo || orderIdEdit));
                        setPaymentMethod({
                            codigo: data.forma_pagamento || 0,
                            intervalo_parcelas: data.intervalo_parcelas || 0,
                            quantidade_parcelas: data.quantidade_parcelas || parcelas.length || 1
                        });

                        dispatch({
                            type: 'LOAD_ORDER',
                            payload: {
                                codigo: String(data.codigo || orderIdEdit),
                                contato: data.contato || '',
                                forma_pagamento: data.forma_pagamento || 0,
                                observacoes: data.observacoes || '',
                                situacao: data.situacao || 'EA',
                                cliente,
                                data_cadastro: data.data_cadastro,
                                data_recadastro: data.data_recadastro,
                                enviado: data.enviado,
                                id_externo: data.id_externo || '',
                                quantidade_parcelas: parcelas.length, 
                                tipo_os: data.tipo_od || 0,
                                veiculo: data.veiculo || 0,
                                vendedor: data.vendedor,
                                total_geral: data.total_geral || 0,
                                total_produtos: data.total_produtos || 0,
                                total_servicos: data.total_servicos || 0,
                                descontos: data.descontos || 0,
                                frete: data.frete || 0,
                                tipo:1,
                                descontos_produtos: data.descontos_produtos || 0,
                                descontos_servicos: data.descontos_servicos || 0,
                                servicos,
                                produtos,
                                parcelas,
                            }
                        });
                    }
                } catch (e) {
                    console.log('erro ao carregar pedido para edição:', e);
                } finally {
                    setIsLoadingOrder(false);
                }
            })();
        }
    }, [orderIdEdit, isNewOrder])


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: '#EAF4FE' }}
        >

            <CustomHeaderOrderComponent
                title={ isNewOrder ? `Novo Pedido #${newOrderId}` : `Editar Pedido #${newOrderId}`}
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
                        productsIsSelected={state.produtos}
                    />

                

                    {state.produtos.length > 0 && (
                        <View style={{ paddingBottom: 10 , marginBottom:5}}>
                            <FlatList
                                data={state.produtos}
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
                            <Text style={{ color: 'red', fontSize: 12, fontWeight:"bold"}}> - R$ {state.descontos_produtos?.toFixed(2)}</Text>
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
             servicesIsSelected={state.servicos}
                  handleAddServices={handleAddServices}
                  handleDiscountService={handleDiscountService}
                    />

             {state.servicos.length > 0 && (
                        <View style={{ paddingBottom: 10 ,marginTop:10, marginBottom:5}}>
                            <FlatList
                                data={state.servicos}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) =>
                                    <RenderSelectedServicesItem 
                                        item={item}
                                        removeItem={handleRmService}
                                        hadleAddService={handleAddServices}
                                         handleDiscountService={handleDiscountService}
                                    />
                                }
                            />
                            <View style={{ flexDirection:"row", justifyContent:'space-between', marginTop:5}}>
                          <View style={{ width: 'auto', height: 20,padding:3, borderRadius: 18, backgroundColor: '#EAF4FE', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#185FED', fontSize: 12, fontWeight:"bold"}}> R$ {state.total_servicos?.toFixed(2)}</Text>
                         </View>
                            
                          <View style={{ width: 'auto', height: 20,padding:3, borderRadius: 18, backgroundColor: '#feeaea', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'red', fontSize: 12, fontWeight:"bold"}}> - R$ {state.descontos_servicos?.toFixed(2)}</Text>
                         </View>
                        </View>

                        </View>
                    )}
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
                    onPress={
                         async () => {
                        setIsLoadingSaveOrder(true);
                        try {
                            const codigo = orderCodigoRef.current || Number(newOrderId);
                            const pedidoData = {
                                codigo: codigo,
                                situacao: state.situacao,
                                contato: state.contato,
                                descontos: state.descontos,
                                forma_pagamento: state.forma_pagamento,
                                observacoes: state.observacoes,
                                total_geral: state.total_geral,
                                total_produtos: state.total_produtos,
                                total_servicos: state.total_servicos,
                                veiculo: state.veiculo,
                                tipo_os: state.tipo_os,
                                tipo: state.tipo,
                                enviado: state.enviado,
                                vendedor: usuario.codigo,
                                quantidade_parcelas: state.quantidade_parcelas,  
                                data_cadastro: state.data_cadastro,
                                data_recadastro: state.data_recadastro,

                                cliente: { codigo: state.cliente.codigo },
                                produtos: state.produtos.map((p, index ) => {
                                    ({
                                    codigo: p.codigo,
                                    quantidade: p.quantidade,
                                    preco: p.preco,
                                    desconto: p.desconto || 0,
                                    total: p.total
                                })
                            }
                            ),
                                servicos: state.servicos.map(s => ({
                                    codigo: s.codigo,
                                    quantidade: s.quantidade,
                                    valor: s.valor,
                                    desconto: s.desconto || 0,
                                    total: s.total
                                })),
                                parcelas: state.parcelas.map(pa => ({
                                    parcela: pa.parcela,
                                    valor: pa.valor,
                                    vencimento: pa.vencimento
                                }))
                            };

                            if (isNewOrder) {
                                await useQuerypedidos.createOrderByCode(
                                    pedidoData as any,
                                    codigo,
                                    String(codigo),
                                    String(codigo)
                                );
                            } else {
                                await useQuerypedidos.updateOrder(pedidoData, orderIdEdit);
                            }

                            navigation.goBack();
                        } catch (e) {
                            console.log('erro ao salvar pedido:', e);
                        } finally {
                            setIsLoadingSaveOrder(false);
                        }
                    }  
                    }

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