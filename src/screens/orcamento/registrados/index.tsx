import { useContext, useEffect, useState } from "react"
import { Text, View, FlatList, Modal, TextInput, StyleSheet} from "react-native"
import { api } from "../../../services/api"
import { TouchableOpacity } from "react-native-gesture-handler";
import Feather from '@expo/vector-icons/Feather';
import { OrcamentoContext } from "../../../contexts/orcamentoContext";
import { ClienteContext } from "../../../contexts/clienteDoOrcamento";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { ConnectedContext } from "../../../contexts/conectedContext";
import { usePedidos } from "../../../database/queryPedido/queryPedido";

export const Registrados = ({navigation})=>{

    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);

    const { connected ,setConnected } = useContext ( ConnectedContext )

    const useQuerypedidos = usePedidos();

        const [ orcamentosRegistrados, setOrcamentosRegistrados] = useState([]);
        const [ visible, setVisible ] = useState<boolean>(false);
        const [ selecionado, setSelecionado ] = useState();
        const [ dados , setDados ] = useState();
        const [ pesquisa, setPesquisa ] =  useState('*');

    useEffect(()=>{
        async function busca(){

             if( connected){
 
                   if(!pesquisa ){
                       setPesquisa('*')
                   }
               try{
                   const response = await api.get(`/orcamentos/diario/${pesquisa}`);
                  // console.log(response.data);
                   if(response.status === 200 ){
                       setOrcamentosRegistrados(response.data);
                   }
       
                   }catch(err){
                   console.log(err);
               }
   
               }else{
                
                let aux:any = await useQuerypedidos.selectAll();

                if(  aux?.length > 0 ){
                    setOrcamentosRegistrados(aux);
                }  
             }

         
    }
busca()

    },[ orcamento, pesquisa , connected])

    useEffect(()=>{
       
        async function busca(){
             if( connected ){
                try{
                    const response = await api.get(`/orcamentos/${selecionado?.codigo}`);
                    setOrcamento(response.data); 
    
                    setDados(response.data);
                    }catch(err){
                    console.log(err);
                }
                }else{

             if( selecionado !== undefined ){
                let aux = await useQuerypedidos.selectCompleteOrderByCode(selecionado?.codigo);
                setOrcamento(aux );
             //   console.log('');
             //   console.log('');
             //   console.log('');
             //   console.log('');
             //   console.log('editando orcamento ',aux)
             //   console.log('');
            }else { return }  

             }
        }
    busca()
    },[selecionado])

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
            <View style={{flex:1}}>      
                <View style={ 
                    stiloItem(item)
                    }>
                        <View style={{ flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={{fontWeight:"bold", color:'white'}}>
                                orçamento :{ item.codigo}  
                            </Text>
                            <Text style={{fontWeight:"bold", color:'white'}}>
                                  R$: {item?.total_geral }
                            </Text>
                        </View>

                        <Text style={{fontWeight:"bold", color:'white'}}>
                        {item.nome}
                        </Text>
                
                { item.situacao !== 'RE' && item.situacao !== 'FI' ? 
                <TouchableOpacity onPress={( )=>{ selecionaOrcamento(item)}} style={{  borderRadius:5, elevation:5 ,backgroundColor:'white' ,width:35, padding:5}} >
                        <Feather name="edit" size={24} color="#009de2" />
                </TouchableOpacity>
                    : null     
                }
                      <Text style={{fontWeight:"bold", color:'white'}}>
                        {item?.data_cadastro}
                        </Text>
                </View>
            </View>
        )
    }

    return (
        <View>

        < TextInput 
            style={{  margin:5, textAlign:'center', borderRadius:5, elevation:5, backgroundColor:'#FFF'}}
            onChangeText={(value)=>setPesquisa(value)}
            placeholder="pesquisar"
        /> 
        {/*********    lista de status dos pedidos  */}
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', margin:3}}>
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