import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native"
import { useTipoOs } from "../../../../database/queryTipoOs/queryTipoOs";
import { useEffect, useState } from "react";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

type typeOsFiltered = { 
    codigo:number,
     descricao: string
}

export const ModalOsType =({   handleEditTypeOs})=>{
    const [ visibleTypeosModal, setVisibleTipeOs ] = useState(false);
 
      const useQueryTipoOs      = useTipoOs();
        const [ dataTypeOs, setTypeOs ] = useState<typeOsFiltered[]>();
        
        useEffect(
        ()=>{
          async function buscaLocal(){
            try{
              const response:any = await useQueryTipoOs.selectAll();
    
                  if( response.length > 0  ){
                    setTypeOs(response);
                }else{
                  console.log('nenhum tipo de Os encontrada')
                }
        
            }catch(e){
              console.log( 'erro ao consultar tipo de OS! ', e )
            }
          }
    
          buscaLocal();
    
        },[]);


     function renderItemOS  (item:typeOsFiltered) {
      return ( 
        <TouchableOpacity style={{ backgroundColor:'#185FED', margin:5, padding:7, borderRadius:5 , elevation:4}} 
        onPress={ ()=> handleEditTypeOs(item.codigo)}  >
          <Text style={{ color:'white', fontWeight:'bold'}} >
            codigo:  {item.codigo} descricao: {item.descricao}
          </Text>
        </TouchableOpacity>
      )
    }

    return (

      <>
       <TouchableOpacity 
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
                 onPress={ ()=>  { visibleTypeosModal ?  setVisibleTipeOs(false) : setVisibleTipeOs(true)    } } >
                    <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesome name="gears" size={24} color="#185FED" />
                    </View>

                 <Text style={{ color:'#185FED', fontSize:15,fontWeight:'bold', alignSelf:'flex-start'}} > Tipos de Ordens de Serviço </Text>
                {// selectedTipo &&
                  ( <Text  style={{  color:'#185FED', fontSize:15,fontWeight:'bold' ,flex:1 }}  numberOfLines={2}> 
                      {/* selectedTipo?.descricao*/ } 
                     </Text> ) 
                }      
                <MaterialIcons name="search" size={24} color="#185FED" />

                </TouchableOpacity>
            <Modal visible={visibleTypeosModal} animationType="slide" transparent={true} onRequestClose={() => setVisibleTipeOs(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", maxHeight: "80%", elevation: 10 }}>
                        <View style={{ backgroundColor: '#185FED', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Escolha o Tipo de Ordens de Serviço</Text>
                            <TouchableOpacity onPress={() => setVisibleTipeOs(false)}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={dataTypeOs}
                            renderItem={({ item }) => renderItemOS(item) }
                            keyExtractor={(i: any) => i.codigo.toString()}
                            contentContainerStyle={{ padding: 20 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>   
      </>

)
}