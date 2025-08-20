import { Alert, Button, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useServices } from "../../database/queryServicos/queryServicos";
import { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useApi from "../../services/api";
import { LodingComponent } from "../../components/loading";
import { configMoment } from "../../services/moment";
import { FontAwesome5, Octicons } from "@expo/vector-icons";
import { defaultColors } from "../../styles/global";


type servico  = {
    codigo:number | undefined,
    aplicacao:string | undefined,
    valor:number | undefined ,
      data_cadastro : string| undefined,
      data_recadastro : string | undefined,
      tipo_serv : number | undefined ,
}
export function Servicos({navigation}){

    const useQueryServices = useServices();
    
    const [ pesquisa, setPesquisa ] = useState(1);
    const [ dados , setDados ] = useState();
    const [ sSelecionado, setsSelecionado ] = useState<servico>();
    const [ visible, setVisible ] = useState(false);
    const [ loading , setLoading ] = useState(false);

    const api = useApi();
     const dateService = configMoment();

    useEffect(()=>{

        async function filtrar(){
            const response = await useQueryServices.selectByDescription(pesquisa, 10);
            if(response.length > 0  ){
                setDados(response)
            }
        }

       filtrar();

    },[ pesquisa ])


    function handleSelect(item:servico){
        setsSelecionado(item);
        setVisible(true)
        console.log(item)
    }

    function handleAplicacao(aplicacao:any){
        setsSelecionado((prev)=>{

            return { ...prev, aplicacao: String(aplicacao) }
        })
    }

    
    function handleValor(valor:any){
        setsSelecionado((prev)=>{
            return { ...prev, valor:Number(valor)}
        })
    }
    
async function gravar(){
    try{
        
        setLoading(true);

        let result = await api.put('/servico', sSelecionado);

        let data:servico  =
        {
            aplicacao:sSelecionado?.aplicacao,
            codigo:sSelecionado?.codigo,
            tipo_serv:sSelecionado?.tipo_serv,
            valor:sSelecionado?.valor,
            data_cadastro: sSelecionado?.data_cadastro,
            data_recadastro:dateService.dataHoraAtual()
        } 

        if(result.status === 200 ){

            try{
              let resultDb = await useQueryServices.update(data);
                }catch(e){
            return Alert.alert('Erro!', 'Erro ao Tentar registrar serviço no banco local!');
            }

            setVisible(false)

            return Alert.alert('', ` Serviço: ${sSelecionado?.aplicacao} Alterado Com Sucesso! ` );
        }

        console.log(' obj ',data)

    }catch(e){
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

    function renderItem({item}){
        return(
            <TouchableOpacity 
                onPress={ ()=> handleSelect(item) }
                style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%'}}
             >
               <Text style={{ fontWeight:"bold", flex: 1, fontSize:15, color: defaultColors.gray }}>
                  Codigo: {item.codigo}
               </Text>
            <FontAwesome5 name="tools" size={24} color="#185FED" />
               <Text style={{ fontWeight:"bold", flex: 1, fontSize:15, color: defaultColors.gray }}>
                 {item.aplicacao}
               </Text>
               <Text style={{ fontWeight:"bold", flex: 1, fontSize:15, color: defaultColors.gray }}>
                 R$ {item.valor}
               </Text>
               
            </TouchableOpacity>
        )
    }


    return(
        <View style={{ flex:1 ,    backgroundColor:'#EAF4FE', width:"100%"  }}>
            
            <LodingComponent isLoading={loading} />

        <View style={{ backgroundColor:'#185FED', }}> 
           <View style={{   padding:15,  alignItems:"center", flexDirection:"row", justifyContent:"space-between" }}>
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
               <Text style={{   left:5, bottom:5, color:'#FFF' ,fontWeight:"bold" , fontSize:20}}> Serviços </Text>
         </View>
         
        {/*          */}
        <Modal transparent={true} visible={ visible && visible}>
        <View style={{ width:'100%',height:'100%', alignItems:"center", justifyContent:"center", backgroundColor: 'rgba(50,50,50, 0.5)'}} >
            
            <View style={{ width:'96%',height:'97%', backgroundColor:'#FFF', borderRadius:10}} >
                
                    <View style={{ margin:8}}>
                         
                             
                                   <TouchableOpacity
                                        style={{ backgroundColor: '#185FED', padding: 7, margin:5 ,width: '15%', alignItems: "center", justifyContent: "space-between", borderRadius: 10,   flexDirection:"row"  }}
                                        onPress={()=>setVisible(false)}
                                    >
                                        <Text style={{ fontWeight: "bold", color: "#FFF"  }}>voltar</Text>
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
                            <Text style={styles.text}> Codigo: </Text>
                            <Text   style={{ fontWeight:"bold"}}> {sSelecionado?.codigo} </Text>

                        </View>   

                
                    </View>
                    
                        <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5  , padding:5}}>
                        
                            <Text style={styles.text}> valor: R$ </Text>
                            
                            <TextInput
                            style={{ backgroundColor:'#fff', elevation:3 , width:'80%',borderRadius:5,  alignContent:"flex-start",   }}
                            defaultValue={ sSelecionado ? String(sSelecionado?.valor)  : '0'  }
                            onChangeText={ (v)=>   handleValor(v)}
                            placeholder="R$: 0,00"
                            />
                        </View>   


                            <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5  , padding:5}}>

                                    <Text style={styles.text} >Aplicação: </Text>
                            
                            <TextInput
                            style={{ backgroundColor:'#fff', elevation:3 , width:'100%',borderRadius:5,  alignContent:"flex-start", }}
                            defaultValue={ sSelecionado?.aplicacao }
                            onChangeText={ (v)=> handleAplicacao(v)}
                            placeholder="R$: 0,00"
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


        <View style={ { marginTop:4} } > 
             <FlatList
                 data={dados}
                 renderItem={(item)=> renderItem(item)}
                 keyExtractor={(i)=>i.codigo}
             />
            </View>

            <TouchableOpacity
                style={{
                    backgroundColor: '#185FED', 
                    width: 50, 
                    height: 50,   
                    borderRadius: 25,  
                    position: "absolute",       
                    bottom: 150,                 
                    right: 30,                   
                    elevation: 10,               
                    alignItems: "center", 
                    justifyContent: "center",
                    zIndex: 999,             // Garante que o botão fique sobre os outros itens
                }}
                onPress={() => {
                     navigation.navigate('cadastro_servico')
                }}
            >
                <MaterialIcons name="add-circle" size={45} color="#FFF" />
            </TouchableOpacity>
        
        </View>
    )
}
const styles = StyleSheet.create({
    text:{
         fontWeight:"bold" , color:'#868686' 
    }
})