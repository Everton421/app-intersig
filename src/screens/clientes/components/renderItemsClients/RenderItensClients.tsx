import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { defaultColors } from "../../../../styles/global";

type IClient = {
  codigo: number;
  cnpj: string;
  nome: string;
  ie: string;
  cep: string;
  cidade: string;
  endereco: string;
  numero: string;
};

interface Props {
  item: IClient;
  handleSelect: (item: IClient) => void;
}

export function RenderItensClients({ item, handleSelect }: Props) {
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
 
         <FontAwesome5 name="user" size={24} color={defaultColors.darkBlue} />
       
        </View>
        <Text testID='nameClient' style={styles.nome} numberOfLines={2} ellipsizeMode="tail">
          {item.nome}
        </Text>
      </View>

      <Text style={styles.cnpj}>CNPJ/CPF: {item.cnpj}</Text>
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
  nome: {
    fontWeight: "bold",
    fontSize: 18,
    color: defaultColors.gray,
    flex: 1,
  },
  cnpj: {
    fontSize: 14,
    color: defaultColors.gray,
  },
});