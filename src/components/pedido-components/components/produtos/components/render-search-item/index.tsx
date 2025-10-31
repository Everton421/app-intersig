import { Button, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { ModalSelectedProduct } from "../modal-selected-product";
import { defaultColors, globalStyles } from "../../../../../../styles/global";
import { FontAwesome5 } from "@expo/vector-icons";

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
    
    type SelectedProductsMap = {
        [ key: number ]: ItemType
    }

    type props = {
        item:ItemType,
        selectedProductsMap:SelectedProductsMap,
        toggleSelection: (item: ItemType) => void
    }


  export const RenderSearchItem = React.memo( 
    ( {
         item  , selectedProductsMap, toggleSelection 
        }:props) => {
    
     const isSelected = selectedProductsMap[item.codigo];

     const [ visible, setVisible ] =useState(false);       
    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor:"#FFF" }]}
         onPress={() =>  { setVisible(true) } } >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={[styles.txt  ]}>Código: {item.codigo}</Text>
            <Text style={[styles.txt ]}>R$: {item?.preco.toFixed(2)}</Text>
            <Text style={[styles.txt ]}>Estoque: {item?.estoque}</Text>
        </View>
        <View style={{ flexDirection:"row",   justifyContent:"space-between", alignItems: 'center', marginVertical: 5 }}>
              <View style={{ borderWidth:1, borderColor: defaultColors.ligthGray, borderRadius:5}}>
               {item.fotos && item.fotos[0] && item.fotos[0].link ?
                   (<Image source={{ uri: `${item.fotos[0].link}` }} style={styles.thumbnailImage} resizeMode="contain" />) :
                   (<MaterialIcons name="no-photography" size={50} color={  defaultColors.gray} />)
               }
              </View>
            {!isSelected && <AntDesign name="caretdown" size={24} color={defaultColors.gray} />}

        </View>
        <Text style={[styles.txtDescricao, ]} numberOfLines={2}> 
            {item.descricao}
            </Text>
           <Text style={{ alignSelf: 'flex-end'}}  > 
            {
                isSelected && <FontAwesome5 name="paperclip" size={15} color="green" />
            }
            </Text>
      
      <ModalSelectedProduct
            isSelected={item}
             setVisible={setVisible}
            visible={ visible}
      />
     
      </TouchableOpacity>
    );
  });
  const styles = StyleSheet.create({
    quantityContainer: { backgroundColor: "white", borderRadius: 25, elevation: 4, paddingVertical: 8, paddingHorizontal: 15, justifyContent: "center", alignItems: "center" },
    totalText: { color: "white", fontWeight: "bold", fontSize: 20, elevation: 5, marginTop: 10 },
    label: { color: "white", fontWeight: "bold", fontSize: 15 },
    button: { margin: 3, backgroundColor: "#FFF", elevation: 4, width: 50, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 20 },
    thumbnailImage: { width: 60, height: 60, borderRadius: 5 },
    inputDesconto: { backgroundColor: "white", borderRadius: 5, padding: 5, width: 80, textAlign: "center", marginTop: 5 },
    quantityText: { fontWeight: "bold", fontSize: 16 },
    selectedControls: { flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-end', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.3)' },
    txtDescricao: { fontWeight: "bold", fontSize: 17, marginTop: 5,color: defaultColors.gray },
    item: { padding: 15, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
    txt: { fontWeight: "bold" , color: defaultColors.gray },
  
})
