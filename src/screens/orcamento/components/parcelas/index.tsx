import { useContext, useEffect, useState } from "react";
import { Modal, Text, View, TouchableOpacity, FlatList } from "react-native";
import { ProdutosContext } from "../../../../contexts/produtosDoOrcamento";  
import { api } from "../../../../services/api";
import { ScrollView } from "react-native-gesture-handler";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { format, addDays, setDate } from 'date-fns';
import { OrcamentoContext } from "../../../../contexts/orcamentoContext";
import { ConnectedContext } from "../../../../contexts/conectedContext";
import { useFormasDePagamentos } from "../../../../database/queryFormasPagamento/queryFormasPagamento";

export const Parcelas = ({orcamentoEditavel}) => {

    const [visible, setVisible] = useState(false);
    const [total, setTotal] = useState<number>(0);
    const [formas, setFormas] = useState([]);
    const [press, setPress] = useState<boolean>(false);
    const [parcelasGeradas, setParcelasGeradas] = useState<any[]>([]);
    const [selectedForma, setSelectedForma] = useState<any>(null);
    const [editavel , setEditavel ] = useState<boolean>(false);


    const { produtos } = useContext(ProdutosContext);

    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);
    const { connected } = useContext(ConnectedContext);
    const useQueryFpgt = useFormasDePagamentos();
    /***************** ******* ***************** ******* ***************** ******* * ******/

    useEffect(() => {
        if(!orcamentoEditavel ||  orcamentoEditavel === null){
            setEditavel(false)
          return;
        }else{
          setEditavel(true)
        }
      }, [])


    useEffect(() => {
       
        async function busca() {
            if( connected){
                 try {
                     const response = await api.get('/formas_pagamento');
                     setFormas(response.data);
                 } catch (err) {
                     console.log(err);
                 }
             }else{
                 let aux = await useQueryFpgt.selectAll();
                 setFormas(aux);
            }
         
        }
        busca();
    }, [ press ]);


    useEffect(() => {
        if (selectedForma && selectedForma.parcelas > 0) {
            //console.log(selectedForma);
            function calculaValores() {
                let aux = [];
                let valorParcelas = total / selectedForma.parcelas;
                
                let intervalo;
                let codigoPagamento = selectedForma.codigo;
                if( selectedForma.intervalo ){
                    intervalo =  selectedForma.intervalo;
                }else{
                    intervalo = 0;
                }

                for (let i = 1; i <= selectedForma.parcelas; i++) {
                    const vencimento = addDays(new Date(), intervalo * i);
                    aux.push({ parcela: i ,valor: valorParcelas, vencimento: format(vencimento, 'dd/MM/yyyy') });
                }

                let qtdeParcelas = aux.length;
                setParcelasGeradas(aux);

                let totais = 0;
                if(orcamento.produtos ){
                    orcamento?.produtos.forEach((element:any) => {
                        totais += element.total;
                    });
                }
                
                setTotal(totais);

                setOrcamento((prevOrcamento: OrcamentoModel) => ({
                    ...prevOrcamento,
                    forma_pagamento:codigoPagamento,
                    parcelas: aux,
                    quantidade_parcelas: qtdeParcelas
                  }));


            }
            
            calculaValores();
       
        }else{
            function calculaParcelaUnica(){
                if( editavel){
                    return
                }else{
                let totais = 0;
                if(orcamento.produtos && !selectedForma){
                    orcamento?.produtos.forEach((element:any) => {
                        totais += element.total;
                    });
                }

                const vencimento =   new Date();
                let parcela = [ { parcela: 1 ,valor: totais, vencimento: format(vencimento, 'dd/MM/yyyy') }];
                setOrcamento((prevOrcamento: OrcamentoModel) => ({
                    ...prevOrcamento,
                    forma_pagamento:0,
                    parcelas: parcela,
                    quantidade_parcelas: 1
                  }));
            }
        }
            calculaParcelaUnica();
        }
    }, [selectedForma,  total , orcamento.produtos]);


 


    function selectForma(item) {
        setSelectedForma(item);
        setPress(false);
       // console.log(item)
    }

    const ItemFormas = ({ item }) => {
        return (
            <View style={{margin:3, elevation:5, backgroundColor:'#FFF',padding:5, borderRadius:7}}>
                <TouchableOpacity onPress={() => selectForma(item)}>
                    <Text>
                        {item.codigo} {item.descricao}
                    </Text>
                    <Text>{item.parcelas} parcelas</Text>
                </TouchableOpacity>
            </View>
        );
    };


    const ItemParcelas = ({ item }) => {
        return (
            <View style={{margin:5, elevation:5, backgroundColor:'#009de2',padding:5, borderRadius:7}}>
                <TouchableOpacity style={{margin:3}}>
                    <Text style={{color:'#fff', fontWeight:"bold"}} >Parcela {item.parcela}:  R$ {item.valor.toFixed(2)}</Text>
                    <Text style={{color:'#fff', fontWeight:"bold"}} >  vencimento: {item.vencimento }</Text>
                </TouchableOpacity>
            </View>
        );
    };
    
    const ItemParcelas2 = ({ item }) => {
        return (
            <View style={{margin:5, elevation:7, backgroundColor:'#FFF',padding:5, borderRadius:50}}>
                <TouchableOpacity style={{margin:3}}  
                 onPress={()=> console.log(orcamento.parcelas)

                }>
                    <Text style={{  fontWeight:"bold"}} >  R$ {item.valor.toFixed(2)}</Text>
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <View>
            <TouchableOpacity onPress={() => setVisible(true)  }style={{margin:5}}  >
                 
                   <View style={{flexDirection:'row', backgroundColor:'#009de2', justifyContent:'space-between', padding:10, borderRadius:5, elevation:5}}>
                     
                     <Text style={{color:'white', fontWeight:"bold",fontSize:15}}>  <AntDesign name="creditcard" size={20} color="white" /> ajustar parcelas</Text>
                     <AntDesign name="caretdown" size={23} color="white" />
                    </View> 

            </TouchableOpacity>
                  <View style={{marginHorizontal:5}}>
                    <Text style={{fontWeight:"bold"}}> { orcamento.parcelas && orcamento.parcelas.length} parcelas </Text>
                 </View>
                <View>
               
                       <FlatList
                            data={orcamento.parcelas}
                            renderItem={({ item }) =>  <ItemParcelas2 item={item} />}
                            keyExtractor={(item) => item?.parcela.toString()}
                            horizontal={true}
                                            />
                </View>

            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
            >
                <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                    <View
                        style={{
                            margin: 20,
                            backgroundColor: 'white',
                            borderRadius: 20,
                            width: '90%',
                            height: '90%',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                    >
                        <TouchableOpacity onPress={() => setVisible(false)}
                            style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '25%', elevation: 5 }}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                                Voltar
                            </Text>
                        </TouchableOpacity>

                        <View>

                            <View style={{margin:3}} >
                                <Text style={{fontWeight:'bold'}}>
                                    Total orçamento R$ {total?.toFixed(2)}
                                </Text>
                            </View>

                            <TouchableOpacity onPress={() => setPress(true)} style={{borderRadius:5,backgroundColor: '#009de2',padding:8,elevation:5, borderWidth:1,borderColor:'#fff' }}>
                               <View style={{flexDirection:'row'}}>
                               <Text style={{color:'#FFF', fontWeight:'bold', fontSize:15}}> Formas De Pagamento  </Text>
                               <FontAwesome name="search" size={22} color="#FFF" />
                               </View>
                               
                               
                                  <Text style={{color:'#FFF', fontWeight:'bold'}} > {selectedForma?.descricao} </Text>
                            </TouchableOpacity>

                            {/**  <TouchableOpacity onPress={() => console.log(parcelas)} style={{ backgroundColor: 'red' }}>
                                <Text>Ver parcelas</Text>
                            </TouchableOpacity> */}

                            <View style={{ height: '70%'  }}>
                                {press &&
                                    <View style={{marginHorizontal:15}}>
                                    <FlatList
                                        data={formas}
                                        renderItem={({ item }) => <ItemFormas item={item} />}
                                        keyExtractor={(i: any) => i.codigo}
                                    />
                                    </View>

                                }

                                    <View>
                                        {parcelasGeradas.length > 0 && (
                                            <FlatList
                                                data={parcelasGeradas}
                                                renderItem={({ item }) => <ItemParcelas item={ item }/>}
                                                keyExtractor={(item) => item.parcela.toString()}
                                            />
                                        )}
                                    </View>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};
