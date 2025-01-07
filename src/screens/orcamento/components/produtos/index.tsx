import React, { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";

import { ProdutosContext } from "../../../../contexts/produtosDoOrcamento";
import AntDesign from "@expo/vector-icons/AntDesign";
import { OrcamentoContext } from "../../../../contexts/orcamentoContext";
import { ConnectedContext } from "../../../../contexts/conectedContext";
import { useProducts } from "../../../../database/queryProdutos/queryProdutos";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useItemsPedido } from "../../../../database/queryPedido/queryItems";
import { Cart } from "../Cart";

export const ListaProd11utos = ({ codigo_orcamento }) => {
  const [pesquisa, setPesquisa] = useState<any>("1");
  const [selectedItem, setSelectedItem] = useState([]);
  const [data, setData] = useState([]);
  const [totalItens, setTotalItens] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleProdutos, setVisibleProdutos] = useState(false);

  const { orcamento, setOrcamento } = useContext(OrcamentoContext);
  const { connected, setConnected } = useContext(ConnectedContext);

  const useQueryProdutos = useProducts();

  const useQueryItemsPedido = useItemsPedido();

  const handleIncrement = (item) => {
    setSelectedItem((prevSelectedItems) => {
      return prevSelectedItems.map((i) => {
        if (i.codigo === item.codigo) {
          return { ...i, quantidade: i.quantidade + 1 };
        }
        return i;
      });
    });
  };

  const handleDecrement = (item) => {
    setSelectedItem((prevSelectedItems) => {
      return prevSelectedItems.map((i) => {
        if (i.codigo === item.codigo) {
          return { ...i, quantidade: Math.max(i.quantidade - 1, 0) };
        }
        return i;
      });
    });
  };

  const toggleSelection = (item) => {
    setSelectedItem((prevSelectedItem) => {
      const index = prevSelectedItem.findIndex((i) => i.codigo === item.codigo);
      if (index !== -1) {
        return prevSelectedItem.filter((i) => i.codigo !== item.codigo);
      } else {
        return [...prevSelectedItem, { ...item, quantidade: 1, desconto: 0 }];
      }
    });
  };

  const handleDescontoChange = (item, value) => {
    setSelectedItem((prevSelectedItems) => {
      return prevSelectedItems.map((i) => {
        if (i.codigo === item.codigo) {
          let desconto = parseFloat(value) || 0;
          if (desconto > i.preco) desconto = 0;
          return { ...i, desconto, total: i.quantidade * i.preco - desconto };
        }
        return i;
      });
    });
  };

  const adiciona = (dado) => {
    setPesquisa(dado);
  };

  const limpar = () => {
    setSelectedItem([]);
    setPesquisa("");
  };

  //////////////////
  useEffect(() => {
    let aux = 0;
    selectedItem.forEach((e) => {
      e.total = e.quantidade * e.preco - e.desconto;
      aux += e.total;
    });
    setTotalItens(aux);

    setOrcamento((prevOrcamento) => ({
      ...prevOrcamento,
      produtos: selectedItem,
    }));
  }, [selectedItem]);
  //////////////////
  useEffect(() => {
    const busca = async () => {
      try {
        let aux: any = await useQueryProdutos.selectByDescription(pesquisa, 10);
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
      setData([]);
    }
  }, [pesquisa]);
  //////////////////
  useEffect(() => {
    async function init() {
      if (codigo_orcamento && codigo_orcamento > 0) {
        console.log("editando***");
        console.log(codigo_orcamento);
        console.log("****");
        setSelectedItem([]);
        let data: any = await useQueryItemsPedido.selectByCodeOrder(
          codigo_orcamento
        );
        setSelectedItem(data);
      }
    }

    init();
  }, [codigo_orcamento]);

  function renderProdutosSelecionado(item) {
    item.total = item?.quantidade * item?.preco - item?.desconto;

    return (
      <View
        style={{
          backgroundColor: "#FFF",
          elevation: 5,
          margin: 3,
          borderRadius: 30,
          padding: 35,
          width: 300,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 3,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold" }}>Codigo:</Text>
            <Text> {" " + item.codigo} </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold" }}>Unitario:</Text>
            <Text>{" " + item?.preco.toFixed(2)}</Text>
          </View>
        </View>

        <Text numberOfLines={2}>{item.descricao}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold" }}>Quantidade:</Text>
            <Text>{" " + item.quantidade}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold" }}>Total:</Text>
            <Text>{" " + item?.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const isSelected = orcamento.produtos.find((i) => i.codigo === item.codigo);
    const quantidade = isSelected ? isSelected.quantidade : 0;
    const desconto = isSelected ? isSelected.desconto : 0;
    // item.preco = 10;
    item.total = quantidade * item.preco - desconto;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: isSelected ? "#009de2" : "#FFF" },
        ]}
        onPress={() => toggleSelection(item)}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={[
              styles.txt,
              { fontWeight: isSelected ? "bold" : null },
              { color: isSelected ? "white" : null },
            ]}
          >
            Código: {item.codigo}
          </Text>
          <Text style={[styles.txt, { color: isSelected ? "white" : null }]}>
            R$: {item?.preco.toFixed(2)}
          </Text>
          {isSelected ? null : (
            <AntDesign name="caretdown" size={24} color={"black"} />
          )}
        </View>
        <Text
          style={[styles.txtDescricao, { color: isSelected ? "white" : null }]}
        >
          {item.descricao}
        </Text>
        {isSelected && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 2,
            }}
          >
            <View style={{ marginTop: 25 }}>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
              >
                Desconto: {desconto?.toFixed(2)}
              </Text>
              <TextInput
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  elevation: 4,
                  textAlign: "center",
                }}
                keyboardType="numeric"
                value={desconto}
                onChangeText={(i) => handleDescontoChange(item, i)}
              />
            </View>
            <View style={{ marginTop: 3 }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 25,
                    elevation: 4,
                    padding: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                    {" "}
                    {quantidade}{" "}
                  </Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => handleIncrement(item)}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}> + </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDecrement(item)}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}> - </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 20,
                    elevation: 5,
                  }}
                >
                  Total R$: {item?.total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ borderWidth: 0.5, margin: 5 }}></View>

      <View style={{ alignItems: "center" }}>
        <Text
          style={{ fontWeight: "bold", width: "100%", textAlign: "center" }}
        >
          Produtos
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setVisibleProdutos(true)}
        style={{
          margin: 5,
          elevation: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#009de2",
          padding: 10,
          borderRadius: 10,
          width: "98%",
        }}
      >
        <FontAwesome name="search" size={22} color="#FFF" />
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            width: 80,
          }}
        >
          produtos
        </Text>
        <AntDesign name="caretdown" size={24} color="white" />
      </TouchableOpacity>

      <View>
        <Modal
          visible={visibleProdutos}
          animationType="slide"
          transparent={true}
        >
          <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", flex: 1 }}>
            <View
              style={{
                margin: 5,
                backgroundColor: "white",
                borderRadius: 20,
                width: "96%",
                height: "80%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <View style={styles.searchContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setVisibleProdutos(false);
                  }}
                  style={{
                    margin: 15,
                    backgroundColor: "#009de2",
                    padding: 7,
                    borderRadius: 7,
                    width: "20%",
                    elevation: 5,
                  }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                    voltar
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 15,
                    margin: 5,
                    elevation: 5,
                  }}
                >
                  <TextInput
                    style={{
                      backgroundColor: "#FFF",
                      fontWeight: "bold",
                      borderRadius: 4,
                      width: "70%",
                      marginTop: 3,
                      elevation: 5,
                      marginHorizontal: 5,
                    }}
                    placeholder="Pesquisar"
                    // value={pesquisa}
                    onChangeText={adiciona}
                    placeholderTextColor="#009de2"
                  />
                  <TouchableOpacity onPress={limpar}>
                    <View style={styles.limpar}>
                      <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                        limpar
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ backgroundColor: "#dcdcdd" }}>
                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color="#009de2"
                    style={styles.loader}
                  />
                ) : (
                  <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.codigo.toString()}
                  />
                )}
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 5,
          }}
        >
          {/** 
                            <Cart/>
                        */}
          <Text style={{ fontSize: 15, fontWeight: "bold", width: "100%" }}>
            Total Produtos:{" "}
            {orcamento.total_produtos ? orcamento.total_produtos.toFixed(2) : 0}
          </Text>
        </View>

        <FlatList
          data={selectedItem}
          horizontal={true}
          renderItem={({ item }) => renderProdutosSelecionado(item)}
          keyExtractor={(item) => item.codigo.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    elevation: 5,
  },
  searchContainer: {
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    borderRadius: 5,
    elevation: 10,
  },
  limpar: {
    borderRadius: 5,
    backgroundColor: "red",
    width: 50,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginEnd: 1,
  },
  limparText: {
    color: "#FFF",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    margin: 3,
    backgroundColor: "#FFF",
    elevation: 4,
    width: 60,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  txtDescricao: {
    fontWeight: "bold",
    fontSize: 15,
  },
  txt: {
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
