import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCaracteristica } from "../../database/queryCaracteristicas/queryCaracteristicas";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { defaultColors } from "../../styles/global";

  type caracteristica = {
      codigo:number,
      descricao: string
      unidade:string
    }

    type props = {
        setCaracteristica :React.Dispatch<React.SetStateAction<caracteristica | undefined>>
        codigoCaracteristica:number | undefined
    }
export  const RenderModalCaracteristicas = ({ setCaracteristica,codigoCaracteristica   }:props) => {


    const useQueryCaracteristica  = useCaracteristica();

    let [ active, setActive ] = useState<boolean>(false);
    const [ data, setData] = useState([])
    const [  caracteristicaSelecionada, setCaracteristicaSelecionada ] = useState<caracteristica>();
    const [ pesquisar, setPesquisar ] = useState<string | undefined>();
    const [loadingData, setLoadingData] = useState(false);
    
  async function selectByCode(){
      if(!codigoCaracteristica ) return;
            try{
              let dados:any = await useQueryCaracteristica.selectByCode(codigoCaracteristica);   
              if(dados?.length > 0 ){
                  setCaracteristicaSelecionada(dados[0])
                }
            }catch(e){
            }finally{
            }
          }

      async function selectByDescription(){
        if(!pesquisar ) return;
            try{
                setLoadingData(true);
              let dados:any = await useQueryCaracteristica.selectByDescription(pesquisar);   
              if(dados?.length > 0 ){
                  setData(dados)
                }
            }catch(e){
                setLoadingData(false);
            }finally{
                setLoadingData(false);
            }
          }

             async function selectAll(){
                try {
                 setLoadingData(true);

                      let dados:any = await useQueryCaracteristica.selectAllLimit(15);   
                       if(dados?.length > 0 ){
                         setData(dados);  
                          }
                    }catch(e){
                       setLoadingData(true);
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
          if(codigoCaracteristica){
                selectByCode();
          }
      },[ codigoCaracteristica ])
 

function selecionaCaracterisca(item:caracteristica){
  setCaracteristicaSelecionada(item);
  setCaracteristica(item)
    setActive(false)
}
        
        function renderItem ({item}:{item:caracteristica}){
             return (
                <TouchableOpacity onPress={(  )=>{  selecionaCaracterisca(item)}}
                    style={[{margin:5,flexDirection:'row' , 
                    borderRadius:5,padding:5, elevation:3,  backgroundColor:defaultColors.darkBlue } ,item.codigo === codigoCaracteristica && { backgroundColor:'#f2f2f2ff'} ] } > 
                    <View style={{ }} >
                        { item.codigo === codigoCaracteristica ?
                       <Ionicons name="options" size={25} color={defaultColors.darkBlue} />
                        :
                       <Ionicons name="options" size={25} color="#FFF" />
                        }
                    </View>
                     <View style={{flexDirection:'row', alignItems:"center", justifyContent:'space-around' ,gap:5 }}>
                      <Text style={[ { color:'#FFF',fontWeight:'bold'  }, item.codigo === codigoCaracteristica && { color:defaultColors.darkBlue } ]}>Cód: {item.codigo} </Text>
                      <Text style={[ { color:'#FFF',fontWeight:'bold'  }, item.codigo === codigoCaracteristica && { color:defaultColors.darkBlue } ]}> {item.descricao} </Text> 
                    </View>
                       { item.codigo === codigoCaracteristica && 
                         
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
                            caracteristicaSelecionada ? (
                              <>
                              <Text style={{color:'#FFF', fontWeight:"bold", fontSize:15}}> Codigo: {  String(caracteristicaSelecionada?.codigo)  } </Text>

                              <Text style={{color:'#FFF', fontWeight:"bold", fontSize:15}}> {  caracteristicaSelecionada?.descricao  } </Text>
                              </>
                            ): (
                              <Text style={{color:'#FFF', fontWeight:"bold", fontSize:15}}> Características </Text>
                            )
                          }
<AntDesign name="caret-down" size={24} color="white" />
                  </TouchableOpacity>
              </View>
            
            <Modal visible={active} transparent={true} animationType="slide">
              <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", height: "90%", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 5 }}>
                  <View style={{ backgroundColor: '#185FED', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Selecionar Característica</Text>
                    <TouchableOpacity onPress={() => { setActive(false); setPesquisar(undefined) }} style={{ padding: 4 }}>
                      <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 12, height: 45 }}>
                      <Ionicons name="search" size={20} color="#185FED" style={{ marginRight: 8 }} />
                      <TextInput
                        style={{ flex: 1, color: '#333', fontSize: 15 }}
                        placeholder="Pesquisar característica..."
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