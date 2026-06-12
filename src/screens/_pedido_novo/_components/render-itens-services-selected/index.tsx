import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ModalEditSelectedProduct } from "../product-list/modal-edit-selected-product";
import { orderProduct, orderService } from "../../types/order";
import { ModalEditSelectedService } from "../services-list/modal-edit-selected-service";

        type props = {
            item:orderService,
            removeItem: (product: orderService, quantity: number) => void ,
              hadleAddService: (product: orderService, quantity: number) => void
                 handleDiscountService: (discount: number, codeService: number) => void

            };

  export const RenderSelectedServicesItem =  ({ item , removeItem, hadleAddService, handleDiscountService}: props ) => {
    const [ visible, setVisible] = useState(false);


    return (
    <>
    <TouchableOpacity style={styles.selectedItemCard}
        onPress={()=>{setVisible(true)}}
    >
  <ModalEditSelectedService
      isSelected={item}
      setVisible={setVisible}
      visible={visible}
      handleAddService={hadleAddService}
      handleDiscount={handleDiscountService}
      />

        <View style={styles.cardHeader}>
            <View style={styles.codeBadge}>
                <Text style={styles.codeText}>{item.codigo}</Text>
            </View>
            <Text style={styles.priceText}>R$ {item?.valor?.toFixed(2)}</Text>
            <TouchableOpacity
            style={styles.closeButton}
            onPress={()=> removeItem(item, item.quantidade)}
            >
                  <MaterialIcons name="close" size={20} color='#6C757D' />
              </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
            (<View style={styles.imagePlaceholder}>
                <MaterialIcons name="image-not-supported" size={32} color="#BDBDBD" />
            </View>)
        </View>
        <Text numberOfLines={2} style={styles.cardTitle}>{item.aplicacao}</Text>
        <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
                <MaterialIcons name="inventory-2" size={14} color="#6C757D" />
                <Text style={[styles.cardText, { color:'#6C757D' } ]}>{item.quantidade} </Text>
            </View>
            <View style={styles.footerItem}>
                <MaterialIcons name="monetization-on" size={14} color="red" />
                <Text style={[styles.cardText]}> - {item.desconto ? `R$ ${item.desconto.toFixed(2)}` : 'R$ 0,00'}</Text>
            </View>
            <Text style={styles.totalText}>R$ {Number(item?.total).toFixed(2)}</Text>
        </View>
    </TouchableOpacity>

    </>

  )} ;

  const styles = StyleSheet.create({
    cardText: { fontWeight: "bold", color: 'red', fontSize: 11 },
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
        marginBottom:10
    },
  })
