import { useContext, useEffect, useState } from "react"
import { Text, View, FlatList, Modal, TextInput, StyleSheet, Alert, Button} from "react-native"
import { api } from "../../../services/api"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Feather from '@expo/vector-icons/Feather';
import { OrcamentoContext } from "../../../contexts/orcamentoContext";
import { ClienteContext } from "../../../contexts/clienteDoOrcamento";
import { blue, green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { ConnectedContext } from "../../../contexts/conectedContext";
import { usePedidos } from "../../../database/queryPedido/queryPedido";
import { AuthContext } from "../../../contexts/auth";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const OrcamentosRegistrados = ({navigation, tipo })=>{

    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);

    const { connected ,setConnected } = useContext ( ConnectedContext )
    const { usuario } = useContext(AuthContext);

    const useQuerypedidos = usePedidos();

        const [ orcamentosRegistrados, setOrcamentosRegistrados] = useState([]);
        const [ visible, setVisible ] = useState<boolean>(false);
        const [ visibleModal, setVisibleModal ] = useState<boolean>(false);
        const [ selecionado, setSelecionado ] = useState();
        const [ dados , setDados ] = useState();
        const [ pesquisa, setPesquisa ] =  useState('*');

        const [ orcamentoModal,setOrcamentoModal] = useState();

        async function busca(){
 
            if ( !usuario.codigo || usuario.codigo === 0 ){
                console.log("usuario invalido!")
                return
            }
            
            let aux:any = await useQuerypedidos.findByTipe(tipo , usuario.codigo );
            if(  aux?.length > 0 ){
                setOrcamentosRegistrados(aux);
            }  
     
        }


    /////////////////////////////////////////////////
        useEffect(()=>{
         busca()
        },[ orcamento, pesquisa , connected ])
    /////////////////////////////////////////////////

/////////////////////////////////////////////////
 
/////////////////////////////////////////////////
const ProdOrcamento = ( {item} )=>{
    return(
        <View style={{backgroundColor:'#3335' , borderRadius:5 , margin: 3 }}>
                <Text style={{ fontWeight:"bold"}}>
                    codigo: {item.codigo}
                </Text>
                <Text>
                    { item.descricao}
                </Text>
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                    <Text style={{ fontWeight:"bold"}}>
                            Quantidade: {item.quantidade}
                        </Text>
                    <Text style={{ fontWeight:"bold"}}>
                            unitario: {item.preco.toFixed(2)}
                        </Text>
                        <Text style={{ fontWeight:"bold"}}>

                            total: {item.total.toFixed(2)}
                        </Text>
                    </View>  

        </View>
    )
}
const ServiceOrcamento = ( { item } )=>{
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


    useEffect(()=>{
       
        async function busca(){
   
                console.log(selecionado)

            if( selecionado !== undefined ){
                let aux = await useQuerypedidos.selectCompleteOrderByCode(selecionado?.codigo);
                setOrcamento(aux );
 //                console.log('');
 //                console.log('');
 //                console.log('');
 //                console.log('');
 //                console.log('editando orcamento ',aux)
 //                console.log('');
            
            }else { return }  

        }
    busca()
    },[selecionado])

    async function deleteOrder (item){

        Alert.alert('', `Deseja excluir o orcamento : ${item.codigo} ?`,[
            { text:'Não',
                onPress: ()=> console.log('nao excluido o item'),
                style:'cancel',
            },
            {
                text: 'Sim', onPress: async ()=>{ 
                          await useQuerypedidos.deleteOrder(item.codigo)
                          setOrcamentosRegistrados(
                            orcamentosRegistrados.filter( (i) => i.codigo !== item.codigo)
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
      //  console.log(item)
          setSelecionado(item);
         setVisible(true);
         navigation.navigate('editarOrcamento');
    }

    function stiloItem(item:any){
            if(!item.situacao){
                return;
            }
        let cor;
        switch (item?.situacao){
            case  'EA' :
            cor =  { backgroundColor:'green', margin:5, borderRadius:5, elevation:5, padding:5};
            break;
            case 'AI':
                cor = { backgroundColor:'#009de2', margin:5, borderRadius:5, elevation:5, padding:5};  
                break;
            
            case 'FI':
                cor = { backgroundColor:'#ffc107', margin:5, borderRadius:5, elevation:5, padding:5};  
                break;
                case 'RE':
                    cor = { backgroundColor:'red', margin:5, borderRadius:5, elevation:5, padding:5};  
                    break;
            }
            return cor;
    }

    const ItemOrcamento = ({item})=>{
        return(
            <View   >      
                <View style={ stiloItem(item) }>
                        
                <TouchableOpacity style={{   backgroundColor: '#FFF', padding: 4, borderRadius: 5, width: '10%', elevation: 5, alignItems:"center" }} 
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

                        <View style={{ flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={{fontWeight:"bold", color:'white'}}>
                                orçamento :{ item?.codigo}  
                            </Text>
                            <Text style={{fontWeight:"bold", color:'white'}}>
                                   Total R$: {item?.total_geral.toFixed(2)}
                            </Text>
                            <TouchableOpacity 
                            onPress={()=>  deleteOrder(item)  }
                            >
                                 
                                <AntDesign name="closecircle" size={24} color="red" />
                            </TouchableOpacity>

                        </View>

                        <Text style={{fontWeight:"bold", color:'white', fontSize:20}}>
                        {item?.nome}
                        </Text>
                        
                        
                
                { item?.situacao !== 'RE' && item.situacao !== 'FI' ? 
                <TouchableOpacity onPress={( )=>{ selecionaOrcamento(item)}} style={{  borderRadius:5, elevation:5 ,backgroundColor:'white' ,width:35, padding:5}} >
                        <Feather name="edit" size={24} color="#009de2" />
                </TouchableOpacity>
                    : null     
                }
                      <Text style={{fontWeight:"bold", color:'white'}}>
                          Data Cadastro: {item?.data_cadastro}
                      </Text>
                    
                      <MaterialCommunityIcons name="send-circle" size={24} color="black" />
                      </View>
            </View>
        )
    }

    return (
        <View style={{ flex:1}} >

        < TextInput 
            style={{  margin:5, textAlign:'center', borderRadius:5, elevation:5, backgroundColor:'#FFF'}}
            onChangeText={(value)=>setPesquisa(value)}
            placeholder="pesquisar"
        /> 
        {/*********    lista de status dos pedidos  */}
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-around', margin:3  }}>
         <View style={{flexDirection:"row", alignItems:"center"}}>
                <View style={{padding:4,    backgroundColor:'green' , borderRadius:4}}>
                </View>
                <Text style={{ fontWeight:'bold',fontSize:12, marginLeft:2, color:'green'}}>
                    orcamento
                </Text>
            </View>

              <View style={{flexDirection:"row", alignItems:"center"}}>
                <View style={{ padding:4,     backgroundColor:'#009de2' , borderRadius:4}}>
                  </View>
                 <Text style={{ fontWeight:'bold' ,fontSize:13, marginLeft:2, color:'#009de2'}}>
                    pedido
                </Text>
              </View>

          

              <View style={{flexDirection:"row", alignItems:"center"}}>
                <View style={{ padding:4,     backgroundColor:'#ffc107' , borderRadius:4}}>
                  </View>
                 <Text style={{fontWeight:'bold' ,fontSize:13, marginLeft:2, color:'#ffc107'}}>
                    faturado
                </Text>
              </View>

              <View style={{flexDirection:"row", alignItems:"center"}}>
                <View style={{ padding:4,     backgroundColor:'red' , borderRadius:4}}>
                  </View>
                 <Text style={{fontWeight:'bold' , fontSize:13, marginLeft:2, color:'red'}}>
                    reprovado
                </Text>
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
                        <Text style={{ fontSize:15, fontWeight:"bold"}}>
                                {orcamento.data_cadastro}
                         </Text>
                 </View>

                  <View style={{ padding:5 }}>          
                        <Text style={{  fontWeight:"bold"}} >
                            cliente: {orcamentoModal?.cliente.codigo}
                        </Text>
                        <Text style={{ fontWeight:"bold"}}>
                            {orcamentoModal?.cliente.nome}
                        </Text>
                 </View>

                       <View style={{   padding:3}}>   
                            <View style={{ flexDirection:"row" , justifyContent:'space-between'}}>
                                    <Text style={{ fontWeight:"bold"}}>
                                        Total: { orcamentoModal?.total_geral ? orcamentoModal.total_geral.toFixed(2) : 0  }
                                    </Text>
                                    
                                    <Text style={{ fontWeight:"bold"}}>
                                        Descontos: {orcamentoModal?.descontos ? orcamentoModal.descontos.toFixed(2) : 0}
                                    </Text>
                            </View>

                            <View style={{ flexDirection:"row" , justifyContent:'space-between' }}>
                              
                               <Text style={{ fontWeight:"bold"}}>
                                    Total Servicos: {  orcamentoModal?.total_servicos ?  orcamentoModal?.total_servicos.toFixed(2) : 0  }
                                </Text>
                                <Text style={{ fontWeight:"bold"}}>
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

                <Button title="Voltar" onPress={()=> setVisibleModal(false)}/>
                </View>

            </View>
        </Modal>
        
        {/** <Button title="press" onPress={()=> setVisibleModal(true)}/>
*/}
       

        {/******************************************* */}
                <FlatList
                data={orcamentosRegistrados}
                renderItem={({item})=> <ItemOrcamento item={item}/>}
                />
        </View >
    )


}

const  styles = StyleSheet.create({
    containerItemOrcamento:{
        
    }

})