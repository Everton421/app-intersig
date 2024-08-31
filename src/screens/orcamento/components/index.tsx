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

export const Orcamento = ({orcamentoEditavel, navigation}) => {
    const [visibleProdutos, setVisibleProdutos] = useState<boolean>(false);
    const [visibleClientes, setVisibleClientes] = useState<boolean>(false);
    const [totalGeral, setTotalGeral] = useState<number | undefined>();
    const [descontosGeral, setDescontosGeral] = useState<number | undefined>();
    const [totalProdutos, setTotalProdutos] = useState<number>();
    const [quantidade_parcelas, setQuantidade_parcelas] = useState<number | undefined>();
    const [observacoes, setObservacoes] = useState<string>('');
    const [formaPagamento, setFormaPagamento] = useState<number | undefined>();
    const [status, setStatus] = useState<number>(0);
    const [response, setResponse] = useState<string>('');
    const [editavel, setEditavel] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

/////

  const [selectedItem, setSelectedItem] = useState([]);
////


    const { orcamento, setOrcamento } = useContext(OrcamentoContext);
    const { connected } = useContext(ConnectedContext)
    const useQuerypedidos = usePedidos();

     useEffect(() => {
        if (status === 200 && response) {
            setOrcamento((prevOrcamento: OrcamentoModel) => ({
                ...prevOrcamento,
                cliente: null,
                produtos: [],
                parcelas: [],
            }));
            setTotalGeral(0);
            setDescontosGeral(0);
            
            Alert.alert(response);
            navigation.navigate('vendas');
        }
    }, [status, response, navigation, setOrcamento]);
   
  
     useEffect(() => {
         let novoTotalGeral = 0;
         let totaDescontos = 0;
         let totalValorProdutos = 0;
 
         if( !orcamento.produtos){
             return
         }
         if( orcamento.produtos.length > 0 ){
                 orcamento.produtos.forEach((i: any) => {
                     novoTotalGeral += i.total;
                     totaDescontos += i.desconto;
                     totalValorProdutos += i.preco * i.quantidade;
                 });
 
             setTotalProdutos(totalValorProdutos);
             setTotalGeral(novoTotalGeral);
             setDescontosGeral(totaDescontos);
 
             setOrcamento((prevOrcamento: OrcamentoModel) => ({
                 ...prevOrcamento,
                 total_produtos: totalValorProdutos,
                 total_geral: novoTotalGeral,
                 descontos: totaDescontos,
                 observacoes: observacoes || '',
             }));
 
     }
     }, [orcamento.produtos, orcamento.parcelas, observacoes, setOrcamento    ]);
    
    /////////////////////////////
    
    useEffect(()=>{
    
        console.log('');
        console.log('Orçamento atualizado : ' ,orcamento);
        console.log('');
      
    },[ orcamento ])
    
    /////////////////////////////
    
    const handleIncrement = (item) => {
        setOrcamento((prevOrcamento) => {
            // Crie uma nova lista de produtos atualizada
            const novosProdutos = prevOrcamento.produtos.map((i) => {
                if (i.codigo === item.codigo) {
                    // Atualize a quantidade do produto correspondente
                    return { ...i, quantidade: i.quantidade + 1 };
                }
                return i;
            });
    
            // Atualize o estado do orçamento com a nova lista de produtos
            return {
                ...prevOrcamento,
                produtos: novosProdutos,
            };
        });
    };
    
      const handleDecrement = (item) => {
        setSelectedItem((prevSelectedItems) => {
          return prevSelectedItems.map((i) => {
            if (i.codigo === item.codigo) {
              return { ...i, quantidade: Math.max(i.quantidade - 1, 0) };
            }
            return i;
          });
        });
      };

    useEffect(() => {
        if (!orcamentoEditavel || orcamentoEditavel === null) {
            setOrcamento((prevOrcamento: OrcamentoModel) => ({
                ...prevOrcamento,
                total_produtos: 0,
                total_geral: 0,
                descontos: 0,
                observacoes: observacoes || '',
                codigo:0,
                quantidade_parcelas:0,
                cliente: {},
                parcelas: [],
                produtos:[]
            }));
        } else {
          //  setOrcamento(orcamentoEditavel); 
           // console.log(orcamentoEditavel)
            setEditavel(true);
        }
    }, [
        orcamentoEditavel,
         observacoes,
          setOrcamento]);
        

        //   useEffect(() => {
        //     console.log('');
        //     console.log('Orçamento atualizado:', orcamento);
        //     console.log('');
        //   }, [orcamento])

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


    const ItemsDoPedido2 = ({ item }) => (
        <View style={{ backgroundColor: '#009de2', elevation: 7, margin: 3, borderRadius: 30, padding: 25 }}>
            
                <View style={{flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Cod. {item.codigo}    Qtd. {item.quantidade}
                    </Text>

                           <TouchableOpacity onPress={()=> alertaExclusao(item)} style={{  elevation:5}}>    
                             <FontAwesome name="close" size={24} color="white" />
                           </TouchableOpacity>
                </View>
            
            
            <Text style={{ color: 'white', fontWeight: 'bold', width: 160 }} numberOfLines={2}>
                {item.descricao}
            </Text>

        <TouchableOpacity style={{ elevation:5,  margin:2 , width:35, padding:5, backgroundColor:'white' , borderRadius:7, alignItems:"center"}} onPress={()=> setVisibleProdutos(true)}>
            <Feather name="edit" size={24} color="#009de2" />
            
        </TouchableOpacity>
        
            <Modal
            visible={visibleProdutos}
            transparent={true}
            >
                    <View style={{
                        marginTop: 25,margin:10, backgroundColor: 'white', borderRadius: 20, width: '96%',
                        height: '80%', shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>

                      <TouchableOpacity onPress={() => {setVisibleProdutos(false)  }}
                          style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '25%', elevation: 5 }} >
                         <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                              voltar
                        </Text>
                    </TouchableOpacity>  


                      <View style={{ margin:10 }} >   
                            <Text style={{   fontWeight: 'bold' }}>
                                Cod. {item.codigo}    Qtd. {item.quantidade}
                            </Text>
                            <Text style={{   fontWeight: 'bold', width: '80%' }} numberOfLines={2}>
                                {item.descricao}
                            </Text>
                      </View>

                      <View style={{ marginTop: 3 }}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'white', borderRadius: 25, elevation: 4, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}> { } </Text>
                            </View>
                            <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={() => handleIncrement(item)} style={styles.button}>
                                <Text style={styles.buttonText}> + </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDecrement(item)} style={styles.button}>
                                <Text style={styles.buttonText}> - </Text>
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
            </Modal>
          

        </View>
    );

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
                        await  useQuerypedidos.createOrder(orcamento);
                        setStatus(200)
                    setResponse('Orçamento registrado com sucesso!')

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
               

              <View style={{ flexDirection: 'row' }}>
                    <ListaClientes orcamentoEditavel={orcamentoEditavel} />
                </View>
   
      
                <View style={{ justifyContent: 'center', backgroundColor: '#FFF', padding: 7 }}>
                    <View style={{ borderWidth: 0.4 }}></View>
                    <Text style={{ fontWeight: 'bold' }}> {orcamento.cliente?.nome}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}> cnpj: {orcamento?.cliente?.cnpj}</Text>
                        <Text style={{ fontWeight: 'bold' }}>contato: {orcamento?.cliente?.celular}</Text>
                    </View>
                </View>
                  
  
                <View style={{ flexDirection: 'row' }}>
                       <ListaProdutos orcamentoEditavel={orcamentoEditavel?.produtos} />
                 </View>

                 <Cart/>

                 <View style={{ borderWidth: 0.4, margin: 5 }}></View>

                 {orcamento.produtos && Array.isArray(orcamento.produtos) && orcamento.produtos.length > 0 && (
                
                    <FlatList
                        data={orcamento.produtos}
                        horizontal={true}
                        renderItem={({ item }) => <ItemsDoPedido2 item={item} />}
                        keyExtractor={ (item)=> item.codigo.toString()}
                    />
                
                )}

                <View style={{ marginTop: '5%' }}>
                    <View style={{ borderWidth: 0.4, margin: 5 }}></View>
                    <View style={{ margin: 5 }}>
                        <Parcelas orcamentoEditavel={orcamentoEditavel} />
                    </View>
                    <View style={{ borderWidth: 0.2, margin: 5 }}></View>
                </View>

             {/**   <View style={{ margin: 3 }}>
                    <ListaItemOrcamento /> 
                </View>*/} 
   
            
 
                 
                

                <View style={{ borderWidth: 0.2, margin: 5 }}></View>

                <View style={{ margin: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}> observções</Text>
                    <TextInput
                        style={{ margin: 5, borderWidth: 2, borderRadius: 7, borderColor: '#009de2', textAlign: "center" }}
                        numberOfLines={5}
                        placeholder="observações"
                        onChangeText={(v: string) => setObservacoes(v)}
                    />
                </View>
            </ScrollView>

                       <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderColor: '#ccc', borderWidth: 1, borderRadius: 5, elevation: 5, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Total: R$ {totalGeral?.toFixed(2)}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Descontos: R$ {descontosGeral?.toFixed(2)}</Text>

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