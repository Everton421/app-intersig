import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { orderPaymentMethod, parcela, payloadEditDueInstallment } from "../../types/order";
import { useFormasDePagamentos } from "../../../../database/queryFormasPagamento/queryFormasPagamento";
import { parseDateSafe } from "../../../../services/formatStrings";

type props = {
    handleAddPaymentMethod: (payload: orderPaymentMethod) => void,
    parcelas: parcela[],
    paymentMothod: orderPaymentMethod,
    handleEditDueInstallment: (payload: payloadEditDueInstallment) => void
}

type databasePaymentMethod = {
    codigo: number
    descricao: string
    desc_maximo: number
    parcelas: number
    intervalo: number
    data_cadastro: string
    data_recadastro: string
    recebimento: number
}

export const Installments = ({ parcelas, paymentMothod, handleAddPaymentMethod, handleEditDueInstallment }: props) => {

    const [visible, setVisible] = useState(false);
    const [databasePaymentMethods, setDatabasePaymentMethods] = useState<databasePaymentMethod[]>([]);
    const [press, setPress] = useState<boolean>(false);
    const [selectedForma, setSelectedForma] = useState<any>(null);
    const [date] = useState(new Date());
    const useQueryFpgt = useFormasDePagamentos();

    useEffect(() => {
        async function busca() {
            let aux = await useQueryFpgt.selectAll() as databasePaymentMethod[];
            setDatabasePaymentMethods(aux);
        }
        busca();
    }, [press]);

    function selecionaFormaPagamento(item: databasePaymentMethod) {
        setSelectedForma(item); // Salva apenas para display visual
        handleAddPaymentMethod({
            codigo: item.codigo,
            intervalo_parcelas: item.intervalo,
            quantidade_parcelas: Number(item.parcelas)
        });
        setPress(false);
    }

    // --- COMPONENTE VISUAL: LISTA DE FORMAS DE PAGAMENTO ---
    const ItemFormas = ({ item }: { item: databasePaymentMethod }) => {
        const isSelected = selectedForma?.codigo === item.codigo;
        return (
            <TouchableOpacity
                onPress={() => selecionaFormaPagamento(item)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 15,
                    backgroundColor: isSelected ? '#E3F2FD' : '#FFF',
                    borderRadius: 12,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: isSelected ? '#185FED' : '#E0E0E0',
                    elevation: 1
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isSelected ? '#185FED' : '#F5F7FA', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="credit-card" size={20} color={isSelected ? "#FFF" : "#666"} />
                    </View>
                    <View>
                        <Text style={{ color: isSelected ? '#185FED' : '#333', fontWeight: "bold", fontSize: 16 }}>
                            {item.descricao}
                        </Text>
                        <Text style={{ color: '#666', fontSize: 12 }}>
                            Cód: {item.codigo} | Padrão: {item.parcelas}x
                        </Text>
                    </View>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color="#185FED" />}
            </TouchableOpacity>
        );
    };

    // --- COMPONENTE VISUAL: LISTA DE PARCELAS ---
    const ItemParcelas = ({ item }: { item: parcela }) => {
        const [itemPickerVisible, setItemPickerVisible] = useState(false);

        const handleEvent = (event: any, selectedDate: any) => {
            const currentDate = selectedDate || date;
            setItemPickerVisible(false); // Fecha o modal primeiro
            
            if (event.type === 'set' && selectedDate) {
                const dia = String(currentDate.getDate()).padStart(2, '0');
                const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
                const ano = currentDate.getFullYear();
                const vencimento = `${ano}-${mes}-${dia}`;

                handleEditDueInstallment({
                    parcela: item.parcela,
                    vencimento: vencimento
                });
            }
        };

        const [ano, mes, dia] = item.vencimento.split('-');

        return (
            <View style={{
                backgroundColor: '#FFF',
                marginBottom: 8,
                padding: 15,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EAF4FE', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#185FED', fontWeight: 'bold' }}>{item.parcela}</Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: 'bold', color: '#333', fontSize: 16 }}>
                            R$ {item.valor.toFixed(2)}
                        </Text>
                        <TouchableOpacity onPress={() => setItemPickerVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Fontisto name="date" size={12} color="#185FED" style={{ marginRight: 4 }} />
                            <Text style={{ color: '#185FED', fontSize: 13, fontWeight: '500', textDecorationLine: 'underline' }}>
                                Vencimento: {dia}/{mes}/{ano}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {itemPickerVisible && (
                    <DateTimePicker
                        value={parseDateSafe(item.vencimento)}
                        display="default"
                        mode="date"
                        onChange={handleEvent}
                    />
                )}
            </View>
        );
    };

    return (
        <View style={{ marginHorizontal: 15, marginBottom: 10 }}>
            
            {/* BOTÃO PRINCIPAL DE ABRIR MODAL */}
            <TouchableOpacity 
                onPress={() => setVisible(true)}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="credit-card" size={24} color="#185FED" />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Condição de Pagamento</Text>
                        <Text style={{ fontSize: 13, color: '#666' }}>
                            {parcelas.length} {parcelas.length === 1 ? 'Parcela' : 'Parcelas'} {selectedForma ? `| ${selectedForma.descricao}` : ''}
                        </Text>
                    </View>
                </View>
                <AntDesign name="right" size={20} color="#BDBDBD" />
            </TouchableOpacity>

            {/* MODAL PRINCIPAL DAS CONFIGURAÇÕES DE PAGAMENTO */}
            <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={() => setVisible(false)}>
                {/* O KeyboardAvoidingView deve ser o wrapper primário para calcular o flex corretamente */}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'center', alignItems: 'center' }}>
                        
                        <View style={{ width: "100%",minHeight:'85%', maxHeight: "85%", backgroundColor: "#FFF", borderRadius: 16, overflow: 'hidden', elevation: 10 }}>
                            
                            {/* Header Modal */}
                            <View style={{ backgroundColor: '#185FED', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Opções de Pagamento</Text>
                                <TouchableOpacity onPress={() => setVisible(false)}>
                                    <Ionicons name="close" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            {/* flexShrink: 1 garante que a view encolha quando o teclado ou a lista crescer */}
                            <View style={{ padding: 20, flexShrink: 1 }}>
                                
                                {/* Botão para Selecionar Forma de Pagamento */}
                                <Text style={{ color: '#555', fontWeight: '600', fontSize: 13, marginBottom: 5 }}>Forma de Pagamento</Text>
                                <TouchableOpacity 
                                    onPress={() => setPress(true)} 
                                    style={{
                                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                        backgroundColor: '#F5F7FA', borderWidth: 1, borderColor: '#E0E0E0',
                                        borderRadius: 8, paddingHorizontal: 12, height: 45, marginBottom: 15
                                    }}
                                >
                                    <Text style={{ color: selectedForma ? '#333' : '#999', fontSize: 15, fontWeight: '500' }}>
                                        {selectedForma ? selectedForma.descricao : "Selecione a forma..."}
                                    </Text>
                                    <AntDesign name="down" size={16} color="#666" />
                                </TouchableOpacity>

                                {/* Inputs de Parcelas e Intervalo */}
                                <View style={{ flexDirection: 'row', gap: 15, marginBottom: 20 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#555', fontWeight: '600', fontSize: 13, marginBottom: 5 }}>Qtd. Parcelas</Text>
                                        <View style={{ backgroundColor: '#F5F7FA', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, height: 45, justifyContent: 'center' }}>
                                            <TextInput
                                                defaultValue={String(paymentMothod.quantidade_parcelas) || "1"}
                                                style={{ color: '#333', fontSize: 16 }}
                                                onChangeText={(value) => {
                                                    handleAddPaymentMethod({
                                                        ...paymentMothod,
                                                        quantidade_parcelas: Number(value)
                                                    });
                                                }}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#555', fontWeight: '600', fontSize: 13, marginBottom: 5 }}>Intervalo (Dias)</Text>
                                        <View style={{ backgroundColor: '#F5F7FA', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, height: 45, justifyContent: 'center' }}>
                                            <TextInput
                                                defaultValue={String(paymentMothod.intervalo_parcelas) || "0"}
                                                style={{ color: '#333', fontSize: 16 }}
                                                onChangeText={(value) => {
                                                    handleAddPaymentMethod({
                                                        ...paymentMothod,
                                                        intervalo_parcelas: Number(value)
                                                    });
                                                }}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ height: 1, backgroundColor: '#F0F0F0', marginBottom: 15 }} />

                                {/* Lista de Parcelas Geradas */}
                                <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Resumo das Parcelas</Text>
                                
                                {/* O flexShrink: 1 aqui garante que a FlatList possa rolar sem vazar da tela */}
                                <FlatList
                                    style={{ flexShrink: 1 }}
                                    data={parcelas}
                                    renderItem={({ item }) => <ItemParcelas item={item} />}
                                    keyExtractor={(item) => item.parcela.toString()}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* MODAL INTERNO: SELEÇÃO DE FORMA DE PAGAMENTO */}
            <Modal visible={press} animationType="slide" transparent={true} onRequestClose={() => setPress(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", maxHeight: "80%", elevation: 10 }}>
                        <View style={{ backgroundColor: '#185FED', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Escolha a Forma</Text>
                            <TouchableOpacity onPress={() => setPress(false)}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={databasePaymentMethods}
                            renderItem={({ item }) => <ItemFormas item={item} />}
                            keyExtractor={(i: any) => i.codigo.toString()}
                            contentContainerStyle={{ padding: 20 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};