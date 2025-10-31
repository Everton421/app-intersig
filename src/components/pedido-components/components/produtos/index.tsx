import React, { useContext, useEffect, useState, useMemo, useCallback, use } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator, Image, Button } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { OrcamentoContext } from "../../../../contexts/orcamentoContext";
import { useProducts } from "../../../../database/queryProdutos/queryProdutos";
import { useItemsPedido } from "../../../../database/queryPedido/queryItems";
import { useFotosProdutos } from "../../../../database/queryFotosProdutos/queryFotosProdutos";
import { Ionicons } from "@expo/vector-icons";
import { RenderSearchItem } from "./components/render-search-item";
import { useFunctionsProducts } from "./utils/functions";
import { RenderSelectedItem } from "./components/render-item-selected";
import { defaultColors } from "../../../../styles/global";

 
export const ListaProdutos = React.memo(({ codigo_orcamento }: any) => {

    const [pesquisa, setPesquisa] = useState<string>("1");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleProdutos, setVisibleProdutos] = useState(false);
    const [loadingEditItens, setLoadingEditItens] = useState(false);

    const { orcamento, setOrcamento }: any = useContext(OrcamentoContext);
    
    const useQueryProdutos = useProducts();
    const useQueryFotos = useFotosProdutos();
    const useQueryItemsPedido = useItemsPedido();

      const useFunctions = useFunctionsProducts();
 
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
        const fotosPromises = produtos.map((p:any) => useQueryFotos.selectByCode(p.codigo));
        const fotosResultados = await Promise.all(fotosPromises);
        

        produtos.forEach((p:any, index:any) => {
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
            const fotosPromises = items.map((p:any) => useQueryFotos.selectByCode(p.codigo));
            const fotosResultados = await Promise.all(fotosPromises);
              fotosResultados.forEach(( f )=>{
              })

            items.forEach((p:any, index:any) => {
                p.fotos = fotosResultados[index] || [];
            });
          }
          // Define os produtos diretamente no contexto
          setOrcamento((prev:any) => ({ ...prev, produtos: items }));
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
                placeholderTextColor= {defaultColors.gray}
                autoFocus
              />
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#185FED" style={{ flex: 1 }} />
            ) : (
              <FlatList
                data={data}
                renderItem={({ item }) => 
                          <RenderSearchItem 
                            item={item}
                             selectedProductsMap={useFunctions.selectedProductsMap}
                             toggleSelection={useFunctions.toggleSelection}
                            />
                    } // Usa o componente memoizado
                keyExtractor={(item:any) => item.codigo.toString()}
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
        //  keyExtractor={(item) => item.sequencia.toString()}
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
      searchContainer: { padding: 10, backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10 },
      searchButton: { marginTop: 5, margin: 5, elevation: 10, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#185FED", padding: 10, borderRadius: 7, width: "98%", alignItems: 'center' },
      searchButtonText: { color: "white", fontWeight: "bold", fontSize: 20, flex: 1, textAlign: "center" },
      modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' },
      modalContent: { margin: 0, backgroundColor: "#F0F4F8", borderRadius: 20, width: "100%", height: "90%", shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
      searchInput: { backgroundColor: "#FFF",fontSize:15, fontWeight:"bold",borderRadius: 8, width: "95%", alignSelf: 'center', marginTop: 5, elevation: 3, padding: 15, borderWidth: 1, borderColor: '#ddd' },
      totalContainer: { flexDirection: "row", justifyContent: "space-between", margin: 10 },
      totalProdutosText: { fontSize: 15, fontWeight: "bold", color: '#6C757D' },
});