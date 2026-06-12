import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { orderProduct } from "../../types/order";

type props = {
    visible:boolean
    isSelected:orderProduct
    setVisible:React.Dispatch<React.SetStateAction<boolean>>
    handleAddProduct:  (product: orderProduct, quantity: number) => void
    handleDiscount:(discount: number, codeProduct: number) => void
}
   type ItemType = {
        codigo:number,
        preco:number,
        estoque:number
        fotos:[ { link:string} ] | [ ],
        descricao:string,
        total:number
        quantidade?:number
        desconto?:number
    }




export const ModalEditSelectedProduct =   ({    isSelected, visible, setVisible, handleAddProduct , handleDiscount}:props )=>   {

      const [ quantidade, setQuantidade ] = useState(1);
      const [ desconto, setDesconto ] = useState(0);
      const [ total, setTotal ] = useState(0);
      const [ preco, setPreco  ] = useState(0);
      const discountRef = useRef<TextInput>(null);


             useEffect(()=>{
                 let auxQuant= 1;
                 let auxDesc= 0 ;
                 let auxPrice= 0;
                    

                      if(isSelected.quantidade && isSelected.quantidade > 0){
                          setQuantidade(isSelected.quantidade)
                          auxQuant = isSelected.quantidade
                      }
                      if(isSelected.desconto && isSelected.desconto > 0){
                          auxDesc = isSelected.desconto;
                          setDesconto(isSelected.desconto)
                      }
                      if(isSelected.preco && isSelected.preco > 0){
                          setPreco(isSelected.preco);
                          auxPrice = isSelected.preco;
                      }
                      if(auxDesc > auxPrice){
                          auxDesc = 0
                      }
                      setTotal((auxPrice - auxDesc) * auxQuant)
            },[])

            useEffect(() => {
              if (visible) {
                setTimeout(() => discountRef.current?.focus(), 300);
              }
            }, [visible])

        
                 function handleSave(item: orderProduct){
                         const updatedItem = { ...item, quantidade, desconto }
                         handleAddProduct(updatedItem, quantidade)
                         handleDiscount(desconto, item.codigo)
                         setVisible(false)
                         setQuantidade(1)
                         setDesconto(0)
                         setTotal(0)
                         setPreco(0)
                     }

           function calcTotal(){
                           if(desconto > preco){
                                setDesconto(0)
                           }
                  return (preco - desconto) * quantidade
                 }

                    useEffect(()=>{
                       setTotal( calcTotal( ) ) 
                    },[desconto, quantidade])


        const hasImage = isSelected?.fotos && isSelected?.fotos[0]?.link;

        return (
          <Modal visible={visible} transparent={true}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.overlay}
            >
              <View style={styles.modalContainer}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >

                  <View style={styles.modalHeader}>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeText}>{isSelected.codigo}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
                      <Ionicons name="close" size={24} color="#6C757D" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.productInfoRow}>
                    <View style={styles.imageContainer}>
                      {hasImage ? (
                        <Image source={{ uri: isSelected.fotos[0].link }} style={styles.productImage} resizeMode="cover" />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <MaterialIcons name="image-not-supported" size={36} color="#BDBDBD" />
                        </View>
                      )}
                    </View>

                    <View style={styles.priceStockColumn}>
                      <Text style={styles.priceValue}>R$ {Number(isSelected.preco).toFixed(2)}</Text>
                      <View style={styles.stockBadge}>
                        <MaterialIcons name="inventory-2" size={14} color="#6C757D" />
                        <Text style={styles.stockText}>Estoque: {isSelected.estoque}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.descriptionText} numberOfLines={2}>
                    {isSelected.descricao}
                  </Text>

                  <View style={styles.totalRow}>
                    <MaterialIcons name="receipt" size={18} color="#185FED" />
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>R$ {Number((preco - desconto) * quantidade).toFixed(2)}</Text>
                  </View>

                  <View style={styles.quantitySection}>
                    <Text style={styles.sectionLabel}>Quantidade</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        onPress={() => setQuantidade(Math.max(1, quantidade - 1))}
                        style={styles.qtyButton}
                      >
                        <Ionicons name="remove" size={22} color="#FFF" />
                      </TouchableOpacity>
                      <View style={styles.qtyValueContainer}>
                        <Text style={styles.qtyValue}>{quantidade}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setQuantidade(quantidade + 1)}
                        style={styles.qtyButton}
                      >
                        <Ionicons name="add" size={22} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.discountSection}>
                    <View style={styles.discountLabelRow}>
                      <MaterialIcons name="monetization-on" size={18} color="#6C757D" />
                      <Text style={styles.discountLabel}>Desconto Unitário</Text>
                    </View>
                    <View style={styles.discountInputRow}>
                      <Text style={styles.discountCurrency}>R$</Text>
                      <TextInput
                        ref={discountRef}
                        style={styles.discountInput}
                        keyboardType="numeric"
                        defaultValue={isSelected.desconto ? String(isSelected.desconto) : "0.00"}
                        onChangeText={(e) => setDesconto(Number(e))}
                      />
                      <Text style={styles.discountPreview}>R$ {Number(desconto).toFixed(2)}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSave(isSelected)}
                  >
                    <Ionicons name="checkmark-circle" size={22} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.saveButtonText}>Incluir no Pedido</Text>
                  </TouchableOpacity>

                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </Modal>
          )
        } 
      

        const styles = StyleSheet.create({
         overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
         },
         modalContainer: {
            width: '92%',
            maxHeight: '90%',
            backgroundColor: '#FFF',
            borderRadius: 16,
            padding: 20,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
         },
         modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
         },
         codeBadge: {
            backgroundColor: '#E3F2FD',
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 8,
         },
         codeText: { fontSize: 13, fontWeight: 'bold', color: '#185FED' },
         closeButton: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            backgroundColor: '#F5F5F5',
         },
         productInfoRow: {
            flexDirection: 'row',
            gap: 14,
            marginBottom: 12,
         },
         imageContainer: {
            width: 140,
            height: 110,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: '#F5F5F5',
         },
         imagePlaceholder: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
         },
         productImage: { width: '100%', height: '100%' },
         priceStockColumn: {
            flex: 1,
            justifyContent: 'center',
            gap: 10,
         },
         priceValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#185FED',
         },
         stockBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#F5F5F5',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 8,
            alignSelf: 'flex-start',
         },
         stockText: { fontSize: 13, fontWeight: 'bold', color: '#6C757D' },
         descriptionText: {
            fontSize: 15,
            fontWeight: '600',
            color: '#333',
            marginBottom: 16,
            lineHeight: 21,
         },
         totalRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: '#E3F2FD',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 10,
            marginBottom: 18,
         },
         totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
         totalValue: { fontSize: 18, fontWeight: 'bold', color: '#185FED' },
         quantitySection: {
            alignItems: 'center',
            marginBottom: 18,
         },
         sectionLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: '#6C757D',
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: 1,
         },
         quantityControls: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
         },
         qtyButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#185FED',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3,
         },
         qtyValueContainer: {
            backgroundColor: '#FFF',
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: '#E0E0E0',
            paddingHorizontal: 28,
            paddingVertical: 8,
         },
         qtyValue: { fontSize: 22, fontWeight: 'bold', color: '#333' },
         discountSection: {
            backgroundColor: '#FAFAFA',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#EEEEEE',
            padding: 14,
            marginBottom: 18,
         },
         discountLabelRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginBottom: 10,
         },
         discountLabel: { fontSize: 14, fontWeight: '600', color: '#6C757D' },
         discountInputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
         },
         discountCurrency: { fontSize: 18, fontWeight: 'bold', color: '#333' },
         discountInput: {
            flex: 1,
            backgroundColor: '#FFF',
            borderWidth: 1,
            borderColor: '#CCC',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
         },
         discountPreview: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#4CAF50',
            minWidth: 70,
            textAlign: 'right',
         },
         saveButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#185FED',
            paddingVertical: 14,
            borderRadius: 12,
            elevation: 4,
            shadowColor: '#185FED',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
         },
         saveButtonText: {
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 17,
         },
         })
