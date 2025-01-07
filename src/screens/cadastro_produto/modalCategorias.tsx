import { useEffect, useState } from "react";
import { useMarcas } from "../../database/queryMarcas/queryMarcas"
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCategoria } from "../../database/queryCategorias/queryCategorias";


export  const RenderModalCategorias = ({setCategoria}:any) => {

    type categoria = {
      codigo:Number,
      descricao: string
    }

        const useQueryMarcas = useMarcas();
        const useQuerCategorias = useCategoria();

    let [ active, setActive ] = useState<boolean>(false);
    const [ data, setData] = useState([])
    const [  categoriaSelecionada, setCategoriaSelecionada ] = useState<categoria | null >(null);

 
    useEffect(
        ()=>{
            async function buscaMarcas(){
                let dados:any = await useQuerCategorias.selectAll();   
                if(dados?.length > 0 ){
                    setData(dados);  
                    console.log(dados)
                }
            }
buscaMarcas();
        },[]
    )
 
    
function selecionaCategoria(item){
  setCategoriaSelecionada(item);
  setCategoria(item)
    setActive(false)
}
        
        function renderItem ({item}:any){
             return (
                <TouchableOpacity onPress={(  )=>{  selecionaCategoria(item)}}
                    style={{margin:5, flexDirection:"row", backgroundColor:"#009de2", borderRadius:5,padding:5 }}
                > 
                   <Text style={{ color:'#FFF'}}> {item.codigo} </Text>
                   <Text style={{ color:'#FFF'}}> {item.descricao} </Text>
                </TouchableOpacity>
                
                )}


        return(
        <View style={{ flex:1}}>
               <View>
                  <TouchableOpacity
                          style={{ backgroundColor:'#185FED',   padding:5, borderRadius:5, flexDirection:"row",justifyContent:"space-between" , margin:7, elevation:3}}
                          onPress={()=>{ !active ? setActive(true) : setActive(false)  }}
                        >
                     <Text style={{color:'#FFF', fontWeight:"bold", fontSize:15}}> {categoriaSelecionada ? categoriaSelecionada.descricao : 'categorias'} </Text>
                    <AntDesign name="caretdown" size={24} color="white"    />  
                  </TouchableOpacity>
              </View>
            
            <Modal visible={ active } 
              transparent={true}
                >
             <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", flex: 1 }} >
               <View style={{ backgroundColor: "#FFF", flex: 1 , margin:15, borderRadius:15, height:'80%'}} >

                        <TouchableOpacity
                             onPress={()=>{   setActive(false) }}
                                  style={{
                                    margin: 15, backgroundColor: "#185FED",  padding: 7, borderRadius: 7 ,width: "20%", elevation: 5, }}>
                                  <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                                    voltar
                                  </Text>
                                </TouchableOpacity>

                   <View style={{     height:'90%'}} >
                        <FlatList 
                            data={data}
                            renderItem={(item)=> renderItem(item)}
                            keyExtractor={(item:any)=> item.codigo }
                        />
                   </View>


                 </View>
               </View>
            </Modal>
        </View>
    )
}