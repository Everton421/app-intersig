import { useContext, useEffect, useState } from 'react';
import { TextInput, ActivityIndicator, Alert, Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OrcamentoContext } from '../../../../contexts/orcamentoContext';
import { ConnectedContext } from '../../../../contexts/conectedContext';
import { useServices } from '../../../../database/queryServicos/queryServicos';
import { useFormasDePagamentos } from '../../../../database/queryFormasPagamento/queryFormasPagamento';
import { useTipoOs } from '../../../../database/queryTipoOs/queryTipoOs';
import { useServicosPedido } from '../../../../database/queryPedido/queryServicosPedido';
import { useVeiculos } from '../../../../database/queryVceiculos/queryVeiculos';
import { usePedidos } from '../../../../database/queryPedido/queryPedido';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export const Servico = ( { codigo_orcamento }:any )=>{

    const [ selectedTipo , setSelectedTipo  ] = useState(null);
    const [presstipoOs,    setPresstipoOS   ] = useState(false); 
    const [ verServicos ,  setVerServicos   ] = useState(false);
    const [ verVeiculos ,  setVerVeiculos   ] = useState(false);
    const [ selectedVeiculo , setSelectedVeiculo  ] = useState( );

    const [ pesquisa,      setPesquisa      ] = useState('1');
    const [ pesquisaVeiculo,   setPesquisaVeiculo    ] = useState();

    const [ tipoOs , setTipoOs] = useState([]);
    const [ dadosServicos , setDadosServicos ] = useState([]);
    const [ dadosVeiculos , setDadosVeiculos ] = useState([]);

    const [ servicosSelecionado, setServicosSelecionado ] = useState([]);
    const [totalItens, setTotalItens ]= useState(0);

      const { orcamento, setOrcamento } = useContext( OrcamentoContext )
      const { connected, setConnected } = useContext(ConnectedContext)

      const useQueryServicos    = useServices();
      const useQueryFpgt        = useFormasDePagamentos();
      const useQueryTipoOs      = useTipoOs();
      const useServicosDoPedido = useServicosPedido();
      const useQueryVeiculos    = useVeiculos();
      const useQueryPedidos     = usePedidos();

  //////////////////////////////////////////////      
    useEffect(
        ()=>{
          async function buscaLocal(){
            try{
            const response:any = await useQueryServicos.selectByDescription( pesquisa, 10);
                if( response.length > 0  ){
                  setDadosServicos(response);
              }

          }catch(e){
            console.log( 'erro ao consultar os servicos! ', e )
          }
          }
        buscaLocal();

        },[ pesquisa ])
  //////////////////////////////////////////////      
  
    useEffect(
    ()=>{
      async function buscaLocal(){
        try{
          const response:any = await useQueryTipoOs.selectAll();

              if( response.length > 0  ){
                setTipoOs(response);
            }else{
              console.log('nenhum tipo de Os encontrada')
            }
    
        }catch(e){
          console.log( 'erro ao consultar tipo de OS! ', e )
        }
      }

      buscaLocal();

    },[ presstipoOs ])

 
      
    useEffect(()=>{
      async function filter(){
               if( orcamento.cliente?.codigo   ){
                 const response:any = await useQueryVeiculos.selectByClient(  orcamento.cliente?.codigo ) ;
                 setDadosVeiculos(response); 
      //        console.log('dados veiculo', response)
    
             }
         }
       filter()
         },[ verVeiculos ])
    

    const handleIncrement = (item) => {
  
    };

      const handleDecrement = (item) => {
        
      };

    function handleSelectOS (item) {
      setSelectedTipo(item),
   
      setPresstipoOS(false)
    }

    function selecionaVeiculo (item) {
      setSelectedVeiculo(item),
     
     // console.log(selectedVeiculo)
      setVerVeiculos(false)
    }


    function renderItemOS  (item:any) {
      return ( 
        <TouchableOpacity style={{ backgroundColor:'#185FED', margin:5, padding:7, borderRadius:5 , elevation:4}} onPress={ ()=> handleSelectOS(item)}  >
          <Text style={{ color:'white', fontWeight:'bold'}} >
            codigo:  {item.codigo} descricao: {item.descricao}
          </Text>
        </TouchableOpacity>
      )
    }

    function renderItemVeiculo  (item:any) {

      return ( 
        <TouchableOpacity style={[ {    backgroundColor: selectedVeiculo?.codigo === item.codigo  ? '#185FED' : '#FFF'},
           {  margin:5, padding:7, borderRadius:5 , elevation:4}] } 
        onPress={ ()=> selecionaVeiculo(item)}  >
          
          <Text style={ [ {  color: selectedVeiculo?.codigo === item.codigo ? 'white' : 'black' },{   fontWeight:'bold'}]} >

            codigo:  {item.codigo} placa: {item.placa}
          </Text>
        </TouchableOpacity>
      )
    }


    function selecionaServico(item:any) {
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



    function renderItemServico(item:any){
    const isSelected = orcamento.servicos.find(i => i.codigo === item.codigo);
    const quantidade = isSelected ? isSelected.quantidade : 0;

      return ( 
        <TouchableOpacity 
        style={ [
            {  backgroundColor: isSelected?.codigo  === item?.codigo  ? '#185FED' : '#FFF'} , 
        {  margin:5, padding:7, borderRadius:5 , elevation:4} ] } onPress={ ()=> selecionaServico(item)}  >
          
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
             <Text style={ [ {  color:   isSelected?.codigo  === item?.codigo  ? '#FFF' :'#000'     }, { fontWeight:'bold'} ] } >
              codigo:  {item.codigo}  
             </Text>
             
             <Text style={ [ {  color:   isSelected?.codigo  === item?.codigo  ? '#FFF' :'#000'      }, { fontWeight:'bold'} ] } >
             valor:  {item.valor}  
             </Text>

            </View>
          
         <Text style={ [ {  color:   isSelected?.codigo  === item?.codigo  ? '#FFF' :'#000'  }, { fontWeight:'bold'} ] }  numberOfLines={2} >
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


  function renderServicoSelecionado ( item ){

      return(
        <View style={{  borderRadius:5, elevation:3 ,backgroundColor: '#FFF',  margin: 10,  padding: 25, width:300 }}>
           
           <View style={{flexDirection:'row', justifyContent:'space-between', margin:3}}>
              
              <View style={{flexDirection:'row' }}>
                <Text style={{fontWeight:'bold' , color: '#6C757D'}}>
                 Codigo:
                
                 { ' '+item.codigo} </Text>
              </View>

                <View style={{flexDirection:'row' }}>
                  <Text style={{fontWeight:'bold',color: '#6C757D'}} >
                    Unitario:
                  
                  {' '+ item.valor}
                  </Text>
                </View>
            
            </View>

            <Text numberOfLines={2} style={{color: '#6C757D', fontWeight:'bold'}} >
              { item.aplicacao } 
            </Text>


      <View style={{flexDirection:'row', justifyContent:'space-between' }} >
            <View style={{flexDirection:'row' }}>
              <Text style={{fontWeight:'bold', color: '#6C757D'}} >
                Quantidade:
         
              {' '+item.quantidade}
              </Text>
            </View>

            <View style={{flexDirection:'row' }}>
                <Text style={{fontWeight:'bold',color: '#6C757D'}} >
                  Total: 
              
                 {' '+item.total}
                </Text>
            </View>
          </View>        
        

        </View>
      )
  }

      return(
        <View  style={{ flex:1}}>
                    <View style={{flexDirection:'row',margin:2 , alignItems:'center',   justifyContent:'center'  }}>
                      <Text style={{fontSize:20,fontWeight:'bold' ,color:'#6C757D' }}>
                          Serviços
                       </Text>
                      </View>

            <TouchableOpacity style={{backgroundColor:'#185FED', marginHorizontal:10,  padding:10, elevation:5, borderRadius:5, flexDirection:'row',alignItems:'center', justifyContent:'space-between'  }}
              onPress={ ()=>  { presstipoOs ?  setPresstipoOS(false) : setPresstipoOS(true)    } } >
                <Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold', alignSelf:'flex-start'}} > Tipo de OS </Text>
                { selectedTipo &&
                  ( <Text  style={{  color:'#FFF', fontSize:15,fontWeight:'bold' ,flex:1 }}  numberOfLines={2}>    {selectedTipo?.descricao} </Text> ) 
                }      

            </TouchableOpacity>


            <View style={{alignItems:'center' , justifyContent:'space-between', flexDirection:'row'}}>
                  <TouchableOpacity style={{backgroundColor:'#185FED',margin:10,  padding:10, elevation:5, borderRadius:5, flexDirection:'row', justifyContent:'space-between' ,width:'35%' }}
                            onPress={ ()=>    setVerServicos(true) } >
                          < Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold', width:'80%'}}>Serviços</Text>
                    <FontAwesome5 name="tools" size={24} color="white" />
                  </TouchableOpacity>
                
                  <TouchableOpacity style={{backgroundColor:'#185FED',margin:10,  padding:10, elevation:5, borderRadius:5, flexDirection:'row', justifyContent:'space-between' ,width:'35%' }}
                              onPress={ ()=>    setVerVeiculos(true) } >
                            { !selectedVeiculo && <Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold',width:'80%' }}>Veiculos</Text> }

                                {
                                  selectedVeiculo &&  < Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold' }}> {selectedVeiculo?.codigo}</Text>
                                }

                      <FontAwesome5 name="car" size={24} color="white" />
                  </TouchableOpacity>
                </View>
          
              {/**modal tipos de OS  */ }
               
            <Modal visible={presstipoOs} transparent={true}>
              <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", height: "90%", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 5 }}>
                  <View style={{ backgroundColor: '#185FED', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Tipos de OS</Text>
                    <TouchableOpacity onPress={() => setPresstipoOS(false)} style={{ padding: 4 }}>
                      <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={tipoOs}
                    renderItem={({ item }) => renderItemOS(item)}
                    contentContainerStyle={{ padding: 12 }}
                  />
                </View>
              </View>
            </Modal>
              {/******* */}
           
       
          {/****** modal veiculos */}
           <Modal visible={verVeiculos} transparent={true}>
              <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", height: "90%", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 5 }}>
                  <View style={{ backgroundColor: '#185FED', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Selecionar Veículo</Text>
                    <TouchableOpacity onPress={() => setVerVeiculos(false)} style={{ padding: 4 }}>
                      <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1 }}>
                    {dadosVeiculos.length > 0 ? (
                      <FlatList
                        data={dadosVeiculos}
                        renderItem={({ item }) => renderItemVeiculo(item)}
                        keyExtractor={(item) => item.codigo.toString()}
                        contentContainerStyle={{ padding: 12 }}
                      />
                    ) : (
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15, color: '#999' }}>Nenhum veículo encontrado!</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Modal>

                {  
                    servicosSelecionado &&
                    <View style={{marginTop:5, marginBottom:5}}>
                      <FlatList
                        data={servicosSelecionado}
                        horizontal={true}
                        renderItem={({ item }) => renderServicoSelecionado(item) } 
                        keyExtractor={ (item)=> item.codigo.toString()}
                        />
                    </View>

                     }

          <View style={{ flexDirection:'row', justifyContent:'space-between', margin:5}}>
            { servicosSelecionado?.length > 0 ? ( <Text style={{ fontSize:15 ,fontWeight:'bold', color: '#6C757D'}}> total serviços :{ totalItens.toFixed(2)}  </Text>): null }
                      {
                        selectedVeiculo ? ( <Text style={{fontWeight:'bold'}}> placa: {selectedVeiculo?.placa } </Text>) : null
                      } 

            </View>                    
                
                
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
  