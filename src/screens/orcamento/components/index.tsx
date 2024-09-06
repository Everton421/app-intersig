import React, { useContext, useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View, ScrollView, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { ListaProdutos } from "./produtos"; 
import { ListaItemOrcamento } from "./itemOrcamento";  
import { ListaClientes } from "./clientes";       
import { Parcelas } from "./parcelas";  
import { FlatList, TextInput } from "react-native-gesture-handler";
import { api } from "../../../services/api";  
import { OrcamentoContext } from "../../../contexts/orcamentoContext";
import { ConnectedContext } from "../../../contexts/conectedContext";
import { usePedidos } from "../../../database/queryPedido/queryPedido";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Cart } from "./Cart";
import { Detalhes } from "./detalhes";
import { AuthContext } from "../../../contexts/auth";
import { Servico } from "./servico";

export const Orcamento = ({orcamentoEditavel, navigation}) => {
    const [visibleProdutos, setVisibleProdutos] = useState<boolean>(false);
    const [visibleClientes, setVisibleClientes] = useState<boolean>(false);
    const [totalGeral, setTotalGeral] = useState<number | undefined>();
    const [descontosGeral, setDescontosGeral] = useState<number >(0);
    const [totalProdutos, setTotalProdutos] = useState<number>();
    const [quantidade_parcelas, setQuantidade_parcelas] = useState<number | undefined>();
    const [observacoes, setObservacoes] = useState<string>('');
    const [formaPagamento, setFormaPagamento] = useState<number | undefined>();
    const [status, setStatus] = useState<number>(0);
    const [response, setResponse] = useState<string>('');
    const [editavel, setEditavel] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [ dataAtual, setDataAtual ] = useState<any>();
    const [ tipoOrcamento , setTipoOrcamento ] = useState<number>(1)
/////

  const [selectedItem, setSelectedItem] = useState([]);
////

const { usuario } = useContext(AuthContext)

    const { orcamento, setOrcamento } = useContext(OrcamentoContext);
    const { connected } = useContext(ConnectedContext)
    const useQuerypedidos = usePedidos();


    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se o mês for menor que 10
        const day = String(now.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se o dia for menor que 10
    
            setDataAtual( `${year}-${month}-${day}` )
        return `${year}-${month}-${day}`;
      };


     useEffect(() => {
        if (status === 200 && response) {
            setOrcamento((prevOrcamento: OrcamentoModel) => ({
                ...prevOrcamento,
                cliente: null,
                produtos: [],
                parcelas: [],
                vendedor:0,
                tipo:tipoOrcamento
            }));
            setTotalGeral(0);
            setDescontosGeral(0);
            
            Alert.alert(response);
            navigation.navigate('vendas');
        }

        if(status === 500 ){
            setOrcamento((prevOrcamento: OrcamentoModel) => ({
                ...prevOrcamento,
                cliente: null,
                produtos: [],
                parcelas: [],
                vendedor:0,
                tipo:tipoOrcamento
            }));
            setTotalGeral(0);
            setDescontosGeral(0);
            
            Alert.alert(response);
            navigation.navigate('vendas');
        }

    }, [status, response, navigation, setOrcamento]);
   
  
     useEffect(() => {
         let novoTotalGeralProdutos = 0;
         let totaDescontosProdutos = 0;
         let totalValorProdutos = 0;
 
         let novoTotalGeralServicos = 0;
         let totaDescontosServicos = 0;
         let totalValorServicos = 0;
        
            let totalGeralOrcamento = 0;
             
            ////****  
            ////**** total de descontos esta considerando somente os 
            ////**** descontos dos produtos 
            ////****

         if( !orcamento.produtos){
             return
         }
         if( !orcamento.servicos){
            return
        } 

         if( orcamento.produtos.length > 0  ){
            orcamento.produtos.forEach((i: any) => {
                     novoTotalGeralProdutos+= i.total;
                     totaDescontosProdutos += i.desconto;
                     totalValorProdutos += i.preco * i.quantidade;
                 });
             setTotalProdutos(totalValorProdutos);
             setTotalGeral(novoTotalGeralProdutos);
             setDescontosGeral(totaDescontosProdutos);
          
     }

        if( orcamento.servicos.length > 0  ){
            orcamento.servicos.forEach((i: any) => {
                novoTotalGeralServicos+= i.total;
                totaDescontosServicos += i.desconto;
                totalValorServicos += i.valor * i.quantidade;
            });
        }
            totalGeralOrcamento = novoTotalGeralServicos + novoTotalGeralProdutos

        setOrcamento((prevOrcamento: OrcamentoModel) => ({
            ...prevOrcamento,
            total_produtos: totalValorProdutos,
            total_servicos: totalValorServicos, 
            total_geral: totalGeralOrcamento,
            descontos: totaDescontosProdutos,
            observacoes: observacoes || '',
        }));

     }, [orcamento.produtos, orcamento.parcelas, observacoes, setOrcamento , orcamento.descontos  , orcamento.servicos ]);
    
    /////////////////////////////
    
    useEffect(()=>{
    
        console.log('');
        console.log('Orçamento atualizado : ' ,orcamento);
        console.log('');
        console.log(`Codigo usuario:  `,usuario.codigo);

    },[ orcamento ])
    
    /////////////////////////////
    
    
    useEffect(() => {
            let data = getCurrentDate();
        if (!orcamentoEditavel || orcamentoEditavel === null) {
            
            setOrcamento((prevOrcamento: OrcamentoModel) => ({
                ...prevOrcamento,
                vendedor: usuario.codigo,
                total_produtos: 0,
                total_geral: 0,
                descontos: 0,
                observacoes: observacoes || '',
                codigo:0,
                quantidade_parcelas:0,
                cliente: {},
                parcelas: [],
                produtos:[],
                servicos:[],
                data_cadastro: data
            }));

        } else {
          //  setOrcamento(orcamentoEditavel); 
           // console.log(orcamentoEditavel)
            setEditavel(true);
        }
    }, [ orcamentoEditavel, observacoes, setOrcamento]);
        
        
const alertaExclusao = (item)=>{
    Alert.alert('', `deseja excluir o item : ${item.descricao} ?`,[
        { text:'Não',
            onPress: ()=> console.log('nao excluido o item'),
            style:'cancel',
        },
        {
            text: 'Sim', onPress:()=> console.log(`Excluindo o item ${item.descricao}`)
        }
    ] )
}


                 

    const gravar = async () => {
        setLoading(true);

        if (editavel) {
            if( connected ){
                  try {
                      const response = await api.put('/orcamentos', orcamento);
                      if (response.status === 200) {
                          setStatus(response.status);
                          setResponse(response.data.msg);
                      }
                  } catch (err) {
                      console.error(  'Erro ao enviar o orcamento para a api ! ', err  );
                      setResponse('Erro ao salvar o orçamento.');
                  } finally {
                      setLoading(false);
                  }
  
                  
                  }else{
                
                    try{
                    await  useQuerypedidos.updateOrder(orcamento);
                    setStatus(200)
                    setResponse('Orçamento registrado com sucesso!')
                    }catch(e ){ console.log('erro ao gravar o orcamento no SQLITE',e)
                        } finally {
                            setLoading(false);
                        }
                }

        } else {

            let cliente, produtos, parcelas;

            setOrcamento((prevOrcamento: OrcamentoModel) => ({
                ...prevOrcamento,
                    vendedor:usuario.codigo
            }));

            if (!orcamento.cliente) {
                Alert.alert('É necessário informar o cliente!');
                setLoading(false);
                return;
            } else {
                cliente = orcamento.cliente;
            } 

            if (!orcamento.produtos || orcamento.produtos.length === 0 ) {
                Alert.alert('É necessário informar os produtos!');
                setLoading(false);
                return;
            } else {
                produtos = orcamento.produtos;
            }
            if (orcamento.parcelas.length === 0) {
                Alert.alert('É necessário informar as parcelas!');
                setLoading(false);
                return;
            } else {
                parcelas = orcamento.parcelas;
            }

             if(connected ){
                      try {
                          const response = await api.post('/orcamentos', orcamento);
                          if (response.status === 200) {
                              setStatus(response.status);
                              setResponse(response.data.msg);
                          }
                      } catch (err) {
                        console.error(  'Erro ao enviar o orcamento para a api ! ', err  );
                          setResponse('Erro ao salvar o orçamento.');
                      } finally {
                          setLoading(false);
                      }
                  }else{

                    try{

                        console.log(orcamento)

                       let response =  await  useQuerypedidos.createOrder(orcamento);
                        
                       if(response > 0 ){
                        console.log('')
                        console.log('codigo oracamento resgistrado : ',response)
                        console.log('')

                        setStatus(200)
                        setResponse('Orçamento registrado com sucesso!')
                        }
                         else{
                             setStatus(500)
                         setResponse(' falha ao registrar orcamento! ')
 
                         }

                    }catch(e ){ 
                        console.log('erro ao gravar o orcamento no SQLITE',e)
                    } finally {
                    setLoading(false);
                    }
                }
        }
    };
 


    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>

                         {/************* seletor tipo de orcamento  ************/}
                        <View style={{marginLeft:10}}>        
                            <Text style={{ fontWeight:"bold"}}>
                                Tipo De Orcamento:
                            </Text>
                         </View>
                    <View style={{ flexDirection:"row" ,margin:5, gap:8}} >
                           
                        <TouchableOpacity  onPress={ ()=> setTipoOrcamento(1) }
                            style={ [{backgroundColor: tipoOrcamento === 1 ? '#009de2' : '#FFF'}, { width:'20%' ,elevation:5, borderRadius:5 , padding:5 }] }>
                                <Text style={
                                    [{  color: tipoOrcamento === 1 ? '#FFF' : 'black' }, { fontWeight:"bold"}]
                                } >
                                    VENDA
                                </Text>
                        </TouchableOpacity>

                        <TouchableOpacity  onPress={ ()=> setTipoOrcamento(2) }
                       style={ [{backgroundColor: tipoOrcamento === 2 ? '#009de2' : '#FFF'}, { width:'20%', elevation:5, borderRadius:5 , padding:5}] }>
                             <Text style= { [{ color: tipoOrcamento === 2 ? '#FFF' : 'black' },{ fontWeight:"bold"}]} >
                                OS
                            </Text>
                        </TouchableOpacity>
                     
                     </View>
                     {/**** */}

  {/** *** separador ***/} 
  <View style={{ borderWidth: 0.5, margin: 5 }}></View> 
  {/** ***   ***/} 

              <View style={{ flexDirection: 'row' }}>
                    <ListaClientes orcamentoEditavel={orcamentoEditavel} />
                </View>
   
                <View style={{ justifyContent: 'center', backgroundColor: '#FFF', padding: 7 }}>
                    
                    <Text style={{ fontWeight: 'bold' }}> {orcamento.cliente?.nome}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}> cnpj: {orcamento?.cliente?.cnpj}</Text>
                        <Text style={{ fontWeight: 'bold' }}>contato: {orcamento?.cliente?.celular}</Text>
                    </View>
                </View>



        {/*//////////////// components serviços  ////////////////////////*/    }  
      
            {/** ***   ***/} 

                            { tipoOrcamento === 2 ?
                                    <View> 
                                   
                                            <Servico/>
                                        </View>
                                    :null
                                }    

                  
      {/*//////////////// components produtos  ////////////////////////*/    }  

                <View style={{ flexDirection: 'row' , margin: 5}}>
                       <ListaProdutos orcamentoEditavel={orcamentoEditavel?.produtos} />
                 <Cart/>
                 </View>
      {/*////////////////////////////////////////////////////////////////*/    }  
  

                 {/** 
                  
                 
                    <FlatList
                        data={orcamento.produtos}
                        horizontal={true}
                        renderItem={({ item }) => <ItemsDoPedido2 item={item} />}
                        keyExtractor={ (item)=> item.codigo.toString()}
                    />
                
                )
              */  }

      {/*////////////////////////////////////////////////////////////////*/    }  

                    <View style={{ borderWidth: 0.4, margin: 10 }}></View>
                    <View style={{ margin: 5 }}>
                        <Parcelas orcamentoEditavel={orcamentoEditavel} />
                    </View>
                    <View style={{ borderWidth: 0.2, margin: 5 }}></View>

 {/*********************************************/}
                <Detalhes/>
 {/*********************************************/}

             {/**   <View style={{ margin: 3 }}>
                    <ListaItemOrcamento /> 
                </View>*/} 


               
            </ScrollView>
                       <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderColor: '#ccc', borderWidth: 1, borderRadius: 5, elevation: 5, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Total: R$ {totalGeral?.toFixed(2)}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Descontos: R$ {descontosGeral ? descontosGeral.toFixed(2) :  0 }</Text>

                <TouchableOpacity
                    style={{ padding: 7, backgroundColor: '#009de2', elevation: 5, margin: 3, borderRadius: 5 }}
                    onPress={() => gravar()}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ padding: 7, backgroundColor: '#009de2', elevation: 5, margin: 3, borderRadius: 5 }}
                    onPress={() => console.log(orcamento)}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>mostrar</Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] }}>
                    <ActivityIndicator size="large" color="#009de2" />
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
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
      },  buttonsContainer: {
        flexDirection: 'row'
      },
})