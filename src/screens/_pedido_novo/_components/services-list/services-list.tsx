import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useServices } from "../../../../database/queryServicos/queryServicos";


    function renderItemServico(item:any){


      //  const isSelected = orcamento.servicos.find(i => i.codigo === item.codigo);
        const isSelected   = {codigo: 1} ;

      //  const quantidade = isSelected ? isSelected.quantidade : 0;
        const quantidade =   0;

      return ( 
        <TouchableOpacity 
        style={ [
            {  backgroundColor: isSelected?.codigo  === item?.codigo  ? '#185FED' : '#FFF'} , 
        {  margin:5, padding:7, borderRadius:5 , elevation:4} ] }
         // onPress={ ()=> selecionaServico(item)}  
         >
          
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
             <Text style={ [ {  color:   isSelected?.codigo  === item?.codigo  ? '#FFF' :'#000'     }, { fontWeight:'bold'} ] } >
              codigo:  {item.codigo}  
             </Text>
             
             <Text style={ [ {  color:   isSelected?.codigo  === item?.codigo  ? '#FFF' :'#000'      }, { fontWeight:'bold'} ] } >
             valor:  {item.valor}  
             </Text>

            </View>
          
         <Text style={ [ {  color:   isSelected?.codigo  === item?.codigo  ? '#FFF' :'#000'  }, { fontWeight:'bold'} ] }  numberOfLines={2} >
               {item.aplicacao}
          </Text>
          
          
          { isSelected ?
             
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 2 }}>
        
              <View style={{ marginTop: 3 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ backgroundColor: 'white', borderRadius: 25, elevation: 4, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}> {  quantidade  } </Text>
                  </View>
                  <View
                   style={styles.buttonsContainer} 
                  >
                    <TouchableOpacity 
                    //  onPress={() =>  handleIncrement(item)} 
                       style={styles.button}
                      >
                      <Text 
                       style={styles.buttonText}
                       >  + </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      //   onPress={() => handleDecrement(item)} 
                        style={styles.button}
                        >
                      <Text   style={styles.buttonText}
                      > - </Text>
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

          :null
          }
        </TouchableOpacity>
      )
    }


    const renderItem = ({ item }: any) => {

        return (
            <TouchableOpacity
                style={{
                    backgroundColor: "#FFF",
                    borderRadius: 12,
                    marginHorizontal: 15,
                    marginVertical: 6,
                    padding: 10,
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
              //  onPress={() => selecionarItem(item)}
            >
                <View style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden' }}>
                    
                    <FontAwesome5 name="tools" size={24} color="#BDBDBD" />

                </View>

                {/* Dados */}
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#185FED', fontWeight: 'bold' }}>Cód: {item.codigo}</Text>
                        <Text style={{ fontSize: 12, color: '#185FED', fontWeight: 'bold' }}>Id: {item.id}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#4CAF50' }}>R$ {item.valor ? item.valor.toFixed(2) : '0.00'}</Text>
                    </View>

                    <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#333', marginVertical: 2 }}>
                        {item.aplicacao}
                    </Text>

                </View>
            </TouchableOpacity>
        );
    };


export const ServicesList = ()=>{
    
    const [ isVisibleServices, setIsVisibleServices ] = useState(false);
    const [ searchService, setSearchService] = useState<string>();
    const [ filteredDataServices , setFilteredDataServices ] = useState();
    const [ isLoadingDataServices , setIsLoadingDataServices ] = useState(false);

      const useQueryServicos  = useServices();

        async function register (){

            await useQueryServicos.create({
                aplicacao:"teste",
                codigo:1,
                data_cadastro:'2025-01-01',
                data_recadastro:'2025-01-01',
                tipo_serv:1,
                valor:10
            })
        }
          
        
        async function buscaLocal(){
            try{
                setIsLoadingDataServices(true)
                const responseServicesFiltered:any = await useQueryServicos.selectByDescription( searchService, 10);
                if( responseServicesFiltered.length > 0  ){
                  setFilteredDataServices(responseServicesFiltered);
               }

            }catch(e){
              console.log( 'erro ao consultar os servicos! ', e )
            }finally{
                  setIsLoadingDataServices(false)
            }
          }

    useEffect(
        ()=>{
        buscaLocal();
        },[ searchService ])


    return ( 
        <>
      
          <TouchableOpacity
                             onPress={ ()=>    setIsVisibleServices(true) }  

                style={{
                    backgroundColor: '#FFF',
                    borderRadius: 12,
                    padding: 15,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome5 name="tools" size={24} color="#185FED"/>

                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Adicionar Serviços</Text>
                        <Text style={{ fontSize: 13, color: '#666' }}>Toque para pesquisar itens</Text>
                    </View>
                </View>
                <MaterialIcons name="search" size={24} color="#185FED" />
            </TouchableOpacity>

                      {/****** modal servicos */}
        <Modal visible={isVisibleServices} animationType="fade" transparent={true} onRequestClose={() => setIsVisibleServices(false)}>

                
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'center', alignItems: 'center' }}>
                
                    <View style={{
                        width: "100%",
                        height: "90%",
                        backgroundColor: "#F5F7FA",
                        borderRadius: 16,
                        overflow: 'hidden',
                        elevation: 10
                    }}>
                        {/* Header Modal */}
                        <View style={{ backgroundColor: '#185FED', padding: 15, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#FFF',
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                height: 40,
                                marginRight: 10
                            }}>
                                <Ionicons name="search" size={20} color="#999" style={{ marginRight: 5 }} />
                                <TextInput
                                    style={{ flex: 1, color: '#333' }}
                                    placeholder="Digite para buscar..."
                                    placeholderTextColor="#999"
                                    onChangeText={(text) => setSearchService(text)}
                                    autoFocus={true}
                                />
                            </View>
                            <TouchableOpacity onPress={() => setIsVisibleServices(false)}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Lista */}
                        <View style={{ flex: 1, paddingVertical: 10 }}>
                            {isLoadingDataServices ? (
                                <ActivityIndicator size="large" color="#185FED" style={{ marginTop: 20 }} />
                            ) : (
                                <FlatList
                                    data={filteredDataServices}
                                    renderItem={renderItem}
                                    keyExtractor={(item: any) => item.codigo.toString()}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={() => (
                                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                                            <MaterialIcons name="search-off" size={50} color="#BDBDBD" />
                                            <Text style={{ color: '#999', marginTop: 10 }}>Nenhum serviço encontrado.</Text>
                                        </View>
                                    )}
                                />
                            )}
                        </View>

                        { /*productIsSelected &&
                            <ModalEditSelectedService
                                handleDiscount={handleDiscount}
                                isSelected={productIsSelected}
                                handleAddProduct={handleAddProduct}
                                setVisible={setIsVisibleModalSelectedProduct}
                                visible={isVisibleModalSelectedProduct}
                            />
                        */}

                    </View>
                </View>
            </Modal>


    </>
    );
}
const styles = StyleSheet.create({
    container: {
      flex:1
     },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 5,
      elevation: 5
    },
    searchContainer: {
      justifyContent: 'space-around',
      backgroundColor: '#FFF',
      borderRadius: 5,
      elevation: 10,
    },
    limpar: {
      borderRadius: 5,
      backgroundColor: 'red',
      width: 50,
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      marginEnd: 1
    },
    limparText: {
      color: '#FFF'
    },
    buttonsContainer: {
      flexDirection: 'row'
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
   
  });