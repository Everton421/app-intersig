import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    ActivityIndicator
} from "react-native";

import { Ionicons, MaterialIcons, FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { RenderItemCustomer } from "./render-item-customer";
import { useClients } from "../../../../database/queryClientes/queryCliente";
import { cliente } from "../../types/order";

type props = { 
    handleNewCustomer: (customer: cliente) => void
    customer: cliente
}

export const CustomerList = ({ handleNewCustomer, customer }: props) => {

    const [pesquisa, setPesquisa] = useState<string>(""); 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isVisibleCustomers, setIsVisibleCustomers] = useState(false);

    const useQueryClients = useClients();

    useEffect(() => {
        const busca = async () => {
            setLoading(true);
            try {
                let aux: any = await useQueryClients.selectByDescription(pesquisa, 50);
                setData(aux);
            } catch (e) { 
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        busca();
    }, [pesquisa]);
   
    const handleAddCustomer = (customer: cliente) => {
        handleNewCustomer(customer);
        setIsVisibleCustomers(false);
    }
 
    return (
        <View style={{ marginHorizontal: 15, marginBottom: 10, marginTop: 10 }}>
            
            {/* --- BOTÃO PRINCIPAL (Estilizado como Card) --- */}
            <TouchableOpacity
                onPress={() => setIsVisibleCustomers(true)}
                style={{
                    backgroundColor: '#FFF',
                    borderRadius: 12,
                    padding: 15,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                {
                    customer.codigo > 0 ? 
                    (
                        <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                                <Ionicons name="person" size={24} color="#185FED" />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                                    {customer.nome}
                                </Text>
                                <Text style={{ fontSize: 13, color: '#666' }}>
                                    Cód: {customer.codigo}{customer.cnpj ? ` | ${customer.cnpj}` : ''}
                                </Text>
                            </View>
                        </View>
                            <FontAwesome name="pencil" size={16} color="#185FED" />

                        </>

                    ):
                    (
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome6 name="user-tag" size={20} color="#185FED" />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Selecionar Cliente</Text>
                        <Text style={{ fontSize: 13, color: '#666' }}>Toque para buscar na base</Text>
                    </View>
                </View>
                <MaterialIcons name="search" size={24} color="#185FED" />
                    </>
                    )
                }
                     

             
            </TouchableOpacity>

            {/* --- MODAL DE PESQUISA DE CLIENTES --- */}
            <Modal visible={isVisibleCustomers} animationType="fade" transparent={true} onRequestClose={() => setIsVisibleCustomers(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        width: "100%",
                        height: "90%",
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
                                    placeholder="Nome, código ou CNPJ..."
                                    placeholderTextColor="#999"
                                    onChangeText={(text) => setPesquisa(text)}
                                    autoFocus={true}
                                />
                            </View>
                            <TouchableOpacity onPress={() => setIsVisibleCustomers(false)}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Lista de Clientes */}
                        <View style={{ flex: 1, paddingVertical: 10 }}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#185FED" style={{ marginTop: 20 }} />
                            ) : (
                                <FlatList
                                    data={data}
                                    renderItem={({ item }) => <RenderItemCustomer handleSelect={handleAddCustomer} item={item} />}
                                    keyExtractor={(item: any) => item.codigo.toString()}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={() => (
                                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                                            <MaterialIcons name="person-search" size={50} color="#BDBDBD" />
                                            <Text style={{ color: '#999', marginTop: 10, fontSize: 16 }}>Nenhum cliente encontrado.</Text>
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