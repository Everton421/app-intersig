import { useEffect, useState } from "react";
import { useMarcas } from "../../database/queryMarcas/queryMarcas"
import { ActivityIndicatorBase, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { defaultColors } from "../../styles/global";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";


type marca = {
  codigo:number,
   descricao:string
}

    type props = {
        setMarca :React.Dispatch<React.SetStateAction<marca | undefined>>
        codigoMarca:number | undefined
    }

export  const RenderModalMarcas = ({setMarca, codigoMarca}:props ) => {
    
        const useQueryMarcas = useMarcas();

    let [ active, setActive ] = useState<boolean>(false);
    const [ marcas , setMarcas ] = useState([]);
    const [ data, setData] = useState([])
    const [ marcaSelecionada, setMarcaSelecionada ] = useState<marca>();
  const [ pesquisar, setPesquisar ] = useState<string | undefined>();
    const [loadingData, setLoadingData] = useState(false);
    
    
            async function selectAll(){
              try {
                 setLoadingData(true)
                     let dados:any = await useQueryMarcas.selectAllLimit(20);
                   if(dados?.length > 0 ){
                       setData(dados);  
                    }
                    setLoadingData(false)
                } catch (error) {
                  setLoadingData(false)
               }finally{
                 setLoadingData(false)
               }
            }
          async function selectByCode(codigoMarca:number){
             try {
                 setLoadingData(true)
                      let dados:any = await useQueryMarcas.selectByCode(codigoMarca);
                        if(dados?.length > 0 ){
                          setMarcaSelecionada(dados[0])
                        }
                          } catch (error) {
                  setLoadingData(false)
               }finally{
                 setLoadingData(false)
               }
           }
     async function selectByDescription(pesquisar:string){
           try {
                 setLoadingData(true)
                   let dados:any = await useQueryMarcas.selectByDescription(pesquisar);
                        if(dados?.length > 0 ){
                          setData(dados[0])
                        }
                    } catch (error) {
                      setLoadingData(false)
                  }finally{
                    setLoadingData(false)
                  }
               }


        useEffect(()=>{
          if( !pesquisar || pesquisar === ''){
              selectAll();
          }
            if(pesquisar !== '' && pesquisar !== undefined  ){
                selectByDescription(pesquisar);
            }
        }, [ pesquisar  ])


        useEffect(()=>{
          if(codigoMarca){
                selectByCode(codigoMarca);
          }
      },[ codigoMarca ])
 
    
  function selecionaMarca(item:marca){
      setMarcaSelecionada(item);
      setMarca(item)
      setActive(false)
  }
      
   function renderItem ({item}:{item:marca}){
             return (
                <TouchableOpacity onPress={(  )=>{  selecionaMarca(item)}}
                    style={[{margin:5,flexDirection:'row' , 
                    borderRadius:5,padding:5, elevation:3,  backgroundColor:defaultColors.darkBlue } ,item.codigo === codigoMarca && { backgroundColor:'#f2f2f2ff'} ] } > 
                    <View style={{ }} >
                        { item.codigo === codigoMarca ?
                       <FontAwesome name="bookmark" size={24} color={defaultColors.darkBlue}  /> 
                        :
                       <FontAwesome name="bookmark" size={24} color="#FFF" /> 
                        }
                    </View>
                     <View style={{  marginHorizontal:5,flexDirection:'row', alignItems:"center", justifyContent:'space-around' ,gap:5 }}>
                      <Text style={[ { color:'#FFF',fontWeight:'bold'  }, item.codigo === codigoMarca && { color:defaultColors.darkBlue } ]}>Cód: {item.codigo} </Text>
                      <Text style={[ { color:'#FFF',fontWeight:'bold'  }, item.codigo === codigoMarca && { color:defaultColors.darkBlue } ]}> {item.descricao} </Text> 
                    </View>
                       { item.codigo === codigoMarca && 
                         
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
                     <Text style={{color:'#FFF', fontWeight:"bold", fontSize:15}}> {marcaSelecionada ? marcaSelecionada.descricao : 'Marcas'} </Text>
                    <AntDesign name="caretdown" size={24} color="white"    />  
                  </TouchableOpacity>
              </View>
            
            <Modal visible={ active } 
              transparent={true}
                >
             <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", flex: 1 }} >
               <View style={{ backgroundColor: "#FFF", flex: 1 , margin:15, borderRadius:15, height:'80%'}} >
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
                                                      <ActivityIndicatorBase
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