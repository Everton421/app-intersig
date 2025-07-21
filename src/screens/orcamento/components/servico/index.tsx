import { useContext, useEffect, useState } from 'react';
import { TextInput, ActivityIndicator, Alert, Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { OrcamentoContext } from '../../../../contexts/orcamentoContext';
import { ConnectedContext } from '../../../../contexts/conectedContext';
import { useServices } from '../../../../database/queryServicos/queryServicos';
import { useFormasDePagamentos } from '../../../../database/queryFormasPagamento/queryFormasPagamento';
import { useTipoOs } from '../../../../database/queryTipoOs/queryTipoOs';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useServicosPedido } from '../../../../database/queryPedido/queryServicosPedido';
import { useVeiculos } from '../../../../database/queryVceiculos/queryVeiculos';
import { usePedidos } from '../../../../database/queryPedido/queryPedido';

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
  //////////////////////////////////////////////      

  useEffect(() => {
    let aux = 0;
    servicosSelecionado.forEach((e:any) => {
      e.total = (e.quantidade * e.valor)  
      aux += e.total;
    });
    
    setTotalItens(aux);
    
      setOrcamento((prevOrcamento: OrcamentoModel) => ({
        ...prevOrcamento ,
        servicos: servicosSelecionado,
    }));
  
  }, [ servicosSelecionado ]);
  //////////////////////////////////////////////      
  useEffect(
    ()=>{
      async function init(){
    
        if(codigo_orcamento && codigo_orcamento > 0 ){
          setServicosSelecionado([])
          
          let resultServicos:any = await useServicosDoPedido.selectByCodeOrder(codigo_orcamento);
          let resultOrcamento:any = await useQueryPedidos.selectByCode( codigo_orcamento ) 


          if( resultServicos?.length > 0   )   setServicosSelecionado(resultServicos)

           let veiculo:any = 0 ;
            let tipo:any = 0;
           if( resultOrcamento?.length > 0  ){
              if(  resultOrcamento[0].veiculo > 0 ){
                veiculo =  await useQueryVeiculos.selectByCode( resultOrcamento[0].veiculo );
                setSelectedVeiculo(veiculo[0]) 
              }
 
               if( resultOrcamento[0].tipo_os > 0 ){
             tipo = await useQueryTipoOs.selectByCode(resultOrcamento[0].tipo_os)
             setSelectedTipo(tipo[0])
               }      
            }

              setOrcamento((prevOrcamento: OrcamentoModel) => ({
                ...prevOrcamento ,
                servicos: resultServicos,
                 veiculo:veiculo[0]?.codigo,
                 tipo_os:tipo[0]?.codigo
              }));
         } 
      } 
      
      init(); 
    },[   codigo_orcamento ])
  //////////////////////////////////////////////      
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
            {  backgroundColor: isSelected?.codigo  === item?.codigo  ? '#185FED' : '#009de2'} , 
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
        
        <View   >
 
                   
                    <View style={{flexDirection:'row', alignItems:'center',   justifyContent:'center'  }}>
                      <Text style={{fontSize:15,fontWeight:'bold' }}>
                          Serviços
                       </Text>
                      </View>


            <TouchableOpacity style={{backgroundColor:'#185FED',margin:3,  padding:10, elevation:5, borderRadius:5, flexDirection:'row', justifyContent:'space-between'  }}
            onPress={ ()=>  { presstipoOs ?  setPresstipoOS(false) : setPresstipoOS(true)    } } >
              { selectedTipo ?
                ( <Text  style={{ color:'#FFF', fontSize:15,fontWeight:'bold', width:'90%' }}  numberOfLines={2}>    {selectedTipo?.descricao} </Text> ) 
                :
                (  < Text style={{ color:'#FFF', fontSize:15,fontWeight:'bold',width:'90%' }}>Tipos De OS</Text> )       

              }      

            {
              selectedTipo ?
              (  <FontAwesome5 name="toolbox" size={28} color="#FFF" /> )
              :
              (   <AntDesign name="caretdown" size={24} color="white"    />

              )
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
                          style={{ margin: 15, backgroundColor: '#185FED', padding: 7, borderRadius: 7, width: '20%', elevation: 5 }} >
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
                        style={{ margin: 15, backgroundColor: '#185FED', padding: 7, borderRadius: 7, width: '20%', elevation: 5 }} >
                       <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                        voltar
                      </Text>
                    </TouchableOpacity>

                        <TextInput
                            placeholder='pesquisar'
                            style={{ margin:10, backgroundColor:'#F5F6F8', width:'90%',  elevation:5, textAlign:'center', padding:5, borderRadius:10}}
                            onChangeText={ (t)=>  setPesquisa(t) }
                            placeholderTextColor={'#185FED'}
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

                   <View style={{flexDirection:'row',justifyContent:'space-between', width:"100%"}}>
                       <TouchableOpacity onPress={() => {setVerVeiculos(false)  }}
                              style={{ margin: 15, backgroundColor: '#185FED', padding: 7, borderRadius: 7, width: '20%', elevation: 5 }} >
                             <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                               voltar
                           </Text>
                        </TouchableOpacity>
                        <Text style={{margin:15 ,fontWeight:'bold', width:'100%'   }}>
                          Veiculos
                        </Text>
                    </View>
                        
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
  