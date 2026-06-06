import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ModalEditSelectedProduct } from "../product-list/modal-edit-selected-product";
import { orderProduct } from "../../types/order";

        type props = {
            item:orderProduct,
            removeItem: (product: orderProduct, quantity: number) => void ,
              handleAddProduct: (product: orderProduct, quantity: number) => void
              handleDiscount:(discount: number, codeProduct: number) => void
            };

  export const RenderSelectedItem =  ({ item , removeItem, handleAddProduct, handleDiscount}: props ) => {
    const [ visible, setVisible] = useState(false);

    const hasImage = item.fotos && item.fotos.length > 0 && item.fotos[0]?.link;

    return (
    <>
    <TouchableOpacity style={styles.selectedItemCard}
        onPress={()=>{setVisible(true)}}
    >
  <ModalEditSelectedProduct
      isSelected={item}
      setVisible={setVisible}
      visible={visible}
      handleAddProduct={handleAddProduct}
      handleDiscount={handleDiscount}
      />
        <View style={styles.cardHeader}>
            <View style={styles.codeBadge}>
                <Text style={styles.codeText}>{item.codigo}</Text>
            </View>
            <Text style={styles.priceText}>R$ {item?.preco?.toFixed(2)}</Text>
            <TouchableOpacity
            style={styles.closeButton}
            onPress={()=> removeItem(item, item.quantidade)}
            >
                  <MaterialIcons name="close" size={20} color='#6C757D' />
              </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
        {hasImage ?
            (<Image source={{ uri: `${item.fotos[0]?.link}` }} style={styles.selectedImage} resizeMode="cover" />) :
            (<View style={styles.imagePlaceholder}>
                <MaterialIcons name="image-not-supported" size={32} color="#BDBDBD" />
            </View>)
        }
        </View>
        <Text numberOfLines={2} style={styles.cardTitle}>{item.descricao}</Text>
        <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
                <MaterialIcons name="inventory-2" size={14} color="#6C757D" />
                <Text style={styles.cardText}>{item.quantidade} {item.unidade_medida}</Text>
            </View>
            <View style={styles.footerItem}>
                <MaterialIcons name="monetization-on" size={14} color="#6C757D" />
                <Text style={styles.cardText}>{item.desconto ? `R$ ${item.desconto.toFixed(2)}` : 'R$ 0,00'}</Text>
            </View>
            <Text style={styles.totalText}>R$ {Number(item?.total).toFixed(2)}</Text>
        </View>
    </TouchableOpacity>

    </>

  )} ;

  const styles = StyleSheet.create({
    cardText: { fontWeight: "bold", color: '#6C757D', fontSize: 11 },
    codeBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    codeText: { fontSize: 11, fontWeight: 'bold', color: '#185FED' },
    priceText: { fontSize: 16, fontWeight: 'bold', color: '#185FED', flex: 1, marginLeft: 8 },
    closeButton: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
    cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    cardTitle: { fontWeight: "bold", color: '#333', marginBottom: 6, fontSize: 14, height: 44, lineHeight: 20 },
    imageContainer: { width: '100%', height: 100, borderRadius: 8, overflow: 'hidden', marginBottom: 6 },
    imagePlaceholder: {
        width: '100%', height: '100%', backgroundColor: '#F5F5F5',
        justifyContent: 'center', alignItems: 'center',
    },
    selectedImage: { width: '100%', height: '100%' },
    cardFooter: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        marginTop: 4, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 8,
    },
    footerItem: { flexDirection: "row", alignItems: "center", gap: 3 },
    totalText: { fontWeight: 'bold', fontSize: 14, color: '#185FED' },
    selectedItemCard: {
        backgroundColor: "#FFF",
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderRadius: 12,
        marginHorizontal: 6,
        padding: 12,
        width: 280,
    },
  })
