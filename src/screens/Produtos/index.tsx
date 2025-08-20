import { View , Text, TextInput, FlatList, Modal, Button, Image, TouchableOpacity, ActivityIndicator} from "react-native";
import { produto, useProducts } from "../../database/queryProdutos/queryProdutos";
import { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFotosProdutos } from "../../database/queryFotosProdutos/queryFotosProdutos";
import { RenderItem } from "./components/renderItem";
import { defaultColors } from "../../styles/global";

export function Produtos ( {navigation}:any ){
  
    const useQueryProdutos = useProducts();
    const useQueryFotos = useFotosProdutos();

    const [ pesquisa, setPesquisa ] = useState<string>('');
    const [ dados , setDados ] = useState<produto[]>();
    const [ pSelecionado, setpSelecionado ] = useState<produto>();
    const [ visible, setVisible ] = useState(false);
    const [ loadingItens, setLoadingItens  ] = useState(false);

type fotoProduto =
 {
    produto: number,
    sequencia:number,
    descricao:string,
    link:string,
    foto:string,
    data_cadastro:string,
    data_recadastro:string 
 }

    async function filterByDescription(){
        const response:any = await useQueryProdutos.selectByDescription(pesquisa, 10);

        for( let p of response ){
            let dadosFoto:any = await useQueryFotos.selectByCode(p.codigo)   
            if(dadosFoto?.length > 0 ){
                p.fotos = dadosFoto
            }else{
                p.fotos = []
            }
        }

        if(response.length > 0  ){
            setDados(response)
        }
    }

    async function filterAll(){
        const response:any = await useQueryProdutos.selectAllLimit(25);
        for( let p of response ){
            let dadosFoto:any = await useQueryFotos.selectByCode(p.codigo)   
            if(dadosFoto?.length > 0 ){
                p.fotos = dadosFoto
            }
        }
        if(response.length > 0  ){
            setDados(response)
        }
        console.log('  filterAll carregando produtos ....');
    }


///////
   useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
       if( pesquisa !== null || pesquisa !== '' ){
         filterByDescription()
       }else{
         filterAll()
       }

        filterAll()

    });

    return unsubscribe;
  }, [navigation]);

///////

useEffect(()=>{
    filterByDescription()
},[  pesquisa])

        type prop =  {  produto: produto }  

        function handleSelect(item:produto){
                setpSelecionado(item);
            //setVisible(true)
            navigation.navigate('cadastro_produto',{
                codigo_produto:item.codigo
            })
        }

     
     
     return  (

      <View style={{ flex:1 ,    backgroundColor:'#EAF4FE', width:"100%"  }}>
          <View style={{ backgroundColor: defaultColors.darkBlue, }}> 
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
                 <Text style={{   left:5, bottom:5, color:'#FFF' ,fontWeight:"bold" , fontSize:20}}> Produtos </Text>
           </View>
             
             { 
                <Modal transparent={true} visible={ visible }>
                    <View style={{ width:'100%',height:'100%', alignItems:"center", justifyContent:"center", backgroundColor: '#FFF'}} >
                        <View style={{ width:'96%',height:'97%', backgroundColor:'#E0E0E0', borderRadius:10}} >
                            
                                <View style={{ margin:8}}>
                                       <Button
                                        onPress={()=>setVisible(false)}
                                        title="Voltar"
                                    />
                                </View>

                                 <View style={{ margin:10, gap:15, flexDirection:"row"}}>

                          {     pSelecionado?.fotos &&  pSelecionado?.fotos.length > 0 && pSelecionado?.fotos[0].link &&
                                          (
                                            <Image
                                                    source={{ uri: `${pSelecionado?.fotos[0].link}` }}
                                                    // style={styles.galleryImage}
                                                    style={{ width: 70 , height: 70   }}
                                                    resizeMode="contain"
                                                    />
                                           )  
                                         }


                                     <View style={{ backgroundColor:'#fff', borderRadius:5, height:25, elevation:5 }}>
                                         <Text style={{ fontWeight:"bold" }} > Codigo: {pSelecionado?.codigo} </Text>
                                     </View>   

                                     <View style={{ backgroundColor:'#fff', borderRadius:5, height:25, elevation:5 }}>
                                       <Text> R$ {pSelecionado?.preco ? pSelecionado?.preco.toFixed(2) : 0.00 } </Text>
                                     </View>   
                                 </View>
  
                                        <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                          <Text>{pSelecionado?.descricao}</Text>
                                        </View>
                                       
                                        <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                            <Text> Estoque: {pSelecionado?.estoque} </Text>
                                        </View>

                                         <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                             <Text>SKU: {pSelecionado?.sku}</Text>
                                         </View>
                                         <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                             <Text>GTIN: {pSelecionado?.num_fabricante}</Text>
                                         </View>

                                        <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                             <Text>Referencia: {pSelecionado?.num_original}</Text>
                                        </View>
                                             
                                       <View style={{ flexDirection:"row", justifyContent:"space-between"}} > 
                                            <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                 <Text>Marca: {pSelecionado?.marca}</Text>
                                            </View>
                                            <View style={{ margin:7, backgroundColor:'#FFF', borderRadius:5, elevation:5 , padding:5}}>
                                                 <Text>Grupo: {pSelecionado?.grupo}</Text>
                                            </View>
                                       </View>
                                        
                         </View>    

                    </View>

                </Modal> 
              }

    {   
     loadingItens ? (
        <ActivityIndicator size={40} color={defaultColors.darkBlue}  />
     ):  
 
           dados && dados.length> 0 &&
             <FlatList
                 data={dados}
                 renderItem={( {item} )=> < RenderItem  item={item}  handleSelect={handleSelect} /> }
               //   renderItem={( {item} )=> <RenderTeste item={item} /> }
                 keyExtractor={(i)=> i.codigo.toString()}
             /> 
     }

            <TouchableOpacity
                style={{
                    backgroundColor: defaultColors.darkBlue, width: 50, height: 50,  borderRadius: 25,  position: "absolute",  bottom: 150,  right: 30,  elevation: 10,   alignItems: "center", justifyContent: "center",zIndex: 999,             // Garante que o botão fique sobre os outros itens
                }}
                onPress={() => {
                    navigation.navigate('cadastro_produto')
                }}
            >
                <MaterialIcons name="add-circle" size={45} color="#FFF" />
            </TouchableOpacity>


      </View> )   

      
     
}
 