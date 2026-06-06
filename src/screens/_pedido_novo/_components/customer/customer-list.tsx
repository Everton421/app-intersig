import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    ActivityIndicator,
    Image,
} from "react-native";

import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useProducts } from "../../../../database/queryProdutos/queryProdutos";
import { useFotosProdutos } from "../../../../database/queryFotosProdutos/queryFotosProdutos";
import { RenderItemCustomer } from "./render-item-customer";
import { useClients } from "../../../../database/queryClientes/queryCliente";
import { cliente } from "../../types/order";

type props = { 
    handleNewCustomer : (customer: cliente)=>void
}
export const CustomerList = ({handleNewCustomer}: props) => {

    const [pesquisa, setPesquisa] = useState<any>("a"); // Inicia vazio para não buscar tudo de cara se não quiser
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isVisibleCustomers, setIsVisibleCustomers] = useState(false);

    const useQueryProdutos = useProducts();
    const useQueryFotos = useFotosProdutos();

    const [ isVisibleModalSelectedProduct , setIsVisibleModalSelectedProduct ] = useState(false);
    const useQueryClients = useClients();

    ////////////////////
         useEffect(() => {
           const busca = async () => {
               try{
                 let aux:any = await  useQueryClients.selectByDescription(pesquisa,50);
                 setData(aux)
                 console.log(aux)
               }catch(e){ console.log(e)}
           };
           busca();
   
           if (pesquisa === null || pesquisa === '') {
               setPesquisa('');
             }
         }, [pesquisa]);
   
     ////////////////////
     /*useEffect(
       ()=>{
         async function init() {
             if(codigo_orcamento && codigo_orcamento > 0 ){
   
                 setSelectedItem({})
   
                 let responsePedido:any = await useQuerypedidos.selectByCode(codigo_orcamento)
               
                 const pedido = responsePedido[0];
                  if(pedido.codigo_cliente && pedido.codigo_cliente > 0  ){
                    try{
                     setLoadingClient(true)
                       let cliente:any = await useQueryClients.selectByCode(pedido.codigo_cliente);
   
                       setSelectedItem(cliente[0])
   
                       setOrcamento((prevOrcamento: OrcamentoModel) => ({
                         ...prevOrcamento,
                         cliente: cliente[0]
                       }));
                     setLoadingClient(false)
                    }catch(e){
                      console.log("Erro ao consultar o cliente do pedido:",codigo_orcamento)
                    } finally{
                     setLoadingClient(false)
                    }
                  }
             }
         }
         init()
   
       },[]
     )
     */
    function selecionarItem(item: any) {
        setIsVisibleModalSelectedProduct(true)
        //setVisibleProdutos(false);
    }
     
 
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                onPress={() => setIsVisibleCustomers(true)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFF",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    paddingHorizontal: 15,
                    height: 47,
                    elevation: 2
                }}
            >
                <FontAwesome name="search" size={18} color="#185FED" style={{ marginRight: 10 }} />
                <Text style={{ color: "#757575", fontSize: 16 }}>
                    {   "Pesquisar Clientes..."}
                </Text>
            </TouchableOpacity>

            <Modal visible={isVisibleCustomers} animationType="fade" transparent={true} onRequestClose={() => setIsVisibleCustomers(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        width: "90%",
                        height: "80%",
                        backgroundColor: "#F5F7FA",
                        borderRadius: 16,
                        overflow: 'hidden',
                        elevation: 10
                    }}>
                        {/* Header Modal */}
                        <View style={{ backgroundColor: '#185FED', padding: 15, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#FFF',
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                height: 40,
                                marginRight: 10
                            }}>
                                <Ionicons name="search" size={20} color="#999" style={{ marginRight: 5 }} />
                                <TextInput
                                    style={{ flex: 1, color: '#333' }}
                                    placeholder="Digite para buscar..."
                                    placeholderTextColor="#999"
                                    onChangeText={(text) => setPesquisa(text)}
                                    autoFocus={true}
                                />
                            </View>
                            <TouchableOpacity onPress={() => setIsVisibleCustomers(false)}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Lista */}
                        <View style={{ flex: 1, paddingVertical: 10 }}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#185FED" style={{ marginTop: 20 }} />
                            ) : (
                                <FlatList
                                    data={data}
                                    renderItem={ ({item})=> <RenderItemCustomer handleSelect={handleNewCustomer} item={item}/> }
                                    keyExtractor={(item:any) => item.codigo.toString()}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={() => (
                                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                                            <Text style={{ color: '#999' }}>Nenhum cliente encontrado.</Text>
                                        </View>
                                    )}
                                />
                            )}
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};