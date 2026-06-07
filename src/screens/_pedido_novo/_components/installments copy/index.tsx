import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { orderPaymentMethod, parcela, payloadEditDueInstallment } from "../../types/order";
import { TextInput } from "react-native-gesture-handler";
import { useFormasDePagamentos } from "../../../../database/queryFormasPagamento/queryFormasPagamento";
import { parseDateSafe } from "../../../../services/formatStrings";

type props ={
    handleAddPaymentMethod:(payload: orderPaymentMethod) => void,
    parcelas: parcela[],
     paymentMothod:orderPaymentMethod,
    handleEditDueInstallment: (payload: payloadEditDueInstallment) => void
}

type databasePaymentMethod = {
        codigo:number
        descricao:string  
        desc_maximo :number
        parcelas    :number
        intervalo   :number
         data_cadastro  :string
        data_recadastro  :string
        recebimento:number
} 
   
export const Installments = ( { parcelas, paymentMothod, handleAddPaymentMethod, handleEditDueInstallment }:props) => {

    const [visible, setVisible] = useState(false);
    const [ databasePaymentMethods, setDatabasePaymentMethods] = useState<databasePaymentMethod[]>([]);

    const [press, setPress] = useState<boolean>(false);
    const [selectedForma, setSelectedForma] = useState<any>(null);

    const [date] = useState(new Date());

        const useQueryFpgt  = useFormasDePagamentos();

           async function registerfpgt( ){
           
            const  ficData  =  [  
                {
                        codigo:1,
                        data_cadastro:'2026-01-01',
                        data_recadastro:'2026-01-01',
                        desc_maximo:0,
                        descricao:'A VISTA',
                        intervalo:0,
                        parcelas:1,
                        recebimento:0
                    },
                    {
                        codigo:2,
                        data_cadastro:'2026-01-01',
                        data_recadastro:'2026-01-01',
                        desc_maximo:0,
                        descricao:'30/60',
                        intervalo:60,
                        parcelas:2,
                        recebimento:0
                    }
            ] 
            for( const data of ficData){

            const resultInsert =  await useQueryFpgt.create(data)
                    console.log(resultInsert);
                }
                }

        useEffect(()=>{
      //          registerfpgt()
        },[])



    useEffect(() => {
        async function busca() {
                 let aux = await useQueryFpgt.selectAll() as databasePaymentMethod[];
                 setDatabasePaymentMethods(aux);
        }
        busca();
    }, [ press ]);

 


    function selecionaFormaPagamento(item:databasePaymentMethod) {
          handleAddPaymentMethod({
                                        codigo:item.codigo,
                                        intervalo_parcelas:  item.intervalo,
                                        quantidade_parcelas: Number(item.parcelas)
                                    })
        setPress(false);

    }


    const ItemFormas = ({ item }:{ item: databasePaymentMethod}) => {
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


    const ItemParcelas = ({ item }:{ item: parcela}) => {
        const [itemPickerVisible, setItemPickerVisible] = useState(false);

        const handleEvent = (event:any, selectedDate:any) => {
            const currentDate = selectedDate || date;
            const dia = String(currentDate.getDate()).padStart(2,'0');
            const mes = String( currentDate.getMonth() + 1).padStart(2,'0');
            const ano = currentDate.getFullYear();
            const vencimento = `${ano}-${mes}-${dia}`;

            handleEditDueInstallment({ 
                parcela:item.parcela,
                vencimento: vencimento
            })
            setItemPickerVisible(false);
        };

        const [ano, mes, dia] = item.vencimento.split('-');

        return (
            <View style={{margin:5, backgroundColor:'#FFF', padding:12, borderRadius:10, elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:2}}>
                <TouchableOpacity onPress={() => setItemPickerVisible(true)}>
                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Text style={{fontWeight:'bold', color:'#333', fontSize:14}}>
                            Parcela {item.parcela}
                        </Text>
                        <Text style={{fontWeight:'bold', color:'#185FED', fontSize:16}}>
                            R$ {item.valor.toFixed(2)}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop:4}}>
                        <Text style={{fontWeight:'bold', color:'#6C757D', fontSize:13}}>
                            Vencimento: {dia}/{mes}/{ano}
                        </Text>
                        <Fontisto name="date" size={14} color="#6C757D" style={{marginLeft:6}} />
                    </View>
                </TouchableOpacity>
                {itemPickerVisible && (
                    <DateTimePicker
                    value={ parseDateSafe(item.vencimento)  }
                    display="calendar"
                    mode="date"
                    onChange={handleEvent}
                    accessibilityLanguage='português'
                    />
                )}
            </View>
        );
    };
    


    return (
        <View>
            <TouchableOpacity onPress={() => setVisible(true)  }style={{margin:5}}  >
                 
                   <View style={{flexDirection:'row', backgroundColor:'#185FED', justifyContent:'space-between', padding:10, borderRadius:7, elevation:5}}>
                     
                         <AntDesign name="credit-card" size={25} color="white" />
                     <Text style={{color:'white', fontWeight:"bold",fontSize:20, width:90  }}> 
                            Parcelas</Text>
                     <AntDesign name="caret-down" size={22} color="white" />
                    </View> 

            </TouchableOpacity>
                  <View style={{marginHorizontal:5}}>
                                <Text style={{  fontWeight:"bold" ,color: '#6C757D',fontSize:18  }} > {  parcelas.length} Parcelas </Text>
                 </View>

            <Modal visible={visible} animationType="slide" transparent={true}>
              <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", height: "90%", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 5 }}>
                  <View style={{ backgroundColor: '#185FED', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Parcelas</Text>
                    <TouchableOpacity onPress={() => setVisible(false)} style={{ padding: 4 }}>
                      <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </View>

                     <View style={{ margin:5 ,flexDirection:"row" ,  alignItems:"center", justifyContent:"space-between" }} >
                                <TouchableOpacity onPress={() => setPress(true)} style={{ borderRadius:5, backgroundColor: '#185FED', padding: 5, elevation:5    }}>
                                    <View style={{flexDirection:'row'}}>
                                          <Text style={{color:'#FFF', fontWeight:'bold', fontSize:15}}> Formas De Pagamento  </Text>
                                         <FontAwesome name="search" size={22} color="#FFF" />
                                    </View>
                                    <Text style={{color:'#FFF', fontWeight:'bold'}} numberOfLines={1} > {selectedForma?.descricao} </Text>
                                </TouchableOpacity>
                               </View>


                          <View style={{paddingHorizontal:12, paddingTop:8, flex:1}}>
                            <Text style={{color:'#6C757D', fontWeight:'bold', fontSize:13, marginBottom:4}}>
                                Quantidade Parcelas
                            </Text>
                            <TextInput
                             defaultValue={String(paymentMothod.quantidade_parcelas) || "1"}
                              style={{
                                color:'#333', borderColor:'#E0E0E0', borderWidth:1,
                                borderRadius:8, paddingHorizontal:12, height:45, backgroundColor:'#FFF'
                              }}
                                 onChangeText={(value)=>{ 
                                       handleAddPaymentMethod({
                                        codigo:paymentMothod.codigo,
                                        intervalo_parcelas:  paymentMothod.intervalo_parcelas,
                                        quantidade_parcelas: Number(value)
                                    })
                                 }}
                                keyboardType="number-pad"
                            />

                            <Text style={{color:'#6C757D', fontWeight:'bold', fontSize:13, marginBottom:4, marginTop:12}}>
                                Intervalo Parcelas (dias)
                            </Text>
                            <TextInput
                             defaultValue={String(paymentMothod.intervalo_parcelas) || "1"}
                              style={{
                                color:'#333', borderColor:'#E0E0E0', borderWidth:1,
                                borderRadius:8, paddingHorizontal:12, height:45, backgroundColor:'#FFF'
                              }}
                               onChangeText={(value)=>
                                    handleAddPaymentMethod({
                                        codigo:paymentMothod.codigo,
                                        intervalo_parcelas: Number(value),
                                        quantidade_parcelas:paymentMothod.quantidade_parcelas
                                    })
                               } 
                               keyboardType="number-pad"
                            />

                             
                          
                            <View style={{height:1, backgroundColor:'#E0E0E0', marginVertical:8, marginHorizontal:12}} />

                            <View style={{ flex: 1 }}>
                                 
                                    <Modal visible={press} transparent={true}>
                                      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }}>
                                        <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", height: "90%", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 5 }}>
                                          <View style={{ backgroundColor: '#185FED', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Formas de Pagamento</Text>
                                            <TouchableOpacity onPress={() => setPress(false)} style={{ padding: 4 }}>
                                              <Ionicons name="close" size={24} color="#FFF" />
                                            </TouchableOpacity>
                                          </View>
                                          <FlatList
                                            data={databasePaymentMethods}
                                            renderItem={({ item }) => <ItemFormas item={item} />}
                                            keyExtractor={(i: any) => i.codigo}
                                            contentContainerStyle={{ padding: 12 }}
                                          />
                                        </View>
                                      </View>
                                    </Modal>
     
                                    <View style={{flex:1}}>
                                        <FlatList
                                            data={parcelas}
                                            renderItem={({ item }) => <ItemParcelas item={ item }/>}
                                            keyExtractor={(item) => item.parcela.toString()}
                                            contentContainerStyle={{paddingBottom:16}}
                                        />
                                    </View>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};
