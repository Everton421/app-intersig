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

import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useProducts } from "../../../../database/queryProdutos/queryProdutos";
import { useFotosProdutos } from "../../../../database/queryFotosProdutos/queryFotosProdutos";
import { ModalEditSelectedProduct } from "./modal-edit-selected-product";
import { orderProduct } from "../../types/order";
import { CustomAlert } from "../../../../components/custom-alert";

type props = {
    productsIsSelected: orderProduct[]
    handleAddProduct: (item:any, quantity:number)=>void,  
    handleDiscount:(discount: number, codeProduct: number) => void 
}
export const ProductList = ({   handleAddProduct , handleDiscount, productsIsSelected }:props) => {

    const [pesquisa, setPesquisa] = useState<any>("a"); // Inicia vazio para não buscar tudo de cara se não quiser
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleProdutos, setVisibleProdutos] = useState(false);
    const [ productIsSelected, setProductIsSelected ]= useState();
    
        const [ isVisibleAlert, setIsVisibleAlert ] = useState(false);
       const  [ titleAlert, setTitleAlert ] = useState<string>('');
        const [ typeAlert, setTypeAlert] = useState< 'info' | 'success' | 'error' | 'warning'>();
        const [ messageAlert, setMessageAlert ]= useState("");
        const [cancelTextAlert, setCancelTextAlert] = useState();
        const [ confirmTextAlert, setConfirmTextAlert ] = useState();
         

    const useQueryProdutos = useProducts();
    const useQueryFotos = useFotosProdutos();

    const [ isVisibleModalSelectedProduct , setIsVisibleModalSelectedProduct ] = useState(false);

    useEffect(() => {
        const busca = async () => {
            setLoading(true); // Ativar loading
            try {
                let aux: any = await useQueryProdutos.selectByDescription(pesquisa, 20);
                for (let p of aux) {
                    let dadosFoto: any = await useQueryFotos.selectByCode(p.codigo)
                    if (dadosFoto?.length > 0) {
                        p.fotos = dadosFoto
                    } else {
                        p.fotos = []
                    }
                }
                setData(aux);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        if (pesquisa.trim() !== "") {
            busca();
        } else {
            // Se quiser carregar algo padrão ao limpar, chame busca() aqui também ou limpe
             setData([]); 
             // Se quiser buscar todos ao abrir o modal sem digitar nada, descomente a busca() no useEffect da abertura do modal ou aqui.
        }
    }, [pesquisa]);


     
    

    function selecionarItem(item: any) {
        const isSelected = productsIsSelected.some((product )=> item.codigo === product.codigo)
        if(isSelected) {
            setMessageAlert(`O produto ${item.descricao} já foi adicionado`)
               setIsVisibleAlert(true)
                return
            }
        setIsVisibleModalSelectedProduct(true)
        setProductIsSelected(item)
        //setVisibleProdutos(false);
    }
     

            const renderItem = ({ item }: any) => {
                const hasImage = item.fotos && item.fotos.length > 0 && item.fotos[0].link;
        const isSelected = productsIsSelected.some((product )=> item.codigo === product.codigo)

        return (
            <TouchableOpacity
                style={[
                    isSelected && { 
                         //borderBlockStartColor:'#4CAF50',
                         borderStartColor:'#4CAF50',
                         borderStartWidth:5
                    },
                    {
                    backgroundColor: "#FFF",
                    borderRadius: 12,
                    marginHorizontal: 15,
                    marginVertical: 6,
                    padding: 10,
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    
                }]}
                onPress={() => selecionarItem(item)}
            >
                {/* Imagem */}
                <View style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden' }}>
                    {hasImage ? (
                        <Image source={{ uri: `${item.fotos[0].link}` }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    ) : (
                        <MaterialIcons name="image-not-supported" size={24} color="#BDBDBD" />
                    )}
                </View>

                {/* Dados */}
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#185FED', fontWeight: 'bold' }}>Cód: {item.codigo}</Text>
                        <Text style={{ fontSize: 12, color: '#185FED', fontWeight: 'bold' }}>Id: {item.id}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#4CAF50' }}>R$ {item.preco ? item.preco.toFixed(2) : '0.00'}</Text>
                    </View>

                    <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#333', marginVertical: 2 }}>
                        {item.descricao}
                    </Text>

                    <View style={[isSelected && { flexDirection:"row", justifyContent:"space-between" },{ flex:1}]}>
                       <Text style={{ fontSize: 12, color: '#757575' }}>Estoque: {item.estoque}  </Text>
                        {
                            isSelected && 
                            <FontAwesome name="check-circle" size={24} color="#4CAF50" />
                        }
                    </View>
                        
                    
                </View>
              
              
            </TouchableOpacity>
        );
    };


    return (
       <View style={{ marginHorizontal: 15, marginBottom: 10 }}>
            {/* BOTÃO PRINCIPAL DE ADICIONAR PRODUTOS (Transformado em Card Interativo) */}
            <TouchableOpacity
                onPress={() => setVisibleProdutos(true)}
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
                        <MaterialCommunityIcons name="package-variant-closed-plus" size={24} color="#185FED" />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Adicionar Produtos</Text>
                        <Text style={{ fontSize: 13, color: '#666' }}>Toque para pesquisar itens</Text>
                    </View>
                </View>
                <MaterialIcons name="search" size={24} color="#185FED" />
            </TouchableOpacity>

            <Modal visible={visibleProdutos} animationType="slide" transparent={true} onRequestClose={() => setVisibleProdutos(false)}>

                
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
                                    placeholder="Digite para buscar..."
                                    placeholderTextColor="#999"
                                    onChangeText={(text) => setPesquisa(text)}
                                    autoFocus={true}
                                />
                            </View>
                            <TouchableOpacity onPress={() => setVisibleProdutos(false)}>
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
                                    renderItem={renderItem}
                                    keyExtractor={(item: any) => item.codigo.toString()}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={() => (
                                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                                            <MaterialIcons name="search-off" size={50} color="#BDBDBD" />
                                            <Text style={{ color: '#999', marginTop: 10 }}>Nenhum produto encontrado.</Text>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
  <CustomAlert
                        visible={isVisibleAlert}
                        message={messageAlert}
                        onConfirm={() => setIsVisibleAlert(false)}
                        onCancel={() => setIsVisibleAlert(false)}
                        title={titleAlert}
                        type={typeAlert}
                        cancelText={cancelTextAlert}
                        confirmText={confirmTextAlert}
                    />

                        {productIsSelected &&
                            <ModalEditSelectedProduct
                            quantity={1}
                                handleDiscount={handleDiscount}
                                isSelected={productIsSelected}
                                handleAddProduct={handleAddProduct}
                                setVisible={setIsVisibleModalSelectedProduct}
                                visible={isVisibleModalSelectedProduct}
                            />
                        }

                    </View>
                </View>
            </Modal>
        </View>
    );
};