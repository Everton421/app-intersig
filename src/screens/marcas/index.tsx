import { Text, View ,TouchableOpacity, TextInput, FlatList} from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from "react";
import { useMarcas } from "../../database/queryMarcas/queryMarcas";

export const Marcas = ({navigation})=>{
    const [ press, setPress ] = useState(false);
    const [ dados, setDados ] = useState([]);
    const [ pesquisa, setPesquisa ] = useState();
    
    const useQueryMarcas = useMarcas();

    useEffect(
                ()=>{
                    
                    async function busca(){ 
                            let data:any  = await useQueryMarcas.selectAll();
                            if( data?.length > 0  ){
                                setDados(data) 
                            }   
                          
                        }
                    busca();
                },[ ]
            )
 
            useEffect(
                ()=>{   
                    async function busca(){
         
                             
                    }
                    busca();
                },[ pesquisa ]
            )

    function renderItem({item}){
        return(
            <TouchableOpacity 
               // onPress={ ()=> handleSelect(item) }
                style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%' }}
             >
               <Text style={{ fontWeight:"bold"}}>
                  Codigo: {item.codigo}
               </Text>

               <Text>
                 {item.descricao}
               </Text>
             
            </TouchableOpacity>
        )
    }

    return(

        <View style={{   flex:1,  backgroundColor:'#EAF4FE'}} >
         <View style={{backgroundColor:'#185FED' }}>    
            <View style={{   padding:15, backgroundColor:'#185FED', alignItems:"center", flexDirection:"row", justifyContent:"space-between" }}>
                <TouchableOpacity onPress={  ()=> navigation.goBack()  } style={{ margin:5 }}>
                    <Ionicons name="arrow-back" size={25} color="#FFF" />
                </TouchableOpacity>
            
                  
                <View style={{ flexDirection:"row", marginLeft:10 , gap:2, width:'100%', alignItems:"center"}}>
                    < TextInput 
                        style={{  width:'70%', fontWeight:"bold" ,padding:5, margin:5, textAlign:'center', borderRadius:5, elevation:5, backgroundColor:'#FFF'}}
                        onChangeText={(value)=>setPesquisa(value)}
                        placeholder="pesquisar"
                    /> 

                    <TouchableOpacity  //onPress={()=> setShowPesquisa(true)}
                        >
                            <AntDesign name="filter" size={35} color="#FFF" />
                        </TouchableOpacity>
                </View>
            </View>

                <View>
                    <Text style={{ color:'#FFF' ,fontWeight:"bold" , fontSize:15}}> marcas </Text>
                </View>
      </View>
 
        {/**  */}
           <View style={{ marginTop:10}}> 
                <FlatList
                data={ dados }
                renderItem = {(i)=>  renderItem(i)  }
                keyExtractor={(i)=> i.codigo}
                />
            </View>
        {/**  */}
            <TouchableOpacity
                style={{ backgroundColor: '#185FED',  width: 50, height: 50, borderRadius: 25,  position: "absolute", bottom: 150,   right: 30,  elevation: 10,  alignItems: "center", justifyContent: "center", zIndex: 999,             // Garante que o botão fique sobre os outros itens
                }}
                onPress={() => {
                    navigation.navigate('cadastro_marcas')
                }}
            >
                <MaterialIcons name="add-circle" size={45} color="#FFF" />
            </TouchableOpacity>

        </View>
    )
}