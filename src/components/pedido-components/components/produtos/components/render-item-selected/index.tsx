import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ModalSelectedProduct } from "../modal-selected-product";
import { useFunctionsProducts } from "../../utils/functions";
    type item = {
        codigo:number,
        preco:number,
        estoque:number
        fotos:[ { link:string} ] | [ ],
        descricao:string,
        unidade_medida:string
        total:number
        quantidade?:number
        desconto?:number
    }
    
  export const RenderSelectedItem = React.memo(({ item }: {item:item}) => {
    const [ visible, setVisible] = useState(false);
    const useFunctions = useFunctionsProducts();

    return (
    <>
    <TouchableOpacity style={styles.selectedItemCard} 
        onPress={()=>{setVisible(true)}}
    >
  <ModalSelectedProduct
      isSelected={item}
      setVisible={setVisible}
      visible={visible}
      />
        <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Cód: {item.codigo}</Text>
            <Text style={styles.cardText}>Unit: {item?.preco.toFixed(2)}</Text>
        </View>
            <TouchableOpacity 
            style={{  width:22, alignItems:"center", justifyContent:"center", borderRadius:15, flexDirection:"row"}}
            onPress={()=> useFunctions.removeItem(item)}
            >
                  <Text><MaterialIcons name="close" size={20} color='#6C757D' /> </Text>
              </TouchableOpacity>

        {item.fotos && item.fotos.length > 0 ?
            (<Image source={{ uri: `${item.fotos[0] && item.fotos[0].link}` }} style={styles.selectedImage} resizeMode="contain" />) :
            (<MaterialIcons name="no-photography" size={100} color='#6C757D' />)
        }
        <Text numberOfLines={2} style={styles.cardTitle}>{item.descricao}</Text>
        <View style={styles.cardFooter}>
            <Text style={styles.cardText}>Qtd: {item.quantidade} {item.unidade_medida} </Text>
            <Text style={styles.cardText}>Desc: {item.desconto && item.desconto.toFixed(2)}</Text>

            <Text style={styles.cardText}>Total: {item?.total.toFixed(2)}</Text>
        </View>
    </TouchableOpacity>
     
    </>

  )});

  const styles = StyleSheet.create({
    cardText: { fontWeight: "bold", color: '#6C757D', fontSize: 12 },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    cardTitle: { fontWeight: "bold", color: '#343A40', marginVertical: 5, fontSize: 14, height: 40 },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 5, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 5 },
    selectedImage: { width: '100%', height: 100, borderRadius: 5, alignSelf: 'center' },
    selectedItemCard: { backgroundColor: "#FFF", elevation: 3, borderRadius: 8, marginHorizontal: 5, padding: 10, width: 280 },

  })