import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { orderSituation } from '../../types/order';

type props = {
    handleAddObservations: (observations: string) => void;
    observations: string;
    handleEditSituation: (situation: orderSituation) => void;
    situation: orderSituation;
}

export const OrderDetails = ({ handleAddObservations, observations, situation, handleEditSituation }: props) => {
    
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const observationsRef = useRef<TextInput>(null);

    const formatDisplayDate = (dateToFormat: Date) => {
        const day = String(dateToFormat.getDate()).padStart(2, '0');
        const month = String(dateToFormat.getMonth() + 1).padStart(2, '0');
        const year = dateToFormat.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleEvent = (event: any, selectedDate: any) => {
        setShowPicker(false);
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <View style={{
            backgroundColor: '#FFF',
            borderRadius: 12,
            marginHorizontal: 15,
            marginBottom: 20,
            padding: 15,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <MaterialIcons name="info-outline" size={22} color="#185FED" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Detalhes do Pedido</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 8 }}>Data de Emissão</Text>
                <TouchableOpacity 
                    onPress={() => setShowPicker(true)} 
                    style={{ 
                        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', 
                        borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, height: 45 
                    }}
                >
                    <Fontisto name="date" size={18} color="#185FED" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16, color: '#333', fontWeight: '500', flex: 1 }}>{formatDisplayDate(date)}</Text>
                    <MaterialIcons name="edit-calendar" size={20} color="#999" />
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={date}
                        display="default"
                        mode="date"
                        onChange={handleEvent}
                    />
                )}
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 8 }}>Situação</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity 
                        style={{
                            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: situation === 'EA' ? '#4CAF50' : '#F5F7FA',
                            borderWidth: 1, borderColor: situation === 'EA' ? '#4CAF50' : '#E0E0E0',
                            paddingVertical: 12, borderRadius: 8, elevation: situation === 'EA' ? 2 : 0, gap: 8
                        }}
                        onPress={() => handleEditSituation('EA')}
                    >
                        <FontAwesome5 name="clipboard-list" size={18} color={situation === 'EA' ? '#FFF' : '#666'} />
                        <Text style={{ color: situation === 'EA' ? '#FFF' : '#666', fontWeight: 'bold', fontSize: 15 }}>Orçamento</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={{
                            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: situation === 'AI' ? '#185FED' : '#F5F7FA',
                            borderWidth: 1, borderColor: situation === 'AI' ? '#185FED' : '#E0E0E0',
                            paddingVertical: 12, borderRadius: 8, elevation: situation === 'AI' ? 2 : 0, gap: 8
                        }}
                        onPress={() => handleEditSituation('AI')}
                    >
                        <FontAwesome5 name="clipboard-check" size={18} color={situation === 'AI' ? '#FFF' : '#666'} />
                        <Text style={{ color: situation === 'AI' ? '#FFF' : '#666', fontWeight: 'bold', fontSize: 15 }}>Pedido</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 8 }}>Observações</Text>
                <TextInput
                    ref={observationsRef}
                    style={{ 
                        backgroundColor: '#F5F7FA', borderWidth: 1, borderColor: '#E0E0E0', 
                        borderRadius: 8, padding: 12, minHeight: 100, textAlignVertical: 'top', 
                        color: '#333', fontSize: 15
                    }}
                    multiline={true}
                    scrollEnabled={false} // Crucial para o ScrollView da tela principal fazer o scroll automático!
                    placeholder="Digite aqui as observações..."
                    placeholderTextColor="#999"
                    value={observations}
                    onChangeText={handleAddObservations}
                />
            </View>
        </View>
    );
};