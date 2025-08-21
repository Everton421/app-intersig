 import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { defaultColors } from "../../../styles/global";

import FontAwesome from '@expo/vector-icons/FontAwesome';

type category = {
  codigo: number;
  descricao: string;
  data_cadastro:string 
  data_recadastro:string 
 id:string
};

type formaPagamento = {
      codigo: number,
      data_cadastro: string,
      data_recadastro: string,
      desc_maximo: number,
      descricao: string,
      intervalo: number,
      parcelas: number,
      recebimento: number
}

interface Props {
  item: formaPagamento;
  handleSelect: (item: formaPagamento) => void;
}

export const RenderItemsFormaPagamento = ({ item, handleSelect }: Props)=> {
  return (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.codigo}>Código: {item.codigo}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.iconContainer}>
                    <FontAwesome name="credit-card-alt" size={24} color={defaultColors.darkBlue } />
        </View>
        <Text style={[styles.descricao, { fontSize:20}]} numberOfLines={2} ellipsizeMode="tail">
          {item.descricao}
        </Text>
      </View>
      <View style={styles.infoContainer}>
         <Text style={styles.descricao} numberOfLines={2} ellipsizeMode="tail">
          Parcelas:  {item.parcelas} 
        </Text>
         <Text style={styles.descricao} numberOfLines={2} ellipsizeMode="tail">
          Intervalo: {item.intervalo} dias
        </Text>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    elevation: 5,
    padding: 15,
    marginVertical: 5, // Margem vertical para separar os itens
    marginHorizontal: 10, // Margem horizontal para dar espaço nas laterais
    borderRadius: 8,
  },
  header: {
    marginBottom: 8,
  },
  codigo: {
    fontWeight: "bold",
    fontSize: 16,
    color: defaultColors.gray,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center", // Alinha verticalmente os itens
    marginBottom: 5,
  },
  iconContainer: {
    marginRight: 10,
  },
  descricao: {
    fontWeight: "bold",
    fontSize: 15,
    color: defaultColors.gray,
    flex: 1,
  },
  cnpj: {
    fontSize: 14,
    color: defaultColors.gray,
  },
});