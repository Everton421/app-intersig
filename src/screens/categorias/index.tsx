import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useCategoria } from "../../database/queryCategorias/queryCategorias";
import { FlatList } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { RenderItemsCategory } from "./renderItensCategory/RenderItensCategory";

type category = {
  codigo: number;
  descricao: string;
};

export const Categoria = ({ navigation }: any) => {
  const [dados, setDados] = useState<category[]>([]);
  const [pesquisa, setPesquisa] = useState<string>("");

  const useQueryCategoria = useCategoria();

  useFocusEffect(() => {
    async function busca() {
      let data: any = await useQueryCategoria.selectAll();
      if (data?.length > 0) {
        setDados(data);
      }
    }
    if (pesquisa === "" || pesquisa === undefined) {
      busca();
    }
  });

  useEffect(() => {
    async function busca() {
      let data: any = await useQueryCategoria.selectByDescription(pesquisa);
      if (data?.length > 0) {
        setDados(data);
      }
    }

    if (pesquisa !== "" || pesquisa !== undefined) {
      busca();
    }
  }, [pesquisa]);

  return (
    <View style={{ flex: 1, backgroundColor: "#EAF4FE" }}>
      <View style={{ backgroundColor: "#185FED" }}>
        <View
          style={{
            padding: 15,
            backgroundColor: "#185FED",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ margin: 5 }}
          >
            <Ionicons name="arrow-back" size={25} color="#FFF" />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              marginLeft: 10,
              gap: 2,
              width: "100%",
              alignItems: "center",
            }}
          >
            <TextInput
              style={{
                width: "70%",
                fontWeight: "bold",
                padding: 5,
                margin: 5,
                textAlign: "center",
                borderRadius: 5,
                elevation: 5,
                backgroundColor: "#FFF",
              }}
              onChangeText={(value) => setPesquisa(value)}
              placeholder="pesquisar"
            />

            <TouchableOpacity //onPress={()=> setShowPesquisa(true)}
            >
              <AntDesign name="filter" size={35} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
            style={{
              left: 5,
              bottom: 5,
              color: "#FFF",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {" "}
            Categorias{" "}
          </Text>
        </View>
      </View>

      {/**  */}
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={dados}
          renderItem={(i) => RenderItemsCategory(i)}
          keyExtractor={(i) => i.codigo.toString()}
        />
      </View>
      {/**  */}
      <TouchableOpacity
        style={{
          backgroundColor: "#185FED",
          width: 50,
          height: 50,
          borderRadius: 25,
          position: "absolute",
          bottom: 150,
          right: 30,
          elevation: 10,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999, // Garante que o botão fique sobre os outros itens
        }}
        onPress={() => {
          navigation.navigate("cadastro_categorias");
        }}
      >
        <MaterialIcons name="add-circle" size={45} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};
