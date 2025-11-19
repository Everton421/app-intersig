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
                    <AntDesign name="caretdown" size={24} color="white"    />  
                  </TouchableOpacity>
              </View>
            
            <Modal visible={ active } 
              transparent={true}
              animationType={"slide"}
                >

             <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", flex: 1 }} >
               <View style={{ backgroundColor: "#FFF", flex: 1 ,alignItems:"center", marginTop:25 ,borderTopEndRadius:25 ,borderTopStartRadius:25, height:'80%'}} >
                <TouchableOpacity
                                onPress={()=>{  
                                     setActive(false)
                                       setPesquisar(undefined) 
                                    }}
                                style={{ backgroundColor:defaultColors.ligthGray, width:'100%',borderTopEndRadius:25 ,borderTopStartRadius:25, alignItems:"center" }}  
                                    >
                            <Entypo name="dots-three-horizontal" size={24} color={defaultColors.gray} />
                            </TouchableOpacity>
                 

                        <View style={{  borderColor:defaultColors.ligthGray ,  height:'90%', width:'98%',marginTop:15}}   >
                            <TextInput
                                style={{ margin:5,   borderWidth:1,color:defaultColors.gray,fontWeight:"bold",fontSize:16, borderColor:defaultColors.ligthGray, borderRadius:3}}    
                                onChangeText={(e)=> setPesquisar(e)}
                                placeholder="Pesquisar caracteristica :"
                                defaultValue={pesquisar}    
                                />
                                
                                {
                                    loadingData ? 
                                   <ActivityIndicator
                                    color={defaultColors.darkBlue}
                                    size={45}
                                    />
                                    : 
                                <FlatList 
                                    data={data}
                                    renderItem={(item)=> renderItem(item)}
                                    keyExtractor={(item:any)=> item.codigo }
                                />
                                }

                        </View>

                 </View>
               </View>
            </Modal>
          
        </View>
    )
}