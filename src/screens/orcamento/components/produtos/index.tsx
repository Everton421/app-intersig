import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { api } from '../../../../services/api';
import { ProdutosContext } from '../../../../contexts/produtosDoOrcamento';
import AntDesign from '@expo/vector-icons/AntDesign';
import { OrcamentoContext } from '../../../../contexts/orcamentoContext';
import { ConnectedContext } from '../../../../contexts/conectedContext';
import { useProducts } from '../../../../database/queryProdutos/queryProdutos';

export const ListaProdutos = ({ orcamentoEditavel }) => {
  const [pesquisa, setPesquisa] = useState('');
  const [selectedItem, setSelectedItem] = useState([]);
  const [data, setData] = useState([]);
  const [totalItens, setTotalItens] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleProdutos, setVisibleProdutos] = useState(false);

  const { orcamento, setOrcamento } = useContext(OrcamentoContext);
const { connected, setConnected } = useContext(ConnectedContext)

  const useQueryProdutos = useProducts();

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
      const index = prevSelectedItem.findIndex(i => i.codigo === item.codigo);
      if (index !== -1) {
        return prevSelectedItem.filter(i => i.codigo !== item.codigo);
      } else {
        return [...prevSelectedItem, { ...item, quantidade: 1, desconto: 0 }];
      }
    });
  };

  const handleDescontoChange = (item, value) => {
    setSelectedItem((prevSelectedItems) => {
      return prevSelectedItems.map((i) => {
        if (i.codigo === item.codigo) {
          const desconto = parseFloat(value) || 0;
          return { ...i, desconto, total: (i.quantidade * i.preco) - desconto };
        }
        return i;
      });
    });
  };

  useEffect(() => {
    let aux = 0;
    selectedItem.forEach((e) => {
      e.total = (e.quantidade * e.preco) - e.desconto;
      aux += e.total;
    });
    setTotalItens(aux);

    setOrcamento((prevOrcamento) => ({
      ...prevOrcamento,
      produtos: selectedItem
    }));
  }, [selectedItem]);

  useEffect(() => {
    const busca = async () => {
       if(connected ){
          setLoading(true);
             try {
               const response = await api.get(`produtos/${pesquisa}`);
               setData(response.data);
             } catch (err) {
               console.log(err);
             } finally {
               setLoading(false);
             }
         }else{

          try{
            let aux:any = await useQueryProdutos.selectByDescription(pesquisa,10);
            setData(aux);
          }catch(e) { console.log(e) 

          }finally {
               setLoading(false);
             }
       }
    }

    if (pesquisa.trim() !== '') {
      busca();
    } else {
      setData([]);
    }



  }, [ pesquisa    ]);



  const adiciona = (dado) => setPesquisa(dado);
  const limpar = () => {
    setSelectedItem([]);
    setPesquisa('');
  };
 

  const renderItem = ({ item }) => {
    const isSelected = selectedItem.find(i => i.codigo === item.codigo);
    const quantidade = isSelected ? isSelected.quantidade : 0;
    const desconto = isSelected ? isSelected.desconto : 0;
    item.preco = 10;
    item.total = (quantidade * item.preco) - desconto;

    return (
      <TouchableOpacity style={[styles.item, { backgroundColor: isSelected ? '#009de2' : '#FFF' }]} onPress={() => toggleSelection(item)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[styles.txt, { fontWeight: isSelected ? 'bold' : null }, { color: isSelected ? 'white' : null }]}>
            Código: {item.codigo}
          </Text>
          <Text style={[styles.txt, { color: isSelected ? 'white' : null }]}>
            R$: {item.preco}
          </Text>
        </View>
        <Text style={[styles.txtDescricao, { color: isSelected ? 'white' : null }]}>
          {item.descricao}
        </Text>
        {isSelected &&
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 2 }}>
            <View style={{ marginTop: 25 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                Desconto: {desconto}
              </Text>
              <TextInput
                style={{ backgroundColor: 'white', borderRadius: 5, elevation: 4, textAlign: 'center' }}
                keyboardType='numeric'
                value={desconto.toString()}
                onChangeText={(i) => handleDescontoChange(item, i)}
              />
            </View>
            <View style={{ marginTop: 3 }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 25, elevation: 4, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}> {quantidade} </Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={() => handleIncrement(item)} style={styles.button}>
                    <Text style={styles.buttonText}> + </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDecrement(item)} style={styles.button}>
                    <Text style={styles.buttonText}> - </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, elevation: 5 }}>
                  Total R$: {item.total}
                </Text>
              </View>
            </View>
          </View>
        }
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisibleProdutos(true)} style={{   elevation: 5, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#009de2', paddingTop:10, paddingBottom: 10, margin: 5, borderRadius: 10 }}>
        <Text style={{ marginLeft:5,color: 'white', fontWeight: 'bold', fontSize: 17 }}>
          produtos
        </Text>
        <AntDesign name="caretdown" size={24} color="white" />
      </TouchableOpacity>

      <View>
        <Modal visible={visibleProdutos}
          animationType="slide"
          transparent={true}
        >
          <View style={{
            margin: 5, backgroundColor: 'white', borderRadius: 20, width: '96%',
            height: '80%', shadowColor: '#000',
            shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <View style={styles.searchContainer}>
              <TouchableOpacity onPress={() => {setVisibleProdutos(false)  }}
                style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '25%', elevation: 5 }} >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                  voltar
                </Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, margin: 5, elevation: 5 }}>
                <TextInput
                  style={{ backgroundColor: '#FFF', borderRadius: 4, width: '70%', marginTop: 3, elevation: 5, marginHorizontal: 5 }}
                  placeholder='Pesquisar'
                  value={pesquisa}
                  onChangeText={adiciona}
                  placeholderTextColor='#009de2'
                />
                <TouchableOpacity onPress={limpar}>
                  <View style={styles.limpar}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>limpar</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ backgroundColor: '#dcdcdd' }}>
              {loading ? (
                <ActivityIndicator size="large" color="#009de2" style={styles.loader} />
              ) : (
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.codigo}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    elevation: 5
  },
  searchContainer: {
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    borderRadius: 5,
    elevation: 10,
  },
  limpar: {
    borderRadius: 5,
    backgroundColor: 'red',
    width: 50,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 1
  },
  limparText: {
    color: '#FFF'
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  button: {
    margin: 3,
    backgroundColor: '#FFF',
    elevation: 4,
    width: 60,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15
  },
  txtDescricao: {
    fontWeight: 'bold',
    fontSize: 15
  },
  txt: {
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
