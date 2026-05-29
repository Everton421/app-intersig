import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCategoria } from "../../database/queryCategorias/queryCategorias";
import { defaultColors } from "../../styles/global";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";

   type categoria = {
      codigo:Number,
      descricao: string
    }

       type props = {
        setCategoria :React.Dispatch<React.SetStateAction<categoria | undefined>>
        codigoCategoria:number | undefined
    }

export  const RenderModalCategorias = ({setCategoria,codigoCategoria   }:any) => {

        const useQuerCategorias = useCategoria();

    let [ active, setActive ] = useState<boolean>(false);
    const [ data, setData] = useState([])
    const [  categoriaSelecionada, setCategoriaSelecionada ] = useState<categoria | null >(null);
    const [ pesquisar, setPesquisar ] = useState<string | undefined>();
    const [loadingData, setLoadingData] = useState(false);
 


     async function selectAll(){
          try{
            setLoadingData(true);
                let dados:any = await useQuerCategorias.selectAllLimit(20);   
                    if(dados?.length > 0 ){
                            setData(dados);  
                        }
                 }catch( e:any ){
                setLoadingData(false);
                }finally{
                setLoadingData(false);
                }
            }

  async function selectByCode(){
    try {
            setLoadingData(true);
              let dados:any = await useQuerCategorias.selectByCode(codigoCategoria);   
              if(dados?.length > 0 ){
                  setCategoriaSelecionada(dados[0])
                }
                setLoadingData(false);
                  } catch (error) {
                  setLoadingData(false);
              }finally{
                  setLoadingData(false);
              }
          }
          
      async function selectByDescription(){
        if(!pesquisar ) return;
            try{
                setLoadingData(true);
              let dados:any = await useQuerCategorias.selectByDescription(pesquisar);   
              if(dados?.length > 0 ){
                  setData(dados)
                }
            }catch(e){
                setLoadingData(false);
            }finally{
                setLoadingData(false);
            }
          }


        useEffect(()=>{
        if( !pesquisar || pesquisar === ''){
            selectAll();
        }
            if(pesquisar !== ''   ){
                console.log(pesquisar)
                selectByDescription();
            }
        }, [ pesquisar  ])

     useEffect(()=>{
          if(codigoCategoria){
                selectByCode();
          }
      },[ codigoCategoria ])
 
    
function selecionaCategoria(item:categoria){
  setCategoriaSelecionada(item);
  setCategoria(item.codigo)
    setActive(false)
}
        
        function renderItem ({item}:any){
             return (
                <TouchableOpacity onPress={(  )=>{  selecionaCategoria(item)}}
                    style={[{margin:5,flexDirection:'row' , 
                    borderRadius:5,padding:5, elevation:3,  backgroundColor:defaultColors.darkBlue } ,item.codigo === codigoCategoria && { backgroundColor:'#f2f2f2ff'} ] } >
                      <View style={{ }} >
                        { item.codigo === codigoCategoria ?
                          <MaterialIcons  name="category" size={24} color={defaultColors.darkBlue} />
                           :
                           <MaterialIcons  name="category" size={24} color="#FFF" />
                        }
                    </View>
                     <View style={{flexDirection:'row', alignItems:"center", justifyContent:'space-around' ,gap:5 }}>
                      <Text style={[ {gap:2, color:'#FFF',fontWeight:'bold'  }, item.codigo === codigoCategoria && { color:defaultColors.darkBlue } ]}>Cód: {item.codigo} </Text>
                      <Text style={[ { color:'#FFF',fontWeight:'bold'  }, item.codigo === codigoCategoria && { color:defaultColors.darkBlue } ]}> {item.descricao} </Text> 
                    </View>
                       { item.codigo === codigoCategoria && 
                         
                      <View   style={{ alignSelf:"flex-end"}}> 
                                <Ionicons name="checkmark-circle" size={25} color={defaultColors.green} /> 
                      </View>
                        }
                        
                </TouchableOpacity>
                
                )}


        return(
        <View style={{ flex:1}}>
               <View>
                  <TouchableOpacity
                          style={{ backgroundColor:'#185FED',   padding:5, borderRadius:5, flexDirection:"row",justifyContent:"space-between" , margin:7, elevation:3}}
                          onPress={()=>{ !active ? setActive(true) : setActive(false)  }}
                        >
                          {
                            categoriaSelecionada ? (
                              <>
                              <Text style={{color:'#FFF', fontWeight:"bold", fontSize:15}}> Codigo: {  String(categoriaSelecionada?.codigo)  } </Text>

                              <Text style={{color:'#FFF', fontWeight:"bold", fontSize:15}}> {  categoriaSelecionada?.descricao  } </Text>
                              </>
                            ): (
                              <Text style={{color:'#FFF', fontWeight:"bold", fontSize:15}}> categorias </Text>

                            )
                          }
<AntDesign name="caret-down" size={24} color="white" />
                  </TouchableOpacity>
              </View>
            
            <Modal visible={active} transparent={true} animationType="slide">
              <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", height: "90%", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 5 }}>
                  <View style={{ backgroundColor: '#185FED', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Selecionar Categoria</Text>
                    <TouchableOpacity onPress={() => { setActive(false); setPesquisar(undefined) }} style={{ padding: 4 }}>
                      <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 12, height: 45 }}>
                      <Ionicons name="search" size={20} color="#185FED" style={{ marginRight: 8 }} />
                      <TextInput
                        style={{ flex: 1, color: '#333', fontSize: 15 }}
                        placeholder="Pesquisar categoria..."
                        placeholderTextColor="#999"
                        onChangeText={(e) => setPesquisar(e)}
                        defaultValue={pesquisar}
                      />
                    </View>
                  </View>
                  {loadingData ? (
                    <ActivityIndicator color={defaultColors.darkBlue} size={45} style={{ flex: 1 }} />
                  ) : (
                    <FlatList
                      data={data}
                      renderItem={(item) => renderItem(item)}
                      keyExtractor={(item) => item.codigo}
                      contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
                    />
                  )}
                </View>
              </View>
            </Modal>
        </View>
    )
}