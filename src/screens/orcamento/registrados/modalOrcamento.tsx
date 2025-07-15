import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Usando ícones para um visual mais limpo. Instale com: npx expo install @expo/vector-icons

// --- Constantes de Estilo (Melhor prática para cores e tamanhos) ---
const COLORS = {
    primary: '#007BFF',
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    gray: '#DEE2E6',
    darkGray: '#6C757D',
    text: '#212529',
    background: 'rgba(0, 0, 0, 0.6)',
    danger: '#DC3545',
};

const SIZES = {
    padding: 16,
    borderRadius: 12,
    base: 8,
};

// --- Componentes de Item da Lista (Extraídos para performance e clareza) ---

// Componente para exibir uma linha de informação (ex: Cliente: Nome do Cliente)
const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

// Componente para cabeçalhos de seção (PRODUTOS, SERVIÇOS, etc.)
const SectionHeader = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

const ProdutoItem = ({ item }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.descricao}</Text>
            <Text style={styles.cardSubtitle}>Código: {item.codigo}</Text>
            <View style={styles.cardDetails}>
                <Text style={styles.detailText}>Qtd: {item.quantidade}</Text>
                <Text style={styles.detailText}>Unit.: R$ {item.preco.toFixed(2)}</Text>
                <Text style={[styles.detailText, styles.totalText]}>Total: R$ {item.total.toFixed(2)}</Text>
            </View>
        </View>
    );
};

const ServicoItem = ({ item }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.aplicacao}</Text>
            <Text style={styles.cardSubtitle}>Código: {item.codigo}</Text>
            <View style={styles.cardDetails}>
                <Text style={styles.detailText}>Qtd: {item.quantidade}</Text>
                <Text style={styles.detailText}>Unit.: R$ {item.valor.toFixed(2)}</Text>
                <Text style={[styles.detailText, styles.totalText]}>Total: R$ {item.total.toFixed(2)}</Text>
            </View>
        </View>
    );
};

const ParcelaItem = ({ item }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Parcela {item.parcela}</Text>
            <View style={styles.cardDetails}>
                <Text style={styles.detailText}>Vencimento: {item.vencimento}</Text>
                <Text style={[styles.detailText, styles.totalText]}>Valor: R$ {item.valor.toFixed(2)}</Text>
            </View>
        </View>
    );
};


// --- Componente Principal do Modal ---

export const ModalOrcamento = ({ visible, orcamento, setVisible }) => {

    if (!orcamento) {
        return null; // Não renderiza nada se o orçamento for nulo
    }
    
    const getTipoOrcamento = () => {
        if (orcamento.tipo === 1) return `Orçamento: ${orcamento.id}`;
        if (orcamento.tipo === 3) return `Ordem de Serviço: ${orcamento.id}`;
        return `Documento: ${orcamento.id}`;
    }

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={() => setVisible(false)}
        >
            <SafeAreaView style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {/* Cabeçalho do Modal */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>{getTipoOrcamento()}</Text>
                            <Text style={styles.headerSubtitle}>ID Externo: {orcamento.id_externo || 'N/A'}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={COLORS.darkGray} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Informações Gerais */}
                        <View style={styles.section}>
                            <InfoRow label="Data Cadastro:" value={orcamento.data_cadastro} />
                            <InfoRow label="Cliente:" value={`${orcamento.cliente.codigo} - ${orcamento.cliente.nome}`} />
                        </View>

                        {/* Totais */}
                        <View style={styles.section}>
                            <View style={styles.totalsContainer}>
                                <InfoRow label="Total Produtos:" value={`R$ ${orcamento.total_produtos?.toFixed(2) || '0.00'}`} />
                                <InfoRow label="Total Serviços:" value={`R$ ${orcamento.total_servicos?.toFixed(2) || '0.00'}`} />
                                <InfoRow label="Descontos:" value={`R$ ${orcamento.descontos?.toFixed(2) || '0.00'}`} />
                                <View style={styles.divider} />
                                <InfoRow label="Total Geral:" value={`R$ ${orcamento.total_geral?.toFixed(2) || '0.00'}`} />
                            </View>
                        </View>
                        
                        {/* Lista de Produtos */}
                        {orcamento.produtos && orcamento.produtos.length > 0 && (
                            <View style={styles.section}>
                                <SectionHeader title="PRODUTOS" />
                                <FlatList
                                    data={orcamento.produtos}
                                    renderItem={({ item }) => <ProdutoItem item={item} />}
                                    keyExtractor={(item) => item.codigo.toString()}
                                    scrollEnabled={false} // Desabilita o scroll da FlatList interna
                                />
                            </View>
                        )}

                        {/* Lista de Serviços */}
                        {orcamento.servicos && orcamento.servicos.length > 0 && (
                            <View style={styles.section}>
                                <SectionHeader title="SERVIÇOS" />
                                <FlatList
                                    data={orcamento.servicos}
                                    renderItem={({ item }) => <ServicoItem item={item} />}
                                    keyExtractor={(item) => item.codigo.toString()}
                                    scrollEnabled={false}
                                />
                            </View>
                        )}
                        
                        {/* Lista de Parcelas */}
                        {orcamento.parcelas && orcamento.parcelas.length > 0 && (
                            <View style={styles.section}>
                                <SectionHeader title="PARCELAS" />
                                <FlatList
                                    data={orcamento.parcelas}
                                    renderItem={({ item }) => <ParcelaItem item={item} />}
                                    keyExtractor={(item) => item.parcela.toString()}
                                    scrollEnabled={false}
                                />
                            </View>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

// --- StyleSheet (Centraliza todos os estilos) ---

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '95%',
        height: '90%',
        backgroundColor: COLORS.lightGray,
        borderRadius: SIZES.borderRadius,
        padding: SIZES.padding,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.darkGray,
    },
    closeButton: {
        padding: SIZES.base / 2,
    },
    section: {
        marginVertical: SIZES.base,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: SIZES.base,
        marginTop: SIZES.base,
        paddingBottom: SIZES.base / 2,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SIZES.base / 2,
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: 'bold',
        textAlign: 'right',
        flex: 1,
        marginLeft: SIZES.base,
    },
    totalsContainer: {
        backgroundColor: COLORS.white,
        padding: SIZES.padding / 2,
        borderRadius: SIZES.borderRadius / 2,
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.gray,
        marginVertical: SIZES.base / 2,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.borderRadius / 1.5,
        padding: SIZES.padding / 1.5,
        marginBottom: SIZES.base,
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    cardSubtitle: {
        fontSize: 12,
        color: COLORS.darkGray,
        marginBottom: SIZES.base,
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SIZES.base,
    },
    detailText: {
        fontSize: 13,
        color: COLORS.darkGray,
    },
    totalText: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});