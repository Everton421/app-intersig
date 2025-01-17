import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
 import useApi from '../../services/api';

export const Cliente = () => {
  const [pesquisa, setPesquisa] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [data, setData] = useState([]);
  const [totalItens, setTotalItens] = useState(0);
  const api = useApi();

    
  return (
    <View style={styles.container}>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 0,
    backgroundColor: '#dcdcdd'
  },
  
});
