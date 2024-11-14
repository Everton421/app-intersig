import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useContext, useEffect, useState } from 'react';
import { TextInput, ActivityIndicator, Alert, Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
 
import { api } from '../../../../services/api'; 
 
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ItensServicoListaHorizontal } from '../itens_Servico_lista';
import { OrcamentoContext } from '../../../../contexts/orcamentoContext';
import { ConnectedContext } from '../../../../contexts/conectedContext';
import { useServices } from '../../../../database/queryServicos/queryServicos';
import { useFormasDePagamentos } from '../../../../database/queryFormasPagamento/queryFormasPagamento';
import { useTipoOs } from '../../../../database/queryTipoOs/queryTipoOs';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useServicosPedido } from '../../../../database/queryPedido/queryServicosPedido';
import { useVeiculos } from '../../../../database/queryVceiculos/queryVeiculos';

export const Servico = ( { orcamentoEditavel } )=>{
    const [ selectedTipo , setSelectedTipo  ] = useState(null);
    const [presstipoOs,    setPresstipoOS   ] = useState(false); 
    const [ verServicos ,  setVerServicos   ] = useState(false);
    const [ verVeiculos ,  setVerVeiculos   ] = useState(false);
    const [ selectedVeiculo , setSelectedVeiculo  ] = useState( );

    const [ pesquisa,      setPesquisa      ] = useState();
    const [ pesquisaVeiculo,   setPesquisaVeiculo    ] = useState();

    const [ tipoOs , setTipoOs] = useState([]);
     const [ dadosServicos , setDadosServicos ] = useState([]);
     const [ dadosVeiculos , setDadosVeiculos ] = useState([]);


    const [ servicosSelecionado, setServicosSelecionado ] = useState([]);
    const [totalItens, setTotalItens ]= useState(0);

      const { orcamento, setOrcamento } = useContext( OrcamentoContext )
      const { connected, setConnected } = useContext(ConnectedContext)

        const useQueryServicos = useServices();
        const useQueryFpgt =  useFormasDePagamentos();
        const useQueryTipoOs = useTipoOs();
      const useServicosDoPedido = useServicosPedido();
      const useQueryVeiculos = useVeiculos();

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
  //////////////////////////////////////////////      

 
 

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
  //////////////////////////////////////////////      

  useEffect(
    ()=>{
      
      async function init2(){
        if(orcamentoEditavel !== null  && orcamentoEditavel.codigo !== undefined  && orcamentoEditavel.servicos){
          console.log('aaaaaaaaa')
        }else{
           
        }
      }
      init2();

      async function init(){

        if(orcamentoEditavel !== null  && orcamentoEditavel.codigo !== undefined  && orcamentoEditavel.servicos){
          console.log( '');
          console.log( '');
          console.log( `editando :`,orcamentoEditavel);
          console.log( '');

               if( orcamentoEditavel.veiculo === undefined ){
                 orcamentoEditavel.veiculo = 0 
               }
 
               if( orcamentoEditavel.veiculo !== 0 ){
               const responseVeic:any = await useQueryVeiculos.selectByCode( orcamentoEditavel.veiculo );
               setSelectedVeiculo(  responseVeic[0]  );
                 }else{
                   setSelectedVeiculo(null)
                 }
              
            // const response:any = await useQueryTipoOs.selectAll();
              
               if( response.length > 0  ){
                   setTipoOs(response);
                   let aux = response.find( i => i.codigo === orcamentoEditavel.tipo_os)
                   setSelectedTipo(aux)
                 }
 
                 let servicos:any  = await useServicosDoPedido.selectByCodeOrder(orcamentoEditavel.codigo)
                   if( servicos.length > 0 || servicos !== undefined  ){
                     setServicosSelecionado( servicos)
                   }
   
            }else{
              setSelectedVeiculo(0)
            }  
       } 

   //   init()
    },[])

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

      setOrcamento((prevOrcamento: OrcamentoModel) => ({
        ...prevOrcamento,
        tipo_os: item.codigo,
    }));
      // console.log(selectedTipo)
      setPresstipoOS(false)
    }

    function selecionaVeiculo (item) {
      setSelectedVeiculo(item),
      setOrcamento((prevOrcamento: OrcamentoModel) => ({
        ...prevOrcamento,
        veiculo: item.codigo ,
    }));
     // console.log(selectedVeiculo)
      setVerVeiculos(false)
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

    function renderItemVeiculo  (item) {

      return ( 
        <TouchableOpacity style={[ {    backgroundColor: selectedVeiculo?.codigo === item.codigo  ? '#009de2' : '#FFF'},
           {  margin:5, padding:7, borderRadius:5 , elevation:4}] } 
        onPress={ ()=> selecionaVeiculo(item)}  >
          
          <Text style={ [ {  color: selectedVeiculo?.codigo === item.codigo ? 'white' : 'black' },{   fontWeight:'bold'}]} >

            codigo:  {item.codigo} placa: {item.placa}
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
    const isSelected = orcamento.servicos.find(i => i.codigo === item.codigo);
    const quantidade = isSelected ? isSelected.quantidade : 0;

      return ( 
        <TouchableOpacity 
        style={ [
            {  backgroundColor: isSelected?.codigo  === item?.codigo  ? '#339' : '#009de2'} , 
        {  margin:5, padding:7, borderRadius:5 , elevation:4} ] } onPress={ ()=> selecionaServico(item)}  >
          
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
             <Text style={{ color:'white', fontWeight:'bold'}} >
              codigo:  {item.codigo}  
             </Text>
             
             <Text style={{ color:'white', fontWeight:'bold'}} >
             valor:  {item.valor}  
             </Text>

            </View>
          
          <Text style={{ color:'white', fontWeight:'bold'}} numberOfLines={2} >
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
        <View style={{ backgroundColor: '#FFF', elevation: 7, margin: 3, borderRadius: 30, padding: 35, width:300 }}>
           
           <View style={{flexDirection:'row', justifyContent:'space-between', margin:3}}>
              
              <View style={{flexDirection:'row' }}>
                <Text style={{fontWeight:'bold'}}>
                 Codigo:
                </Text>
                <Text> { ' '+item.codigo} </Text>
              </View>

                <View style={{flexDirection:'row' }}>
                  <Text style={{fontWeight:'bold'}} >
                    Unitario:
                  </Text>
                  <Text>
                  {' '+ item.valor}
                  </Text>
                </View>
            
            </View>

            <Text numberOfLines={2} >
              { item.aplicacao } 
            </Text>


      <View style={{flexDirection:'row', justifyContent:'space-between' }} >
            <View style={{flexDirection:'row' }}>
              <Text style={{fontWeight:'bold'}} >
                Quantidade:
              </Text>
              <Text>
              {' '+item.quantidade}
              </Text>
            </View>

            <View style={{flexDirection:'row' }}>
                <Text style={{fontWeight:'bold'}} >
                  Total: 
                </Text>
                <Text>
                 {' '+item.total}
                </Text>
            </View>
          </View>        
        

        </View>
      )
  }

      return(
        
        <View   >

          {/** separador */}
      <View style={{ borderWidth: 0.5, margin: 5 }}></View> 
                   
                    <View style={{flexDirection:'row', alignItems:'center',   justifyContent:'center'  }}>
                      <Text style={{fontSize:15,fontWeight:'bold' }}>
                          Serviços
                       </Text>
                      </View>


            <TouchableOpacity style={{backgroundColor:'#009de2',margin:3,  padding:10, elevation:5, borderRadius:5, flexDirection:'row', justifyContent:'space-between'  }}
            onPress={ ()=>  { presstipoOs ?  setPresstipoOS(false) : setPresstipoOS(true)    } } >
              { selectedTipo ?
                ( <Text  style={{ color:'#FFF', fontSize:15,fontWeight:'bold' }}  numberOfLines={2}>    {selectedTipo?.descricao} </Text> ) 
                :
                (  < Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold' }}>Tipos De OS</Text> )       

              }      

            {
              selectedTipo ?
              (  <FontAwesome5 name="toolbox" size={28} color="#FFF" /> )
              :
              ( <AntDesign name="down" size={28} color="#FFF" />
              )
            }
           
            

            </TouchableOpacity>


            <View style={{alignItems:'center' , justifyContent:'space-between', flexDirection:'row'}}>
                  <TouchableOpacity style={{backgroundColor:'#009de2',margin:10,  padding:10, elevation:5, borderRadius:5, flexDirection:'row', justifyContent:'space-between' ,width:'35%' }}
                            onPress={ ()=>    setVerServicos(true) } >
                          < Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold' }}>Serviços</Text>

                    <FontAwesome5 name="tools" size={24} color="white" />
                
                </TouchableOpacity>
                
                <TouchableOpacity style={{backgroundColor:'#009de2',margin:10,  padding:10, elevation:5, borderRadius:5, flexDirection:'row', justifyContent:'space-between' ,width:'35%' }}
                            onPress={ ()=>    setVerVeiculos(true) } >
                          { !selectedVeiculo && <Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold' }}>Veiculo</Text> }

                              {
                                selectedVeiculo &&  < Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold' }}> {selectedVeiculo?.codigo}</Text>
                              }

                    <FontAwesome5 name="car" size={24} color="white" />
                </TouchableOpacity>
                
                </View>
          
              {/**modal tipos de OS  */ }
               
              <Modal visible={presstipoOs} transparent={true}   >

                {
                  tipoOs.length > 0 ? 
                  ( 
                    <View style={{ backgroundColor:'rgba( 50 ,50 ,50, 0.5 )', flex:1 }} >
                    <View style={{ backgroundColor:'white',   padding:15, borderRadius:10 , margin:'2%', marginTop:'50%', elevation:2}} >
                          
                          <View style={{ flexDirection:'row', justifyContent:'space-between'}}> 
                          <Text style={{margin:5, fontWeight:'bold'}} > Tipos De OS </Text>

                            <TouchableOpacity 
                              onPress={()=>  setPresstipoOS(false)  }
                              >
                                  <AntDesign name="closecircle" size={24} color="red" />
                              </TouchableOpacity>
                            </View>
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

          {/****** modal veiculos */}
           <Modal visible={verVeiculos} transparent={true}>
                <View style={{ backgroundColor:'rgba( 50,50,50, 0.5 )', flex:1, alignItems:'center', justifyContent:'center' }} > 
                  <View style={{ backgroundColor:'#FFF', width:'95%' , height:'90%' ,padding:5, borderRadius:15}}>

                   <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                       <TouchableOpacity onPress={() => {setVerVeiculos(false)  }}
                              style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '20%', elevation: 5 }} >
                             <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                               voltar
                           </Text>
                        </TouchableOpacity>
                        <Text style={{margin:15, fontWeight:'bold'}}>
                          Veiculos
                        </Text>
                    </View>
                       
                       {/**  <TextInput
                            placeholder='pesquisar'
                            style={{ margin:10, backgroundColor:'#F5F6F8', width:'90%', elevation:5, textAlign:'center', padding:5, borderRadius:10}}
                            onChangeText={ (t)=>  setPesquisaVeiculo(t) }
                           />  
                       */ }
                        <View style={{ height:'75%' }} >
                         
                  <FlatList
                              data={ dadosVeiculos }
                              renderItem={ ({item})=> renderItemVeiculo( item ) }
                              keyExtractor={ (item:any) =>item.codigo.toString() }
                            />  
                            
                        </View>
                      
                 </View>

                </View>
            </Modal>

                {  
                    orcamento.servicos &&
                    <View style={{marginTop:5, marginBottom:5}}>
                      <FlatList
                        data={orcamento.servicos}
                        horizontal={true}
                        renderItem={({ item }) => renderServicoSelecionado(item) } 
                        keyExtractor={ (item)=> item.codigo.toString()}
                        />
                    </View>

                     }

          <View style={{ flexDirection:'row', justifyContent:'space-between', margin:10}}>
            { orcamento?.servicos.length > 0 ? ( <Text style={{ fontSize:15 ,fontWeight:'bold'}}> total serviços :{ totalItens.toFixed(2)}  </Text>): null }
                      {
                        selectedVeiculo ? ( <Text style={{fontWeight:'bold'}}> placa: {selectedVeiculo?.placa } </Text>) : null
                      } 
            </View>                    

                
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
  