import { useContext, useEffect, useState } from "react";
import { Modal, Text, View, TouchableOpacity, FlatList } from "react-native";
import { ProdutosContext } from "../../../../contexts/produtosDoOrcamento";  
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { format, addDays  } from 'date-fns';
import { OrcamentoContext } from "../../../../contexts/orcamentoContext";
import { ConnectedContext } from "../../../../contexts/conectedContext";
import { useFormasDePagamentos } from "../../../../database/queryFormasPagamento/queryFormasPagamento";
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useParcelas } from "../../../../database/queryParcelas/queryParcelas";
import { usePedidos } from "../../../../database/queryPedido/queryPedido";
import { Ionicons } from "@expo/vector-icons";

export const Parcelas = ( {orcamentoEditavel, codigo_orcamento} :any) => {

    const [visible, setVisible] = useState(false);
    const [total, setTotal] = useState<number>(0);
    const [formas, setFormas] = useState([]);
    const [press, setPress] = useState<boolean>(false);
    const [parcelasGeradas, setParcelasGeradas] = useState<any[]>([]);
    const [selectedForma, setSelectedForma] = useState<any>(null);
    const [editavel , setEditavel ] = useState<boolean>(false);

    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());


    const { produtos }:any = useContext(ProdutosContext);

    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);
    const { connected } = useContext(ConnectedContext);

    const useQueryFpgt = useFormasDePagamentos();
    const useQueryParcelas = useParcelas();
    const useQueryPedidos = usePedidos();

    /***************** ******* ***************** ******* ***************** ******* * ******/

    async function calculaParcelaUnica(){
        let totais = 0;
        if(orcamento.produtos && !selectedForma){
            orcamento?.produtos.forEach((element:any) => {
                totais += element.total;
            });
        }

        if(orcamento.servicos && !selectedForma){
            orcamento?.servicos.forEach((element:any) => {
                totais += element.total;
            });
        }
        const vencimento =   new Date();
        let parcela = [ { parcela: 1 ,valor: totais, vencimento: format(vencimento, 'yyyy-MM-dd') }];
        setParcelasGeradas(parcela)
        setOrcamento((prevOrcamento: OrcamentoModel) => ({
            ...prevOrcamento,
            forma_pagamento:0,
            parcelas: parcela,
            quantidade_parcelas: 1
          }));

    }

   function calculaValores() {
        let aux = [];
        let valorParcelas = orcamento.total_geral / selectedForma.parcelas;
        
        let intervalo;
        let codigoPagamento = selectedForma.codigo;
        if( selectedForma.intervalo ){
            intervalo =  selectedForma.intervalo;
        }else{
            intervalo = 0;
        }

        for (let i = 1; i <= selectedForma.parcelas; i++) {
            const vencimento = addDays(new Date(), intervalo * i);
            aux.push({ parcela: i ,valor: valorParcelas, vencimento: format(vencimento, 'yyyy-MM-dd') });
        }

        let qtdeParcelas = aux.length;
        setParcelasGeradas(aux);

        let totais = 0;
        if(orcamento.produtos ){
            orcamento?.produtos.forEach((element:any) => {
                totais += element.total;
            });
        }
        if(orcamento.servicos ){
            orcamento?.servicos.forEach((element:any) => {
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


    useEffect(() => {
        async function init(){
        if( codigo_orcamento &&  codigo_orcamento > 0 ){
 
                let responsePedido:any = await useQueryPedidos.selectByCode( codigo_orcamento );
                let aux:any;

                 if(responsePedido.length > 0 ){
                   aux = await useQueryFpgt.selectByCode(responsePedido[0].forma_pagamento);
                 }

                 if( aux.length > 0 ){
                    setSelectedForma( aux[0] )
                 }

            setEditavel(true)
        }else{
          setEditavel(false)
        // calculaParcelaUnica()
        }   
      }
      init()
      }, [])


    useEffect(() => {
       
        async function busca() {
                 let aux = await useQueryFpgt.selectAll();
                 setFormas(aux);
        }
        busca();
    }, [ press ]);


    useEffect(() => {
        if (selectedForma && selectedForma.parcelas > 0) {
            //console.log( selectedForma );
            calculaValores();
       
        }else{
            calculaParcelaUnica();
        }
    }, [   selectedForma, orcamento.produtos, orcamento.servicos ,  orcamento.total_geral] );


 


    function selecionaFormaPagamento(item) {
        setSelectedForma(item);
        setPress(false);
    }

    const ItemFormas = ({ item }) => {
        return (
            <View style={{margin:10, elevation:5, backgroundColor:'#185FED',padding:5, borderRadius:7}}>
                <TouchableOpacity onPress={() => selecionaFormaPagamento(item)}>
                    <Text style={{color:'white',fontWeight:"bold"}} >
                        {item.codigo} {item.descricao}
                    </Text>
                    <Text style={{color:'white',fontWeight:"bold"}} >{item.parcelas} parcelas</Text>
                </TouchableOpacity>
            </View>
        );
    };


    const ItemParcelas = ({ item }) => {
        const handleEvent = (event, selectedDate) => {
            const currentDate = selectedDate || date;
            const dia = String(currentDate.getDate()).padStart(2,'0');
            const mes = String( currentDate.getMonth()).padStart(2,'0');
            const ano = currentDate.getFullYear();
            const vencimento = `${ano}-${mes}-${dia}`;

          //  let parcelaSelecionada =  orcamento.parcelas.findIndex( i => i.parcela = item.parcela )
            
            orcamento.parcelas.forEach( (i)=>{
                if(item.parcela === i.parcela ){
                    item.vencimento = vencimento
                }
            })
              
            item.vencimento = vencimento
            setShowPicker(false);
        
        };

        return (
            <View style={{margin:5,  backgroundColor:'#ced1d8',padding:5, borderRadius:7}}>
                <TouchableOpacity style={{margin:3}} 
                //onPress={ ()=> setShowPicker(true)}
                
                >
                    <Text style={{  fontWeight:"bold"}} >Parcela {item.parcela}:  R$ {item.valor.toFixed(2)}</Text>
                    <Text style={{  fontWeight:"bold"}} >  vencimento: {item.vencimento }  <Fontisto name="date" size={20} color="black" /> </Text>
                    {showPicker && (
                        <DateTimePicker
                        value={ date  }
                        display="calendar"
                        mode="date"
                        onChange={handleEvent}
                        accessibilityLanguage='português'
                        />
                    )}
                
                </TouchableOpacity>
                <TouchableOpacity>
               
                </TouchableOpacity>
            </View>
        );
    };
    
    const ItemParcelas2 = ({ item }) => {
        return (
            <View style={{margin:5, elevation:3, backgroundColor:'#FFF',  borderRadius:5}}>
                <TouchableOpacity style={{margin:3  }}  
                 onPress={()=> console.log(orcamento.parcelas)

                }>
                    <Text style={{  fontWeight:"bold" ,color: '#6C757D',fontSize:15  }} >  R$ {item.valor.toFixed(2)}</Text>
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <View>
            <TouchableOpacity onPress={() => setVisible(true)  }style={{margin:5}}  >
                 
                   <View style={{flexDirection:'row', backgroundColor:'#185FED', justifyContent:'space-between', padding:10, borderRadius:7, elevation:5}}>
                     
                         <AntDesign name="creditcard" size={25} color="white" />
                     <Text style={{color:'white', fontWeight:"bold",fontSize:20, width:90  }}> 
                            parcelas</Text>
                     <AntDesign name="caretdown" size={22} color="white" />
                    </View> 

            </TouchableOpacity>
                  <View style={{marginHorizontal:5}}>
                                <Text style={{  fontWeight:"bold" ,color: '#6C757D',fontSize:18  }} > { orcamento.parcelas && orcamento.parcelas.length} Parcelas </Text>
                 </View>

                <View style={{   width:'100%'}}>
               
                       <FlatList
                            data={parcelasGeradas}
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
                <View style={ { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end',width: "100%", }}>
                    <View  style={{ margin: 0, backgroundColor: "#F0F4F8", borderTopEndRadius: 20, borderTopStartRadius: 20, width: "100%", height: "90%", shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5  }} >
                    <TouchableOpacity onPress={() => setVisible(false)}  style={ { width:'15%'  ,padding: 16, borderRadius: 12    }}>
                            <Ionicons name="close" size={28} color={ '#6C757D' } />
                    </TouchableOpacity>
                        <View>

                            

                             <View style={{ margin:5 ,flexDirection:"row" ,  alignItems:"center", justifyContent:"space-between"}} >
                                <TouchableOpacity onPress={() => setPress(true)} style={{ borderRadius:5, backgroundColor: '#185FED', padding: 5, elevation:5    }}>
                                    <View style={{flexDirection:'row'}}>
                                          <Text style={{color:'#FFF', fontWeight:'bold', fontSize:15}}> Formas De Pagamento  </Text>
                                         <FontAwesome name="search" size={22} color="#FFF" />
                                    </View>
                                    <Text style={{color:'#FFF', fontWeight:'bold'}} numberOfLines={1} > {selectedForma?.descricao} </Text>
                                </TouchableOpacity>
                                
                                {/** 
                                <TouchableOpacity style={{ elevation:5,  margin:2 ,  padding:5, backgroundColor:'#009de2' , borderRadius:7, alignItems:"center"}}  >
                                   <Feather name="edit" size={24} color="#FFF" />
                                   <Text style={{color:'#FFF', fontWeight:'bold'}} > Personalizada </Text>
                                </TouchableOpacity> 
                                */}
                              </View>

                            {/**  <TouchableOpacity onPress={() => console.log(parcelas)} style={{ backgroundColor: 'red' }}>
                                <Text>Ver parcelas</Text>
                            </TouchableOpacity> */}

                            <View style={{ height: '70%'  }}>
                                 
                                    <Modal visible={press} transparent={true}>
                                  <View style={ { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end',width: "100%", }}>
                                          <View  style={{ margin: 0, backgroundColor: "#F0F4F8", borderTopEndRadius: 20, borderTopStartRadius: 20, width: "100%", height: "90%", shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5  }} >   
                                        <TouchableOpacity onPress={() => {setPress(false)  }} style={ { width:'15%'  ,padding: 16, borderRadius: 12    }}>
                                                    <Ionicons name="close" size={28} color={ '#6C757D' } />
                                            </TouchableOpacity>
                                                    <View style={{alignItems:"center",padding:5}} >
                                                        <Text style={{fontWeight:"bold"}}> Formas De Pagamento </Text>
                                                     </View>

                                                    <FlatList
                                                        data={formas}
                                                        renderItem={({ item }) => <ItemFormas item={item} />}
                                                        keyExtractor={(i: any) => i.codigo}
                                                    />
                                              </View>
                                          </View>
                                        </Modal>
     
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
