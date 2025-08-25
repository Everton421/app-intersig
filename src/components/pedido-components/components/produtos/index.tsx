import React, { useContext, useEffect, useState, useMemo, useCallback, use } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { OrcamentoContext } from "../../../../contexts/orcamentoContext";
import { useProducts } from "../../../../database/queryProdutos/queryProdutos";
import { useItemsPedido } from "../../../../database/queryPedido/queryItems";
import { useFotosProdutos } from "../../../../database/queryFotosProdutos/queryFotosProdutos";
import { Ionicons } from "@expo/vector-icons";

 
export const ListaProdutos = React.memo(({ codigo_orcamento }: any) => {

  const [pesquisa, setPesquisa] = useState<string>("1");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleProdutos, setVisibleProdutos] = useState(false);
  const [loadingEditItens, setLoadingEditItens] = useState(false);
  
  const [ fotosItems, setFotosItens ] = useState<any>();


  const { orcamento, setOrcamento } = useContext(OrcamentoContext);
  
  const useQueryProdutos = useProducts();
  const useQueryFotos = useFotosProdutos();
  const useQueryItemsPedido = useItemsPedido();

  // OTIMIZAÇÃO 2: Criar um mapa de produtos selecionados para busca rápida (O(1))
  // useMemo garante que este mapa só seja recriado quando 'orcamento.produtos' mudar.
  const selectedProductsMap = useMemo(() => {
    const map = {};
    for (const product of orcamento.produtos) {
      map[product.codigo] = product;
    }
    return map;
  }, [orcamento.produtos]);

 
  const handleSelectionChange = useCallback((newSelectedItems) => {
    const totalItens = newSelectedItems.reduce((acc, item) => {
      const total = (item.quantidade * item.preco) - (item.desconto || 0);
      return acc + total;
    }, 0);
    
    // Atualiza o contexto com a nova lista de produtos
    setOrcamento((prev) => ({
      ...prev,
      produtos: newSelectedItems,
    }));
  }, [setOrcamento]);

  const toggleSelection = useCallback((item: any) => {
    const currentSelected = [...orcamento.produtos];
    const index = currentSelected.findIndex((i: any) => i.codigo === item.codigo);
    
    if (index !== -1) {
      // Remove o item
      currentSelected.splice(index, 1);
    } else {
      // Adiciona o item
      currentSelected.push({ ...item, quantidade: 1, desconto: 0, total: item.preco });
    }
    handleSelectionChange(currentSelected);
  }, [orcamento.produtos, handleSelectionChange]);

  const updateSelectedItem = useCallback((itemCodigo, newValues) => {
    const updatedItems = orcamento.produtos.map(p => {
        if (p.codigo === itemCodigo) {
            const updatedProduct = { ...p, ...newValues };
            updatedProduct.total = (updatedProduct.quantidade * updatedProduct.preco) - (updatedProduct.desconto || 0);
            return updatedProduct;
        }
        return p;
    });
    handleSelectionChange(updatedItems);
  }, [orcamento.produtos, handleSelectionChange]);


  const handleIncrement = useCallback((item) => {
    updateSelectedItem(item.codigo, { quantidade: item.quantidade + 1 });
  }, [updateSelectedItem]);

  const handleDecrement = useCallback((item) => {
    if (item.quantidade > 1) {
        updateSelectedItem(item.codigo, { quantidade: item.quantidade - 1 });
    } else {
        // Se a quantidade for 1, a decrementação remove o item
        toggleSelection(item);
    }
  }, [updateSelectedItem, toggleSelection]);
  
  const handleDescontoChange = useCallback((item, value) => {
    let desconto = parseFloat(value) || 0;
    if (desconto > item.preco * item.quantidade) desconto = 0; // Lógica de validação
    updateSelectedItem(item.codigo, { desconto });
  }, [updateSelectedItem]);

  // OTIMIZAÇÃO 4: Busca de dados em paralelo com Promise.all
  useEffect(() => {
    const busca = async () => {
      if (pesquisa.trim() === "") {
        setData([]);
        return;
      }
      setLoading(true);
      try {
        let produtos: any = await useQueryProdutos.selectByDescription(pesquisa, 20);
        
        // Busca todas as fotos em paralelo
        const fotosPromises = produtos.map(p => useQueryFotos.selectByCode(p.codigo));
        const fotosResultados = await Promise.all(fotosPromises);
        

        produtos.forEach((p, index) => {
          p.fotos = fotosResultados[index] || [];
        });

        setData(produtos);
      } catch (e) {
        console.log("Erro ao buscar produtos:", e);
      } finally {
        setLoading(false);
      }
    };
    // Debounce a busca para não disparar a cada tecla
    const timerId = setTimeout(() => busca(), 300);
    return () => clearTimeout(timerId);

  }, [pesquisa  ]);

  useEffect(() => {
    async function init() {
      if (codigo_orcamento && codigo_orcamento > 0 && orcamento.codigo === codigo_orcamento) {
        setLoadingEditItens(true);
        try {
          let items: any = await useQueryItemsPedido.selectByCodeOrder(codigo_orcamento);
          
          if (items.length > 0) {
            // Busca fotos em paralelo para os itens do pedido
            const fotosPromises = items.map(p => useQueryFotos.selectByCode(p.codigo));
            const fotosResultados = await Promise.all(fotosPromises);
              fotosResultados.forEach(( f )=>{
              })

            items.forEach((p, index) => {
                p.fotos = fotosResultados[index] || [];
            });
          }
          // Define os produtos diretamente no contexto
          setOrcamento(prev => ({ ...prev, produtos: items }));
        } catch (e) {
          console.error("Erro ao carregar itens do pedido:", e);
        } finally {
          setLoadingEditItens(false);
        }
      }
    }
    console.log('carregando produtos...')
    init();
    // A dependência setOrcamento é estável, mas é bom incluí-la
  }, [codigo_orcamento  ]);

 
 

  const RenderSearchItem = React.memo(({ item }) => {
    const isSelected = selectedProductsMap[item.codigo];
    const quantidade = isSelected ? isSelected.quantidade : 0;

    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor: isSelected ? "#185FED" : "#FFF" }]}
        onPress={() => toggleSelection(item)}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={[styles.txt, { color: isSelected ? "white" : null }]}>Código: {item.codigo}</Text>
            <Text style={[styles.txt, { color: isSelected ? "white" : null }]}>R$: {item?.preco.toFixed(2)}</Text>
            <Text style={[styles.txt, { color: isSelected ? "white" : null }]}>Estoque: {item?.estoque}</Text>
        </View>
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems: 'center', marginVertical: 5 }}>
            {item.fotos.length > 0 && item.fotos[0].link ?
                (<Image source={{ uri: `${item.fotos[0].link}` }} style={styles.thumbnailImage} resizeMode="contain" />) :
                (<MaterialIcons name="no-photography" size={40} color={isSelected ? "#FFF" : "black"} />)
            }
            {!isSelected && <AntDesign name="caretdown" size={24} color={"black"} />}
        </View>
        <Text style={[styles.txtDescricao, { color: isSelected ? "white" : null }]} numberOfLines={2}>{item.descricao}</Text>
        {isSelected && (
          <View style={styles.selectedControls}>
            <View>
              <Text style={styles.label}>Desconto: R$</Text>
              <TextInput
                style={styles.inputDesconto}
                keyboardType="numeric"
                defaultValue={String(isSelected.desconto || 0)} // Usar defaultValue para performance
                onEndEditing={(e) => handleDescontoChange(isSelected, e.nativeEvent.text)}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{quantidade}</Text>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => handleIncrement(isSelected)} style={styles.button}><Text style={styles.buttonText}>+</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDecrement(isSelected)} style={styles.button}><Text style={styles.buttonText}>-</Text></TouchableOpacity>
              </View>
              <Text style={styles.totalText}>Total R$: {isSelected.total.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  });

  const RenderSelectedItem = React.memo(({ item }) => {
    
    return (
    <View style={styles.selectedItemCard}>
        <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Cód: {item.codigo}</Text>
            <Text style={styles.cardText}>Unit: {item?.preco.toFixed(2)}</Text>
        </View>
        {item.fotos && item.fotos.length > 0 ?
            (<Image source={{ uri: `${item.fotos[0].link}` }} style={styles.selectedImage} resizeMode="contain" />) :
            (<MaterialIcons name="no-photography" size={100} color='#6C757D' />)
        }
        <Text numberOfLines={2} style={styles.cardTitle}>{item.descricao}</Text>
        <View style={styles.cardFooter}>
            <Text style={styles.cardText}>Qtd: {item.quantidade}</Text>
            <Text style={styles.cardText}>Total: {item?.total.toFixed(2)}</Text>
        </View>
    </View>
  )});

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisibleProdutos(true)} style={styles.searchButton}>
        <FontAwesome name="search" size={22} color="#FFF" />
        <Text style={styles.searchButtonText}>Produtos</Text>
        <AntDesign name="caretdown" size={22} color="white" />
      </TouchableOpacity>

      <Modal visible={visibleProdutos} animationType="slide" transparent={true} onRequestClose={() => setVisibleProdutos(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.searchContainer}>
            
              <TouchableOpacity onPress={() => setVisibleProdutos(false)}  style={ { width:'15%'  ,padding: 16, borderRadius: 12    }}>
                            <Ionicons name="close" size={28} color={ '#6C757D' } />
                    </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar produto..."
                onChangeText={setPesquisa} // Direto, pois o useEffect já tem debounce
                placeholderTextColor="#185FED"
                autoFocus
              />
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#185FED" style={{ flex: 1 }} />
            ) : (
              <FlatList
                data={data}
                renderItem={({ item }) => <RenderSearchItem item={item} />} // Usa o componente memoizado
                keyExtractor={(item) => item.codigo.toString()}
                initialNumToRender={10} // Melhora performance inicial
                maxToRenderPerBatch={10} // Melhora performance de scroll
                windowSize={10} // Melhora uso de memória
              />
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.totalContainer}>
        <Text style={styles.totalProdutosText}>
          Total Produtos: R$ {orcamento.total_produtos ? orcamento.total_produtos.toFixed(2) : '0.00'}
        </Text>
      </View>

      {loadingEditItens ? (
        <ActivityIndicator size={50} color='#185FED' />
      ) : (
        <FlatList
          data={orcamento.produtos} // A fonte da verdade é o contexto
          horizontal={true}
          renderItem={({ item }) => <RenderSelectedItem item={item} />} // Usa o componente memoizado
          keyExtractor={(item) => item.codigo.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
        />
      )}
    </View>
  );
});

