import { Text, TouchableOpacity, View } from "react-native";
import { parcela } from "../../types/order";
import { Fontisto } from "@expo/vector-icons"; 

export const RenderSimpleItenInstallment = ({ item }: { item: parcela }) => {
    const [ano, mes, dia] = item.vencimento.split('-');

    return (
        <TouchableOpacity 
            onPress={() => console.log(item)}
            style={{
                backgroundColor: '#FFF',
                borderRadius: 12,
                padding: 15,
                marginHorizontal: 6, // Margem menor para listas horizontais
                marginVertical: 5,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                minWidth: 140, // Garante que todos os cards tenham um tamanho base uniforme
            }}
        >
            {/* --- CABEÇALHO (Número da Parcela) --- */}
            <View style={{ 
                alignSelf: 'flex-start', 
                backgroundColor: '#E3F2FD', 
                paddingHorizontal: 8, 
                paddingVertical: 4, 
                borderRadius: 6,
                marginBottom: 10
            }}>
                <Text style={{ color: '#185FED', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {item.parcela}ª Parcela
                </Text>
            </View>

            {/* --- VALOR DA PARCELA --- */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 6 }}>
                R$ {item.valor.toFixed(2)}
            </Text>

            {/* --- DATA DE VENCIMENTO --- */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Fontisto name="date" size={12} color="#999" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 13, color: '#666', fontWeight: '500' }}>
                    {dia}/{mes}/{ano}
                </Text>
            </View>
            
        </TouchableOpacity>
    );
};