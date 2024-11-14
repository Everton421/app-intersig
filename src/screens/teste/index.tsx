import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
 import useApi from '../../services/api';

export const Cliente = () => {
  const [pesquisa, setPesquisa] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [data, setData] = useState([]);
  const [totalItens, setTotalItens] = useState(0);
  const api = useApi();

   

  useEffect(() => {
    const busca = async () => {
      try {
        const response = await api.get(`clientes/${pesquisa}`);
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    busca();

    if (pesquisa === null || pesquisa === '') {
      setPesquisa('');
    }
  }, [pesquisa]);

  const adiciona = (dado) => setPesquisa(dado);

 
function seleciona(item){
    setSelectedItem(item)
    console.log(item)
}

  const renderItem = ({ item }) => {
 
        const isSelected = item.codigo === selectedItem.codigo;

    return (
        <TouchableOpacity style={[styles.item, { backgroundColor: isSelected ? '#009de2' : '#FFF' }]} onPress={() => seleciona(item)} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                   <Text style={[styles.txt, { fontWeight: isSelected ? 'bold' : null }, { color: isSelected ? 'white' : null }]}>
                     Código: {item.codigo}
                  </Text>
            </View>
            <Text style={[styles.txtDescricao, { color: isSelected ? 'white' : null }]}>
            {item.nome}
            </Text>
        {isSelected &&
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 2 }}>            
             <View style={{ marginTop: 15 }}>
               <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                CNPJ : {item.cnpj}  
               </Text>
             </View>
             <View style={{ marginTop: 15 }}>
                 <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, elevation: 5 }}>
                  IE : {item.ie}  
                </Text>
             </View>
          </View>

                <View style={{ marginTop: 10, flexDirection:'row', justifyContent:'space-between' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, elevation: 5 }}>
                      RUA. : {item.endereco}  
                    </Text>
                </View>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, elevation: 5 }}>
                    NUM. : {item.numero}  
                 </Text>
        </View>
        }
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder='Pesquisar'
          value={pesquisa}
          onChangeText={adiciona}
          placeholderTextColor='#009de2'
        />
      
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.codigo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 0,
    backgroundColor: '#dcdcdd'
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    elevation: 5
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    paddingHorizontal: 70,
    marginTop: 3,
    elevation: 5
  },
  searchContainer: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
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
  }
});
