import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Touchable } from 'react-native';
import { ClienteContext } from '../../../../contexts/clienteDoOrcamento';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { OrcamentoContext, OrcamentoModel } from '../../../../contexts/orcamentoContext';
import { ConnectedContext } from '../../../../contexts/conectedContext';
import { useClients } from '../../../../database/queryClientes/queryCliente';
import { AuthContext } from '../../../../contexts/auth';
import { usePedidos } from '../../../../database/queryPedido/queryPedido';



export const ListaClientes = ( {  codigo_orcamento }:any ) => {

  const [pesquisa, setPesquisa] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [data, setData] = useState([]);
  const [totalItens, setTotalItens] = useState(0);

  const [ visibleClientes, setVisibleClientes ] = useState<boolean>(false);

 const { connected, setConnected } = useContext(ConnectedContext)
   
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
                    let cliente:any = await useQueryClients.selectByCode(pedido.codigo_cliente);

                    setSelectedItem(cliente[0])

                    setOrcamento((prevOrcamento: OrcamentoModel) => ({
                      ...prevOrcamento,
                      cliente: cliente[0]
                    }));

                 }catch(e){ console.log("Erro ao consultar o cliente do pedido:",codigo_orcamento)}
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
        <TouchableOpacity style={[styles.item, { backgroundColor: isSelected ? '#009de2' : '#FFF' }]} onPress={() => seleciona(item)} >
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
    style={{ justifyContent:'space-between', flexDirection:'row',margin:10,backgroundColor:'#009de2' ,borderRadius:7 , padding:10, elevation:4, width:'95%'}}>
                        <FontAwesome name="search" size={22} color="white" />
                       
                        <Text style={{fontWeight:'bold' , fontSize:20, color:'white' ,width: '50%' ,textAlign:'center'}}>
                          clientes
                       </Text> 
                       <AntDesign name="caretdown" size={24} color="white"    />

      </TouchableOpacity>
            <View style={{ justifyContent: 'center', backgroundColor: '#FFF' ,margin:7  }}>
                    
                    <Text style={{ fontWeight: 'bold',width:'100%' }}> {selectedItem?.nome}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',width:'100%' }}>
                        <Text style={{ fontWeight: 'bold', width:'100%' }}> cnpj: {selectedItem?.cnpj}</Text>
                    </View>
                    <Text style={{ alignSelf:'flex-end' ,fontWeight: 'bold' }}>celular: {selectedItem?.celular}</Text>

                </View>

      <Modal visible={visibleClientes}
      animationType="slide"
      transparent={true}
      >
      
 <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
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
     

            <View style={{padding:5}}>
            <TouchableOpacity onPress={()=>setVisibleClientes(false)}
                   style={{margin:15, backgroundColor:'#009de2',padding:7, borderRadius:7,width:'25%',elevation: 5}} >
                    <Text style={{color:'#FFF',fontWeight:'bold'}}>
                      voltar
                    </Text>
                  </TouchableOpacity>
            </View>

            <View style={{marginBottom:20, margin:5, flexDirection:'row',justifyContent:'space-between', elevation:5}}>
                <TextInput
                  style={styles.input}
                  placeholder='Pesquisar'
                  value={pesquisa}
                  onChangeText={adiciona}
                  placeholderTextColor='#009de2'
                />
                    <TouchableOpacity  style={{  borderRadius: 5,backgroundColor: 'red',width: 50,  alignItems: 'center',justifyContent:'center' }}>
                        <Text style={{color:'#FFF',fontWeight:'bold'}}>limpar</Text>
                    </TouchableOpacity>
             </View>

            <View style={{backgroundColor:'#dcdcdd'}}>
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.codigo}
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
