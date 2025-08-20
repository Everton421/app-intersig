 import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { defaultColors } from "../../../styles/global";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
type item = {
  codigo: number;
  descricao: string;
};

interface Props {
  item: item;
  handleSelect: (item: item) => void;
}

export const RenderItemsCategory = ({ item, handleSelect }: Props)=> {
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
                    <MaterialIcons name="category" size={30} color={defaultColors.darkBlue} />
        </View>
        <Text style={styles.descricao} numberOfLines={2} ellipsizeMode="tail">
          {item.descricao}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    elevation: 2,
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