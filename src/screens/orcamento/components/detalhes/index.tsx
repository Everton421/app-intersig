import React, { useContext, useEffect, useState } from 'react';
import { Text, TextInput,  TouchableOpacity,  View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { OrcamentoContext } from '../../../../contexts/orcamentoContext';
import { FontAwesome5 } from '@expo/vector-icons';

export const Detalhes = ( {orcamentoEditavel} ) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  const [situacao, setSituacao] = useState<String>();

  const { orcamento, setOrcamento } = useContext(OrcamentoContext);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
     return `${year}-${month}-${day}`;
  };

  const handleEvent = (event:any, selectedDate:any) => {
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
       setSituacao(orcamentoEditavel.situacao) 
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

   useEffect(
    ()=>{
      setOrcamento((prevOrcamento) => ({
        ...prevOrcamento,
        situacao:situacao
      }));
 
    },[ situacao, setSituacao ]
  )

    
 


  return (
    <View style={{ flex: 1, backgroundColor:'#FFF', elevation:2, borderRadius:10, margin:3 }}>
      <View style={{ margin: 5 }}>
        <Text style={{ fontSize: 20, margin: 5, fontWeight: 'bold',color: '#6C757D' }}>Detalhes:</Text>

        <View>
          <View style={{ margin: 10 }}>
            <View style={{ margin: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>Data Emissão</Text>
            </View>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={{ flexDirection: 'row', gap: 7 }}>
              <Fontisto name="date" size={24} color="black" />
                <Text style={{ fontSize: 20, fontWeight: 'bold' , width:'100%'}}>
                  {orcamento?.data_cadastro || formatDate(new Date())}
                </Text>
            </TouchableOpacity>
          </View>

          <View style={{ borderWidth: 0.2 }}></View>

          {
            showPicker && (
               <DateTimePicker
                value={date}
                display="calendar"
                mode="date"
                onChange={handleEvent}
              //  locale="pt-BR"
              />
          )
          }
        </View>

        <Text style={{ fontSize: 20, margin: 5, fontWeight: 'bold',color: '#6C757D' }}>Situação:</Text>

              <View style={{ flexDirection:'row', justifyContent:'space-between',width:'100%'  }} >
                <TouchableOpacity style={  [     orcamento?.situacao  === 'EA' ?  { backgroundColor:'green'} :  { backgroundColor:'#FFF'}    ,{  alignItems:'center',gap:5, width: 120 ,padding:5,  borderRadius:5 , elevation:5, flexDirection:'row'}] } 
                  onPress={ ()=> setSituacao('EA') }
                 >
                   <FontAwesome5 name="clipboard-list" size={24} color={ orcamento?.situacao  === 'EA' ? '#FFF' : '#000'}  />
                    <Text  style={  [ orcamento?.situacao  === 'EA' && { color:'#FFF'}  ,{width:'100%', fontWeight:'bold', fontSize:15} ]  } >Orçamento</Text>
                </TouchableOpacity>

                <TouchableOpacity style={  [    orcamento?.situacao  === 'AI' ? { backgroundColor:'#009de2'} :  { backgroundColor:'#FFF'}  ,{ gap:5, alignItems:'center',width: 120 ,padding:5, borderRadius:5 , elevation:5, flexDirection:'row'}  ] }
                    onPress={ ()=> setSituacao('AI') }
                   >
                             <FontAwesome5 name="clipboard-check" size={24} color={ orcamento?.situacao  === 'AI' ? '#FFF' : '#000'}/>
                   
                   <Text  style={  [  orcamento?.situacao  === 'AI' && { color:'#FFF'} ,{width:'100%', fontWeight:'bold', fontSize:15} ] } > Pedido </Text>
                </TouchableOpacity>
              </View>

        <View style={{ borderWidth: 0.2 ,margin:5}}></View>


        <View style={{ margin: 5 }}>
        <Text style={{ fontSize: 20, margin: 5, fontWeight: 'bold',color: '#6C757D' }}> Observações:</Text>
          <TextInput
            style={{ margin: 5,fontWeight:'bold', borderWidth: 1.5, borderRadius: 7, borderColor: '#6C757D', textAlign: "center" }}
            numberOfLines={5}
            placeholder="Observações"
            placeholderTextColor='#6C757D'
            value={observacoes}
            onChangeText={ setObservacoes}
          />
        </View>
      </View>
    </View>
  );
};