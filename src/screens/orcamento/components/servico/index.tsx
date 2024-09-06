import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useContext, useEffect, useState } from 'react';
import { TextInput, ActivityIndicator, Alert, Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
 
import { api } from '../../../../services/api'; 
 
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ItensServicoListaHorizontal } from '../itens_Servico_lista';
import { OrcamentoContext } from '../../../../contexts/orcamentoContext';


export const Servico = ()=>{
    const [ selectedTipo , setSelectedTipo  ] = useState(null);
    const [presstipoOs,    setPresstipoOS   ] = useState(false); 
    const [ verServicos ,  setVerServicos   ] = useState(false);
    const [ pesquisa,      setPesquisa      ] = useState();
    const [ tipoOs , setTipoOs] = useState([]);
     const [ dadosServicos , setDadosServicos ] = useState([]);

    const [ servicosSelecionado, setServicosSelecionado ] = useState([]);
    const [totalItens, setTotalItens ]= useState(0);

      const { orcamento, setOrcamento } = useContext( OrcamentoContext )

    useEffect(
  ()=>{ 
    async function busca(){
      try{
      const response = await api.get(`/servicos/${pesquisa}`);
        if( response.status === 200 ){
          setDadosServicos(response.data);
        }
    }catch(e){
      console.log( 'erro ao consultar os servicos! ', e )
    }
    }
    busca();

  },[ pesquisa ]
)

useEffect(
    ()=>{
        async function busca(){
            try{
            const response = await api.get(`/tipos_os`);
              if( response.status === 200 ){
                setTipoOs(response.data);
              }
          }catch(e){
            console.log( 'erro ao consultar os servicos! ', e )
          }
          }
          busca();
    },[ selectedTipo ]
)

useEffect(
  ()=>{
      // quando ouver alteracao nos dados dos servicos por outro componente
      //  
    if(orcamento.servicos.length !== servicosSelecionado.length  ){ 
      let aux = orcamento.servicos;
      setServicosSelecionado(aux) 
      }
      
  },[ orcamento.servicos ]
)

useEffect(() => {
  let aux = 0;
  servicosSelecionado.forEach((e) => {
    e.total = (e.quantidade * e.valor)  
    aux += e.total;
  });
  setTotalItens(aux);
  


  setOrcamento((prevOrcamento: OrcamentoModel) => ({
    ...prevOrcamento,
    servicos: servicosSelecionado,
}));
 
}, [ servicosSelecionado ]);

  
const handleIncrement = (item) => {
  setServicosSelecionado((prevSelectedItems) => {
    return prevSelectedItems.map((i) => {
      if (i.codigo === item.codigo) {
        return { ...i, quantidade: i.quantidade + 1 };
      }
      return i;
    });
  });
};

const handleDecrement = (item) => {
  setServicosSelecionado((prevSelectedItems) => {
    return prevSelectedItems.map((i) => {
      if (i.codigo === item.codigo) {
        return { ...i, quantidade: Math.max(i.quantidade - 1, 1) };
      }
      return i;
    });
  });
};

    function handleSelectOS (item) {
      setSelectedTipo(item),
      console.log(selectedTipo)
      setPresstipoOS(false)
    }

    function renderItemOS  (item) {
      return ( 
        <TouchableOpacity style={{ backgroundColor:'#009de2', margin:5, padding:7, borderRadius:5 , elevation:4}} onPress={ ()=> handleSelectOS(item)}  >
          <Text style={{ color:'white', fontWeight:'bold'}} >
            codigo:  {item.codigo} descricao: {item.descricao}
          </Text>
        </TouchableOpacity>
      )
    }

    function selecionaServico(item) {
      setServicosSelecionado((prev) => {
        // Verifica se o serviço já está no array
        //const existe = prev.some(servico => servico.codigo === item.codigo);
        const index = prev.findIndex(i => i.codigo === item.codigo);

        if (index !== -1) {
          return prev.filter(i => i.codigo !== item.codigo);
        } else {
          return [...prev, { ...item, quantidade: 1, desconto: 0 }];
        }
      });
    }
  



    function renderItemServico(item  ){
    const isSelected = servicosSelecionado.find(i => i.codigo === item.codigo);
    const quantidade = isSelected ? isSelected.quantidade : 0;

      return ( 
        <TouchableOpacity 
        style={ [  {  backgroundColor: isSelected?.codigo  === item?.codigo  ? '#339' : '#009de2'} , {  margin:5, padding:7, borderRadius:5 , elevation:4} ] } onPress={ ()=> selecionaServico(item)}  >
          
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
             <Text style={{ color:'white', fontWeight:'bold'}} >
              codigo:  {item.codigo}  
             </Text>
             
             <Text style={{ color:'white', fontWeight:'bold'}} >
             valor:  {item.valor}  
             </Text>

            </View>
          
          <Text style={{ color:'white', fontWeight:'bold'}} >
               {item.aplicacao}
          </Text>
          
          
          { isSelected ?
             
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 2 }}>
        
              <View style={{ marginTop: 3 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ backgroundColor: 'white', borderRadius: 25, elevation: 4, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}> {  quantidade  } </Text>
                  </View>
                  <View
                   style={styles.buttonsContainer} 
                  >
                    <TouchableOpacity 
                      onPress={() =>  handleIncrement(item)} 
                       style={styles.button}
                      >
                      <Text 
                       style={styles.buttonText}
                       >  + </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                         onPress={() => handleDecrement(item)} 
                        style={styles.button}
                        >
                      <Text   style={styles.buttonText}
                      > - </Text>
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

          :null
          }
        </TouchableOpacity>
      )
    }

  
      return(
        <View>
          {/** separador */}
      <View style={{ borderWidth: 0.5, margin: 5 }}></View> 
                    <View style={{flexDirection:'row', alignItems:'center',   justifyContent:'center'}}>
                      <Text style={{fontSize:15,fontWeight:'bold' }}>
                          Serviços
                       </Text>
                      </View>
          <TouchableOpacity style={{backgroundColor:'#009de2',margin:3,  padding:10, elevation:5, borderRadius:5, flexDirection:'row', justifyContent:'space-between'  }}
          onPress={ ()=>  { presstipoOs ?  setPresstipoOS(false) : setPresstipoOS(true)    } } >
            { selectedTipo ?
               ( <Text  style={{ color:'#FFF', fontSize:15,fontWeight:'bold' }}  > Tipo De OS: {selectedTipo?.descricao} </Text> ) 
               :
               (  < Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold' }}>Tipos De OS</Text> )       

            }      
           
      
      <FontAwesome name="search" size={22} color="#FFF" />

          </TouchableOpacity>
          
             
              {/**modal tipos de OS  */ }
               
              <Modal visible={presstipoOs} transparent={true}   >

                {
                  tipoOs.length > 0 ? 
                  ( 
                    <View style={{ backgroundColor:'rgba( 50 ,50 ,50, 0.5 )', flex:1 }} >
                    <View style={{ backgroundColor:'white',   padding:15, borderRadius:10 , margin:'2%', marginTop:'50%', elevation:2}} >
                          <Text style={{margin:5, fontWeight:'bold'}} > Tipos De OS </Text>
                          <FlatList
                              data={ tipoOs }
                              renderItem={ ( {item} )=> renderItemOS(item)}
                            />
                      </View>
                  </View>
                  )
                  :
                  ( 
                    <View style={{backgroundColor:'#FFF', flex:1}} >
                        <TouchableOpacity onPress={() => {setPresstipoOS(false)  }}
                          style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '20%', elevation: 5 }} >
                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                          voltar
                        </Text>
                      </TouchableOpacity>
                      <Text>
                        NENHUM TIPO DE OS ENCONTRADO!
                      </Text>
                    </View>
                    )
                }  
            
              </Modal>
              {/******* */}
           
           {/****** modal servicos */}
            <Modal visible={verServicos} transparent={true}>
                <View style={{ backgroundColor:'rgba( 50,50,50, 0.5 )', flex:1, alignItems:'center', justifyContent:'center' }} > 
                  <View style={{ backgroundColor:'#FFF', width:'95%' , height:'90%' ,padding:5, borderRadius:15}}>

                   
        <TouchableOpacity onPress={() => {setVerServicos(false)  }}
                      style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '20%', elevation: 5 }} >
                      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                        voltar
                      </Text>
                    </TouchableOpacity>

                        <TextInput
                            placeholder='pesquisar'
                            style={{ margin:10, backgroundColor:'#F5F6F8', width:'90%', elevation:5, textAlign:'center', padding:5, borderRadius:10}}
                            onChangeText={ (t)=>  setPesquisa(t) }
                           />  

                        <View style={{ height:'75%' }} >
                            <FlatList
                              data={dadosServicos}
                              renderItem={ ({item})=> renderItemServico( item ) }
                              keyExtractor={(item)=>item.codigo}
                            />
                        </View>
                      
                 </View>

                </View>
            </Modal>

        

          <TouchableOpacity style={{backgroundColor:'#009de2',margin:3,  padding:10, elevation:5, borderRadius:5, flexDirection:'row', justifyContent:'space-between'  }}
                    onPress={ ()=>    setVerServicos(true) } >
                  < Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold' }}>Serviços</Text>
             <AntDesign name="caretdown" size={24} color={ 'white'} />
                </TouchableOpacity>

              <View style={{alignItems:'center' , justifyContent:'center'}}>
                 { servicosSelecionado.length > 0 ? ( <Text style={{ fontSize:15 ,fontWeight:'bold'}}> total serviços :{ totalItens}  </Text>): null }
                 </View>
    

                  
  {/**   <Button
          title='ver'
          onPress={()=> console.log(servicosSelecionado)}
          />
          */}
                {  
                  servicosSelecionado &&
                    <FlatList
                      data={servicosSelecionado}
                      horizontal={true}
                      renderItem={({ item }) => <ItensServicoListaHorizontal item={item} handleDecrement={handleDecrement} handleIncrement={handleIncrement} />}
                      keyExtractor={ (item)=> item.codigo.toString()}
                      />
                   }
                
      <View style={{ borderWidth: 0.5, margin: 5 }}></View> 
                
        </View>
      )
  }
 





const styles = StyleSheet.create({
    container: {
      flex:1
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
   
  });
  