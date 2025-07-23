import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Touchable, ActivityIndicator } from 'react-native';
import { ClienteContext } from '../../../../contexts/clienteDoOrcamento';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { OrcamentoContext, OrcamentoModel } from '../../../../contexts/orcamentoContext';
import { ConnectedContext } from '../../../../contexts/conectedContext';
import { useClients } from '../../../../database/queryClientes/queryCliente';
import { AuthContext } from '../../../../contexts/auth';
import { usePedidos } from '../../../../database/queryPedido/queryPedido';
import { Ionicons } from '@expo/vector-icons';



export const ListaClientes = ( {  codigo_orcamento }:any ) => {

  const [pesquisa, setPesquisa] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [data, setData] = useState([]);
  const [ loadingClient, setLoadingClient ] = useState(false);

  const [ visibleClientes, setVisibleClientes ] = useState<boolean>(false);

   
 const useQueryClients = useClients();
 const useQuerypedidos   = usePedidos();
 

    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);
    const { usuario } = useContext(AuthContext);


  ////////////////////
      useEffect(() => {
        const busca = async () => {
            try{
              let aux:any = await  useQueryClients.selectByDescription(pesquisa,10);
              setData(aux)
            }catch(e){ console.log(e)}
        };
        busca();

        if (pesquisa === null || pesquisa === '') {
            setPesquisa('');
          }
      }, [pesquisa]);

  ////////////////////
  useEffect(
    ()=>{
      async function init() {
          if(codigo_orcamento && codigo_orcamento > 0 ){

              setSelectedItem({})

              let responsePedido:any = await useQuerypedidos.selectByCode(codigo_orcamento)
            
              const pedido = responsePedido[0];
               if(pedido.codigo_cliente && pedido.codigo_cliente > 0  ){
                 try{
                  setLoadingClient(true)
                    let cliente:any = await useQueryClients.selectByCode(pedido.codigo_cliente);

                    setSelectedItem(cliente[0])

                    setOrcamento((prevOrcamento: OrcamentoModel) => ({
                      ...prevOrcamento,
                      cliente: cliente[0]
                    }));
                  setLoadingClient(false)
                 }catch(e){
                   console.log("Erro ao consultar o cliente do pedido:",codigo_orcamento)
                 } finally{
                  setLoadingClient(false)
                 }
               }
          }
      }
      init()

    },[]
  )
////////////////////

  const adiciona = (dado:any) => setPesquisa(dado);
 
function seleciona(item){
    setSelectedItem(item)
    setOrcamento((prevOrcamento: OrcamentoModel) => ({
      ...prevOrcamento,
      cliente: item
    }));
    setVisibleClientes(false)
}


  const renderItem = ({ item }) => {
 
        const isSelected = item.codigo === selectedItem.codigo;

    return (
        <TouchableOpacity style={[styles.item, { backgroundColor: isSelected ? '#185FED' : '#FFF' }]} onPress={() => seleciona(item)} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                   <Text style={[styles.txt, { fontWeight: isSelected ? 'bold' : null }, { color: isSelected ? 'white' : null }]}>
                     Código: {item.codigo}
                  </Text>
            </View>
            <Text style={[styles.txtDescricao, { color: isSelected ? 'white' : null }]}>
            {item.nome}
            </Text>
        {isSelected &&
        <View>
          <View style={{   justifyContent: 'space-between', margin: 2 }}>            
             <View style={{ marginTop: 15 }}>
               <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                CNPJ : {item.cnpj}  
               </Text>
             </View>
             <View style={{ marginTop: 15 }}>
                 <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, elevation: 5 }}>
                  IE : {item.ie}  
                </Text>
             </View>
          </View>

                <View style={{ marginTop: 10, flexDirection:'row', justifyContent:'space-between' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, elevation: 5 }}>
                      Rua. : {item.endereco}  
                    </Text>
                </View>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, elevation: 5 }}>
                    Num. : {item.numero}  
                 </Text>
        </View>
        }
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

    <TouchableOpacity onPress={()=>setVisibleClientes(true)  }  
     style={{ justifyContent:'space-between', flexDirection:'row',margin:10,backgroundColor:'#185FED' ,borderRadius:7 , padding:10, elevation:4, width:'95%'}}>
                        <FontAwesome name="search" size={22} color="white" />
                        <Text style={{fontWeight:'bold' , fontSize:20, color:'white' ,width: '50%' ,textAlign:'center'}}>
                          clientes
                       </Text> 
                       <AntDesign name="caretdown" size={22} color="white"    />

      </TouchableOpacity>
          

         <View style={{ justifyContent: 'center', alignItems:'center', backgroundColor: '#FFF', borderWidth: 1, borderColor:'#DEE2E6' , width:'98%'}}>
                    { loadingClient ?  
                    ( 
                    <ActivityIndicator size={35} color="#185FED"  /> 
                    ) :(
                     <View>
                    <View style={{margin:2, flexDirection: 'row',  width:'100%' }}>
                       <Text style={{    fontWeight: 'bold'  ,color: '#6C757D',width:'10%'}}> Cliente:</Text>
                       <Text style={{  fontWeight: 'bold' ,color: '#6C757D' ,width:'90%' }} numberOfLines={3}> { selectedItem?.nome} </Text>
                    </View>
                   
                        <View style={{ padding:5  ,flexDirection: 'row', justifyContent: 'space-between',width:'98%' }}>
                          <Text style={{    fontWeight: 'bold'  ,color: '#6C757D'}}> 
                            cnpj: {selectedItem?.cnpj}
                          </Text>
                         <Text style={{ fontWeight: 'bold'  ,color: '#6C757D'}}> celular: {selectedItem?.celular}</Text>
                     </View> 
                    </View>
                     )
                     }

           </View>

      <Modal visible={visibleClientes}
      animationType="slide"
      transparent={true}
      >
       <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }} > 
                  <View style={{ margin: 0, backgroundColor: "#F0F4F8", borderTopStartRadius: 20, borderTopEndRadius: 20, width: "100%", height: "90%", shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5  }}>
     
            <View style={{padding:5}}>
           
                      <TouchableOpacity  onPress={()=>setVisibleClientes(false)}  style={ { width:'15%'  ,padding: 16, borderRadius: 12    }}>
                            <Ionicons name="close" size={28} color={ '#6C757D' } />
                    </TouchableOpacity>
            </View>

            <View style={{marginBottom:20, margin:5, flexDirection:'row',justifyContent:'space-between', elevation:5}}>
                <TextInput
                            style={{backgroundColor: "#FFF",fontWeight:'bold', margin:2, borderRadius: 8, width: "95%", alignSelf: 'center', marginTop: 5, elevation: 3, padding: 15, borderWidth: 1, borderColor: '#ddd'}}
                  placeholder='Pesquisar'
                  value={pesquisa}
                  onChangeText={adiciona}
                  placeholderTextColor='#185FED'
                />
                
             </View>

            <View style={{backgroundColor:'#dcdcdd'}}>
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.codigo.toString()}
                />
           </View>

           </View>
           </View>
         
  
      </Modal>
    
      
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
       alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    elevation: 5
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    width:'80%',
    padding:7,
    margin:2,
    elevation: 5
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
  txtDescricao: {
    fontWeight: 'bold',
    fontSize: 15
  },
  txt: {
    fontWeight: 'bold',
  }
});