// Estilos otimizados e mais organizados
const styles = StyleSheet.create({
    container: { flex: 1 },
    item: { padding: 15, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
    searchContainer: { padding: 10, backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10 },
    buttonsContainer: { flexDirection: "row" },
    button: { margin: 3, backgroundColor: "#FFF", elevation: 4, width: 50, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 20 },
    buttonText: { fontWeight: "bold", fontSize: 18 },
    txtDescricao: { fontWeight: "bold", fontSize: 15, marginTop: 5 },
    txt: { fontWeight: "bold" },
    thumbnailImage: { width: 60, height: 60, borderRadius: 5 },
    selectedControls: { flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-end', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.3)' },
    label: { color: "white", fontWeight: "bold", fontSize: 15 },
    inputDesconto: { backgroundColor: "white", borderRadius: 5, padding: 5, width: 80, textAlign: "center", marginTop: 5 },
    quantityContainer: { backgroundColor: "white", borderRadius: 25, elevation: 4, paddingVertical: 8, paddingHorizontal: 15, justifyContent: "center", alignItems: "center" },
    quantityText: { fontWeight: "bold", fontSize: 16 },
    totalText: { color: "white", fontWeight: "bold", fontSize: 20, elevation: 5, marginTop: 10 },
    searchButton: { marginTop: 5, margin: 5, elevation: 10, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#185FED", padding: 10, borderRadius: 7, width: "98%", alignItems: 'center' },
    searchButtonText: { color: "white", fontWeight: "bold", fontSize: 20, flex: 1, textAlign: "center" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' },
    modalContent: { margin: 0, backgroundColor: "#F0F4F8", borderRadius: 20, width: "100%", height: "90%", shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    backButton: {  backgroundColor: "#185FED", padding: 10, borderRadius: 7, zIndex: 1 },
    searchInput: { backgroundColor: "#FFF", fontWeight:"bold",borderRadius: 8, width: "95%", alignSelf: 'center', marginTop: 5, elevation: 3, padding: 15, borderWidth: 1, borderColor: '#ddd' },
    totalContainer: { flexDirection: "row", justifyContent: "space-between", margin: 10 },
    totalProdutosText: { fontSize: 15, fontWeight: "bold", color: '#6C757D' },
    selectedItemCard: { backgroundColor: "#FFF", elevation: 3, borderRadius: 8, marginHorizontal: 5, padding: 10, width: 280 },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    cardText: { fontWeight: "bold", color: '#6C757D', fontSize: 12 },
    selectedImage: { width: '100%', height: 100, borderRadius: 5, alignSelf: 'center' },
    cardTitle: { fontWeight: "bold", color: '#343A40', marginVertical: 5, fontSize: 14, height: 40 },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 5, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 5 },
});