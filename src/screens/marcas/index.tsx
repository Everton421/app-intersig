import { Text, View ,TouchableOpacity, TextInput, FlatList, Modal, Image, Alert} from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from "react";
import { useMarcas } from "../../database/queryMarcas/queryMarcas";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../../services/api";
import { LodingComponent } from "../../components/loading";
import { configMoment } from "../../services/moment";

export const Marcas = ({navigation}:any)=>{
    const [ press, setPress ] = useState(false);
    const [ dados, setDados ] = useState([]);
    const [ pesquisa, setPesquisa ] = useState<string | undefined>('');
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ marcaSelecionada, setMarcaSelecionada ] = useState();
    const [ loading , setLoading ] = useState(false);

    const useQueryMarcas = useMarcas();
    const api = useApi();
         const dateService = configMoment();
    
    useFocusEffect(
                ()=>{
                    
                    async function busca(){ 
                            let data:any  = await useQueryMarcas.selectAll();
                            if( data?.length > 0  ){
                                setDados(data) 
                            }   
                        }

                    if( pesquisa === '' || pesquisa === undefined){
                        busca();
                    }
                } 
            )
 
            useEffect(
                ()=>{   
                    async function busca(){
                        let data:any  = await useQueryMarcas.selectByDescription(pesquisa);
                        if( data?.length > 0  ){
                            setDados(data) 
                        }  
                    }
                    if( pesquisa !== '' || pesquisa !== undefined){
                    busca();
                }
                },[ pesquisa ]
            )



        function handleSelect(item){
            setVisible(true);
            setMarcaSelecionada(item)
        }

    function renderItem({item}){
        return(
            <TouchableOpacity 
                 onPress={ ()=> handleSelect(item) }
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


async function gravar(){
    try{
        
        setLoading(true);
        let objmarca = {
                    "codigo": marcaSelecionada.codigo,
                    "descricao": marcaSelecionada.descricao,
                    "data_cadastro": marcaSelecionada.data_cadastro,
                    "data_recadastro": dateService.dataHoraAtual(),
                    "id": marcaSelecionada.id
                    }
        let result = await api.put('/marca', objmarca);
        
        if(result.status === 200 ){
            try{
              let resultDb = await useQueryMarcas.update(objmarca, marcaSelecionada.codigo);
                }catch(e){
            return Alert.alert('Erro!', 'Erro ao Tentar registrar serviço no banco local!');
            }
            setVisible(false)
            return Alert.alert('', ` Marca: ${marcaSelecionada?.descricao} Alterado Com Sucesso! ` );
        }


    }catch(e:any){
        if(e.status === 400 ){
            return Alert.alert('Erro!', e.response.data.msg);
        } else{
            console.log(e)
            return Alert.alert('Erro!', 'Erro desconhecido!');

        }  
    }finally{
        setLoading(false);
    }
}

    return(

        <View style={{   flex:1,  backgroundColor:'#EAF4FE'}} >
                   <LodingComponent isLoading={loading} />
       
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
                 <Text style={{   left:5, bottom:5, color:'#FFF' ,fontWeight:"bold" , fontSize:20}}> Marcas </Text>
                </View>
      </View>
 
            {/*          */}
                 <Modal transparent={true} visible={ visible && visible}>
                 <View style={{ width:'100%',height:'100%', alignItems:"center", justifyContent:"center", backgroundColor: 'rgba(50,50,50, 0.5)'}} >
                     <View style={{ width:'96%',height:'97%', backgroundColor:'#FFF', borderRadius:10}} >
                             <View style={{ margin:8}}>
                                          <TouchableOpacity
                                                     onPress={()=>setVisible(false)}
                                                     style={{    margin: 10,  backgroundColor: "#009de2",    padding: 7,  borderRadius: 7,    width: "20%",    elevation: 5,   }}
                                                   >
                                                     <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                                                       voltar
                                                     </Text>
                                                   </TouchableOpacity>
                             </View>
         
                             <View style={{ margin:10, gap:15, flexDirection:"row"}}>
                                 <Image
                                     style={{ width: 70 , height: 70   }}
                                     source={{
                                         uri:'https://reactnative.dev/img/tiny_logo.png' 
                                     }}
                                     />
                                 <View style={{ backgroundColor:'#fff', borderRadius:5, height:25,flexDirection:"row", elevation:5 }}>
                                     <Text style={{}}> Codigo: </Text>
                                     <Text   style={{ fontWeight:"bold"}}> { marcaSelecionada?.codigo  } </Text>
         
                                 </View>   
                             </View>
                             
                                     <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5  , padding:5}}>
                                             <Text style={{}} >Descrição: </Text>
                                     <TextInput
                                        style={{ backgroundColor:'#fff', elevation:3 , width:'100%',borderRadius:5,  alignContent:"flex-start", }}
                                        // defaultValue={ sSelecionado?.aplicacao }
                                       onChangeText={ (v)=> setMarcaSelecionada((prev) => { return { ...prev, descricao: v }} ) }
                                    defaultValue={marcaSelecionada && marcaSelecionada?.descricao}
                                        />
                                     </View>
                                     
                                                 <View style={{ flexDirection: "row", marginTop:50 ,width: '100%', alignItems: "center", justifyContent: "center" }} >
                                                         <TouchableOpacity 
                                                         style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius:  10, padding: 5 }}
                                                         onPress={()=>gravar()}
                                                         >
                                                             <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
                                                         </TouchableOpacity>
                                                     </View> 
                     </View>    
         
                 </View>
         
                 </Modal>
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