import React, { useContext, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { OrcamentoContext } from '../../../../contexts/orcamentoContext';

export const Detalhes = ( {orcamentoEditavel} ) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  const { orcamento, setOrcamento } = useContext(OrcamentoContext);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
     return `${year}-${month}-${day}`;

  };

  const handleEvent = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);

    const data_cadastro = formatDate(currentDate);
    setOrcamento((prevOrcamento) => ({
      ...prevOrcamento,
       data_cadastro: data_cadastro,

    }));

    // console.log(`Data selecionada: ${currentDate}`);
    // console.log(`Orcamento atualizado data_cadastro ${data_cadastro}`);
  };

 useEffect(
  ()=>{
    if( orcamentoEditavel !== null ){
       setObservacoes(orcamentoEditavel.observacoes)
   //   console.log(orcamentoEditavel.observacoes)
    }

  },[]
 )
 
   useEffect(
     ()=>{
       setOrcamento((prevOrcamento) => ({
         ...prevOrcamento,
          observacoes:observacoes
       }));
  
     },[ observacoes ]
   )
 

  return (
    <View style={{ flex: 1 }}>
      <View style={{ margin: 5 }}>
        <Text style={{ fontSize: 20, margin: 5, fontWeight: 'bold' }}>Detalhes</Text>
        <View style={{ borderWidth: 0.4 }}></View>

        <View>
          <View style={{ margin: 10 }}>
            <View style={{ margin: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>Data Emissão</Text>
            </View>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={{ flexDirection: 'row', gap: 7 }}>
              <Fontisto name="date" size={24} color="black" />
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {orcamento?.data_cadastro || formatDate(new Date())}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ borderWidth: 0.4 }}></View>

          {
            showPicker && (
               <DateTimePicker
                value={date}
                display="calendar"
                mode="date"
                onChange={handleEvent}
                locale="pt-BR"
              />
          )
          }
        </View>

        <View style={{ margin: 5 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Observações</Text>
          <TextInput
            style={{ margin: 5, borderWidth: 1.5, borderRadius: 7, borderColor: '#009de2', textAlign: "center" }}
            numberOfLines={5}
            placeholder="observações"
            value={observacoes}
            onChangeText={ setObservacoes}
          />
        </View>
      </View>
    </View>
  );
};