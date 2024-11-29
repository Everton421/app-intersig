import { useCallback, useContext, useEffect, useState } from "react"
import { Text, View, FlatList, Modal, TextInput, StyleSheet, Alert, Button, TouchableOpacity} from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { OrcamentoContext } from "../../../contexts/orcamentoContext";
import { ConnectedContext } from "../../../contexts/conectedContext";
import { usePedidos } from "../../../database/queryPedido/queryPedido";
import { AuthContext } from "../../../contexts/auth";
import { configMoment } from "../../../services/moment";
 
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export const OrcamentosRegistrados = ({navigation, tipo, to }:any)=>{

    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);

    const { connected ,setConnected } = useContext ( ConnectedContext )
    const { usuario } = useContext(AuthContext);

    const useQuerypedidos = usePedidos();
    const useMoment = configMoment();

        const [ orcamentosRegistrados, setOrcamentosRegistrados] = useState([]);
        const [ visible, setVisible ] = useState<boolean>(false);
        const [ visibleModal, setVisibleModal ] = useState<boolean>(false);
        const [ selecionado, setSelecionado ] = useState();
        const [ dados , setDados ] = useState();
        const [ pesquisa, setPesquisa ] =  useState('*');
        const [showPicker, setShowPicker] = useState(false);

        const [showPesquisa, setShowPesquisa] = useState(false);

        const [date , setDate ] = useState( new Date() );
        const [data_cadastro , setData_cadastro] = useState( useMoment.dataAtual())
        const [ orcamentoModal,setOrcamentoModal] = useState();

       
        async function busca(){
                if ( !usuario.codigo || usuario.codigo === 0 ){
                    console.log("usuario invalido!")
                    return
                }
                //let aux:any = await useQuerypedidos.findByTipeAndDate(tipo , usuario.codigo, data_cadastro );
                let aux:any = await useQuerypedidos.findByTipe(tipo , usuario.codigo  );

                if(  aux?.length > 0 ){
                    console.log(aux)
                    setOrcamentosRegistrados(aux);
                }  
            }

        async function busca2(){
            if ( !usuario.codigo || usuario.codigo === 0 ){
                console.log("usuario invalido!")
                return
            }
            let aux:any = await useQuerypedidos.findByTipeAndClient(tipo , usuario.codigo, pesquisa );
            if(  aux?.length > 0 ){
                setOrcamentosRegistrados(aux);
            }  
        }


    /////////////////////////////////////////////////
    //    useEffect(()=>{
    //     busca()
    //    },[ tipo  ])
    ///////////////////////////////////////////////////

     useFocusEffect(
             useCallback(() => {
                 busca()
             },[ ]
             )
         )
    /////////////////////////////////////////////////
        useEffect(()=>{
            busca()
           },[ data_cadastro, navigation])
    /////////////////////////////////////////////////
        useEffect(()=>{
             console.log(pesquisa)
            busca2()
        },[ pesquisa, navigation ]
    )
    /////////////////////////////////////////////////
    useEffect(()=>{
        async function busca(){
            if( selecionado !== undefined ){
                let aux = await useQuerypedidos.selectCompleteOrderByCode(selecionado?.codigo);
                setOrcamento(aux );
            }else { return }  

        }
    busca()
    },[selecionado])
    /////////////////////////////////////////////////
    
    
    const ProdOrcamento = ( {item}:any )=>{
        return(
            <View style={{backgroundColor:'#3335' , borderRadius:5 , margin: 3 }}>
                    <Text style={{ fontWeight:"bold"}}>
                        codigo: {item.codigo}
                    </Text>
                    <Text>
                        { item.descricao}
                    </Text>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                        <Text style={{ fontWeight:"bold",width:'30%',fontSize:12}}>
                                Quantidade: {item.quantidade}
                            </Text>
                        <Text style={{ fontWeight:"bold",width:'40%',fontSize:12}}>
                                unitario: {item.preco.toFixed(2)}
                            </Text>
                            <Text style={{ fontWeight:"bold",width:'20%',fontSize:12}}>

                                total: {item.total.toFixed(2)}
                            </Text>
                        </View>  

            </View>
        )
    }

    const ServiceOrcamento = ( { item }:any )=>{
        return(
            <View style={{backgroundColor:'#3335' , borderRadius:5 , margin: 3 }}>
                    <Text style={{ fontWeight:"bold"}}>
                        codigo: {item.codigo}
                    </Text>
                    <Text>
                        { item.aplicacao}
                    </Text>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                    

                        <Text style={{ fontWeight:"bold"}}>
                                Quantidade: {item.quantidade}
                            </Text>
                            
                            <Text style={{ fontWeight:"bold"}}>
                                unitario: {item?.valor.toFixed(2)}
                            </Text>
                            <Text style={{ fontWeight:"bold"}}>

                                total: {item?.total.toFixed(2)}
                            </Text>
                        </View>  

            </View>
        )
    }
 
    async function deleteOrder (item:any){
        Alert.alert('', `Deseja excluir o orcamento : ${item.codigo} ?`,[
            { text:'Não',
                onPress: ()=> console.log('nao excluido o item'),
                style:'cancel',
            },
            {
                text: 'Sim', onPress: async ()=>{ 
                          await useQuerypedidos.deleteOrder(item.codigo)
                          setOrcamentosRegistrados(
                            orcamentosRegistrados.filter( (i:any) => i.codigo !== item.codigo)
                        )
                          ;
                }
            }
        ] )
        
         

    }

    async function selecionaOrcamentoModal( item ){
        let aux = await useQuerypedidos.selectCompleteOrderByCode(item.codigo);
        setOrcamentoModal( aux );

        setVisibleModal( true )
        console.log(aux)
    }

    function selecionaOrcamento(item){

          setSelecionado(item);
         setVisible(true);
         navigation.navigate('editarOrcamento',{
            codigo_orcamento: item.codigo
         });
    }

    function stiloItem(item:any){
            if(!item.situacao){
                return;
            }
        let cor;
        switch (item?.situacao){
            case  'EA' :
                cor =  { backgroundColor:'#1E9C43'  };
            break;
            case 'AI':
                cor  = { backgroundColor:'#009de2' };  
             break;
            
            case 'FI':
                cor  = { backgroundColor:'#FF7F27'    };  
             break;
             case 'RE':
                cor  = { backgroundColor:'#9C0404'  };  
              break;
              case 'FP':
                cor  = { backgroundColor:'#0023F5'  };  
              break;
              
            
            }
            return cor;
    }

    const ItemOrcamento = ({item})=>{
        return(
                <View style={ [ stiloItem(item),{    margin:20 , borderRadius:15, elevation:9, padding:10 } ]}>
                        
                <TouchableOpacity style={{   backgroundColor: '#FFF', padding: 4, borderRadius: 5, width: '12%', elevation: 5, alignItems:"center" }} 
                    onPress={ ()=> selecionaOrcamentoModal(item)}>
                        <Feather name="eye" size={24} color="#009de2" />
                </TouchableOpacity>
  
            <Modal visible={false }>
            <TouchableOpacity onPress={() => {setVisible(false)  }}
                style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '20%', elevation: 5 }} >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                  voltar
                </Text>
              </TouchableOpacity>
            </Modal>

                        <View style={{ flexDirection:'row', justifyContent:'space-between', }}>
                           { /* <Text style={{fontWeight:"bold", color:'white'}}>
                                orçamento :{ item?.codigo}  
                            </Text>
                            */}
                            <Text style={{fontWeight:"bold", color:'white', margin:3 ,width:'90%' }}>
                                   Total R$: {item?.total_geral.toFixed(2)}
                            </Text>
                            
                { item?.situacao !== 'RE' && item.situacao !== 'FI' && item.situacao !== 'AI'  ? 
                            <TouchableOpacity 
                            onPress={()=>  deleteOrder(item)  }
                            >
                                <AntDesign name="closecircle" size={24} color="red" />
                            </TouchableOpacity>
                    : null
                    }
                        </View>

                        <Text style={{ margin:3 ,fontWeight:"bold", color:'white', fontSize:20 }}>
                            {item?.nome}
                        </Text>
                        
                        
                
                { item?.situacao !== 'RE' && item.situacao !== 'FI'    ? 
                      <TouchableOpacity onPress={( )=>{ selecionaOrcamento(item)}} style={{  borderRadius:5, elevation:5 ,backgroundColor:'white' ,width:35, padding:5}} >
                              <Feather name="edit" size={24} color="#009de2" />
                      </TouchableOpacity>
                      : null     
                  }
                      <Text style={{fontWeight:"bold", color:'white', marginTop:2}}>
                          Data Cadastro: {item?.data_cadastro} 
                      </Text>

                    {
                        item.enviado === 'S'?
                        <Ionicons name="checkmark-done" size={24} color="#73FBFD" />
                        :
                        <Ionicons name="checkmark" size={24} color="#75F94D" />
                    }
                    
                    </View>
        )
    }

    const handleEvent = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        const dia = String(currentDate.getDate()).padStart(2,'0');
        const mes = String( currentDate.getMonth()).padStart(2,'0');
        const ano = currentDate.getFullYear();
        const data = `${ano}-${mes}-${dia}`;

        setShowPicker(false);
        setData_cadastro(data)
    };
    
    
    return (
        <View style={{ flex:1, backgroundColor:'#FFF', width:'100%'}} >
            <View style={{  padding:15, backgroundColor:'#185FED', alignItems:"center", flexDirection:"row", justifyContent:"space-between" }}>
                <TouchableOpacity onPress={  ()=> navigation.goBack()  } style={{ margin:5 }}>
                    <Ionicons name="arrow-back" size={25} color="#FFF" />
                </TouchableOpacity>
            
                  
                <View style={{ flexDirection:"row", marginLeft:10 , gap:2, width:'100%', alignItems:"center"}}>
                    < TextInput 
                        style={{  width:'70%', fontWeight:"bold" ,padding:5, margin:5, textAlign:'center', borderRadius:5, elevation:5, backgroundColor:'#FFF'}}
                        onChangeText={(value)=>setPesquisa(value)}
                        placeholder="pesquisar"
  
                    /> 
                   {/** 
                    <TouchableOpacity onPress={ ()=> setShowPesquisa(false) }   >
                        <AntDesign name="closecircle" size={24} color="red" />
                    </TouchableOpacity>
               */ }

                    <TouchableOpacity  onPress={()=> setShowPesquisa(true)}>
                            <AntDesign name="filter" size={35} color="#FFF" />
                        </TouchableOpacity>
                    </View>
            </View>
       
      
        
        <Modal transparent={true}  visible={ visibleModal }>
            <View style={{ flex:1, backgroundColor:'rgba( 50 , 50, 50 , 0.5)', alignItems:'center', justifyContent:"center" }}>
                  <View style={{ backgroundColor:'#FFF', width:'97%', height:'97%', borderRadius:10}}>
                     <View style={{ padding:5 , justifyContent:"space-between", flexDirection:"row"  }} >
                        <Text>  
                            { orcamento?.tipo === 1 ? ( <Text style={{ fontSize:15, fontWeight:"bold"}}> Orçamento: {orcamentoModal?.codigo} </Text> ) : 
                            orcamento?.tipo === 3 ? ( <Text style={{ fontSize:15, fontWeight:"bold"}}>  OS: {orcamentoModal?.codigo} </Text> ) : null
                            }
                        </Text>
                      </View>
                  <View style={{ padding:5 }}>   
                         <Text style={{ fontSize:15, fontWeight:"bold"}}>
                               Data Cadastro: {orcamento.data_cadastro}
                         </Text>      
                        <Text style={{  fontWeight:"bold"}} >
                            cliente: {orcamentoModal?.cliente.codigo}
                        </Text>
                        <Text style={{ fontWeight:"bold"}}>
                            {orcamentoModal?.cliente.nome}
                        </Text>
                 </View>

                 <View style={{   padding:3}}>   
                            <View style={{ flexDirection:"row" , justifyContent:'space-between'}}>
                                    <Text style={{ fontWeight:"bold", width:'50%'}}>
                                        Total: { orcamentoModal?.total_geral ? orcamentoModal.total_geral.toFixed(2) : 0  }
                                    </Text>
                                    
                                    <Text style={{ fontWeight:"bold", width:'50%'}}>
                                        Descontos: {orcamentoModal?.descontos ? orcamentoModal.descontos.toFixed(2) : 0}
                                    </Text>
                            </View>

                            <View style={{ flexDirection:"row" , justifyContent:'space-between' }}>
                                <Text style={{ fontWeight:"bold",width:'50%'}}>
                                    Total Servicos: {  orcamentoModal?.total_servicos ?  orcamentoModal?.total_servicos.toFixed(2) : 0  }
                                </Text>
                                <Text style={{ fontWeight:"bold",width:'50%'}}>
                                    Total Produtos: {  orcamentoModal?.total_produtos ? orcamentoModal?.total_produtos.toFixed(2) : 0  }
                                </Text>
                            
                            </View>
                 </View>  

                  {/** *** separador ***/} 
               <View style={{ borderWidth: 0.5, margin: 5 }}></View> 
                                    <View style={{ alignItems:"center"}}>
                                            <Text>
                                                PRODUTOS
                                            </Text>
                                    </View>

                                    <FlatList
                                        data={orcamentoModal?.produtos}
                                        renderItem={ ({item})=> <ProdOrcamento item={item} /> }
                                        />
                            {/** *** separador ***/} 
                  <View style={{ borderWidth: 0.5, margin: 5 }}></View> 
                            <View style={{ alignItems:"center"}}>
                                            <Text>
                                                SERVIÇOS
                                            </Text>
                                    </View>

                                    <FlatList
                                        data={orcamentoModal?.servicos}
                                        renderItem={ ({item})=> <ServiceOrcamento item={item} /> }
                                        />

                             <Button
                                title="voltar"
                                onPress={() => {setVisibleModal(false)  }}
                            />
                </View>

            </View>
        </Modal>
        {/** <Button title="press" onPress={()=> setVisibleModal(true)}/>
        */}

            {/** componente de alterar a data */ }
 { /**         <TouchableOpacity onPress={  ()=> setShowPicker(true)  } style={{ margin:5 }}>
                                    <Fontisto name="date" size={35} color="#009de2" />
             </TouchableOpacity>
                            {showPicker && (
                                            <DateTimePicker
                                            value={ date  }
                                            display="calendar"
                                            mode="date"
                                            onChange={handleEvent}
                                            accessibilityLanguage='pt-br'
                                            />
                                        )}
*/}
 
        {/******************************************* */}
                        <FlatList
                        data={orcamentosRegistrados}
                        renderItem={({item})=> <ItemOrcamento item={item}/>}
                        contentContainerStyle={{ paddingBottom: 100 }} 
                        />

                   {/*********    botao Novo Pedido  */}
                            <TouchableOpacity onPress={()=> navigation.navigate(to)} 
                                style={{
                                         backgroundColor:'#185FED' ,  width:50, height:50,   
                                    borderRadius:25,  position:"absolute" , elevation:10  ,left: '80%',bottom: '15%', alignItems:"center", justifyContent:"center" }}>
                                  <MaterialIcons name="add-circle" size={45} color="#FFF" />
                             </TouchableOpacity>

                   {/*********    lista de status dos pedidos  */}
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF',   padding: 10 ,  }}>
                        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', margin:3  }}>
                            <View style={{  alignItems:"center"}}>
                                    <View style={{padding:4,    backgroundColor:'#1E9C43' , borderRadius:4}}></View>
                                    <Text style={{ fontWeight:'bold',fontSize:10, marginLeft:2, color:'#1E9C43'}}>
                                        orcamento
                                    </Text>
                            </View>

                            <View style={{  alignItems:"center"}}>
                                <View style={{ padding:4,     backgroundColor:'#307CEB' , borderRadius:4}}>
                                </View>
                                <Text style={{ fontWeight:'bold' ,fontSize:10, marginLeft:2, color:'#307CEB'}}>
                                    pedido
                                </Text>
                            </View>

                            <View style={{  alignItems:"center"}}>
                                <View style={{ padding:4,     backgroundColor:'#F57A25' , borderRadius:4}}>
                                </View>
                                <Text style={{fontWeight:'bold' ,fontSize:10, marginLeft:2, color:'#FF7F27'}}>
                                    faturado
                                </Text>
                            </View>

                            <View style={{   alignItems:"center"}}>
                                <View style={{ padding:4,     backgroundColor:'#9C0404' , borderRadius:4}}>
                                </View>
                                <Text style={{fontWeight:'bold' , fontSize:10, marginLeft:2, color:'#9C0404'}}>
                                    reprovado
                                </Text>
                            </View>
                            <View style={{   alignItems:"center"}}>
                                <View style={{ padding:4,     backgroundColor:'#0023F5' , borderRadius:4}}>
                                </View>
                                <Text style={{fontWeight:'bold' ,  fontSize:10, marginLeft:2, color:'#0023F5'}}>
                                    parcial
                                </Text>
                            </View>
                        </View>
 
                   </View>
        </View >
    )

}

const  styles = StyleSheet.create({
    containerItemOrcamento:{
        
    }

})