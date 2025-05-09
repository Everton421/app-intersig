import { useCallback, useContext, useEffect, useState } from "react"
import { Text, View, FlatList, Modal, TextInput, StyleSheet, Alert, Button, TouchableOpacity} from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from "@expo/vector-icons";
import { OrcamentoContext } from "../../../contexts/orcamentoContext";
import { ConnectedContext } from "../../../contexts/conectedContext";
import { usePedidos } from "../../../database/queryPedido/queryPedido";
import { AuthContext } from "../../../contexts/auth";
import { configMoment } from "../../../services/moment";
 
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ModalOrcamento } from "./modalOrcamento";
import { enviaPedidos } from "../../../services/sendOrders";


export const OrcamentosRegistrados = ({navigation, tipo, to }:any)=>{

    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);

    const { connected ,setConnected } = useContext ( ConnectedContext )
    const { usuario } = useContext(AuthContext);

    const useQuerypedidos = usePedidos();
    const useMoment = configMoment();
    const useEnvioPedidos = enviaPedidos();

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
        },[ pesquisa, navigation ]  )
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
    
    // função responsavel por enviar o pedido
    async function sincPedido(item:any){
      await  useEnvioPedidos.postPedido(item.codigo)
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
            codigo_orcamento: item.codigo,
            tipo: item.tipo
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

                  <View style={{ flexDirection:"row", justifyContent:"space-between"}}>
                      
                      
                        {
                            item.enviado === 'S'?
                            <Ionicons name="checkmark-done" size={24} color="#73FBFD" />
                            :
                            <Ionicons name="checkmark" size={24} color="#75F94D" />
                        }

                     {/*   <TouchableOpacity 
                            onPress={ ()=> sincPedido(item)}
                           style={{  borderRadius:5, elevation:5,alignItems:"center", justifyContent:"center",backgroundColor:'white' ,width:35, padding:5}} >
                          <FontAwesome5 name="sync-alt" size={20} color="#009de2" />
                        </TouchableOpacity>
                      */}
                      </View>
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
        <View style={{ flex:1, backgroundColor:'#EAF4FE', width:'100%'}} >
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
          

                    <TouchableOpacity  onPress={()=> setShowPesquisa(true)}>
                            <AntDesign name="filter" size={35} color="#FFF" />
                        </TouchableOpacity>
                    </View>
            </View>
     
                <ModalOrcamento visible={visibleModal} orcamento={ orcamentoModal} setVisible={setVisibleModal} />
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