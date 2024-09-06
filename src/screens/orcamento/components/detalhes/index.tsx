import React, { useContext,   useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { OrcamentoContext } from '../../../../contexts/orcamentoContext';
export const Detalhes = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [observacoes, setObservacoes] = useState<string>('');

const { orcamento, setOrcamento } =   useContext(OrcamentoContext)  

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se o mês for menor que 10
    const day = String(now.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se o dia for menor que 10

    return `${year}-${month}-${day}`;
  };

  const handleEvent = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    const dia = String(currentDate.getDate()).padStart(2,'0');
    const mes = String( currentDate.getMonth()).padStart(2,'0');
    const ano = currentDate.getFullYear();

    setShowPicker(false);
    setDate(currentDate);
const data_cadastro = `${ano}-${mes}-${dia}`;
    // Log the selected date to the console
   
    setOrcamento((prevOrcamento: OrcamentoModel) => ({
      ...prevOrcamento,
      data_cadastro: data_cadastro
  }));
  console.log('')
  console.log(`Orcamento atualizado data_cadastro ${data_cadastro}`)
  console.log('')

};

  return (
    <View style={{ flex: 1,  }}>
      <View style={{ margin: 5 }}>

        <Text style={{fontSize:20, margin:5 ,fontWeight:'bold' }} > Detalhes </Text>
        <View style={{ borderWidth: 0.4  }}></View>

        <View >
          <View style={{margin:10  }}>

              <View style={{margin:5}}>
                <Text style={{fontWeight:'bold'}}>
                    Data Emissão
                </Text>
              </View>
              
               <TouchableOpacity onPress={() => setShowPicker(true)} style={{ flexDirection:'row', gap:7}}>
               <Fontisto name="date" size={24} color="black" />
                     <Text style={{ fontSize:20, fontWeight:'bold' }} >
                        { orcamento?.data_cadastro}
                      </Text>
               </TouchableOpacity>
              
         </View>

          <View style={{ borderWidth: 0.4  }}></View>

          {showPicker && (
            <DateTimePicker
              value={date}
              display="calendar"
              mode="date"
              onChange={handleEvent}
               accessibilityLanguage='português'
                
            />
          )}
          
        </View>



        <View style={{ margin: 5 }}>
                    <Text style={{ fontWeight: 'bold' , fontSize:20}}> observações</Text>
                    <TextInput
                        style={{   margin: 5, borderWidth: 1.5, borderRadius: 7, borderColor: '#009de2', textAlign: "center" }}
                        numberOfLines={5}
                        placeholder="observações"
                        onChangeText={(v: string) => setObservacoes(v)}
                    />
                </View>

      </View>
    </View>
  );
};