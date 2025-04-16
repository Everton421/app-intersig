import React, { useCallback, useContext, useEffect, useState } from "react"
import { Alert, Button, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors"
import { useCategoria } from "../../database/queryCategorias/queryCategorias"
import { useMarcas } from "../../database/queryMarcas/queryMarcas"
import { RenderModalCategorias } from "./modalCategorias"
import { RenderModalMarcas } from "./modalMarcas"
import useApi from "../../services/api"
import NetInfo from '@react-native-community/netinfo';
import Entypo from "@expo/vector-icons/Entypo";
import { ConnectedContext } from "../../contexts/conectedContext"
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons"
import { useProducts } from "../../database/queryProdutos/queryProdutos"
import { useRoute } from "@react-navigation/native"
import { useFotosProdutos } from "../../database/queryFotosProdutos/queryFotosProdutos"
import { Modal_fotos } from "./modalFotos"
import { typeFotoProduto } from "./types/fotos"
 
export const Cadastro_produto: React.FC  = ( { route, navigation }:any ) => {

    const [ marcaSelecionada, setMarcaSelecionada ] = useState(0); 
    const [ categoriaSelecionada, setCategoriaSelecionada ] = useState(0); 
    const [ estoque, setEstoque ] = useState<number>(0);
    const [ preco, setPreco ] = useState<number>(0);
    const [ sku, setSku ] = useState<string>('');
    const [ descricao, setDescricao] = useState<string>('');
    const [ gtim, setGtim ] = useState<string>('');
    const [ referencia, setReferencia ] = useState<string>('');


    const [visible, setVisible] = useState<Boolean>(false);
    const [link, setLink] = useState("");
    const [fotos, setFotos] = useState<typeFotoProduto[]>([]);

    const [produto, setProduto] = useState();
    const [ imgs, setImgs] = useState<typeFotoProduto[]>();

    const useQueryProdutos = useProducts();
    const api = useApi();
    const {connected,  setConnected} = useContext(ConnectedContext)
    const useQueryFotos = useFotosProdutos();

    let { codigo_produto } =   route.params || { codigo_produto : 0};

 

    function delay(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      

    async function carregarProduto(){
        if( codigo_produto && codigo_produto > 0 ){
        let dataProd:any= await useQueryProdutos.selectByCode(codigo_produto);
            let dadosFoto:any = await useQueryFotos.selectByCode(codigo_produto)   
            dataProd[0].fotos = dadosFoto;
            setImgs(dadosFoto)
        let prod:any = dataProd[0]  
        setProduto(prod)
        if(dataProd.length > 0 ){
                setCategoriaSelecionada(prod.categoria);
                setMarcaSelecionada(prod.marca);
                setReferencia(prod.num_original)
                setEstoque(prod.estoque);
                setPreco( Number(prod.preco));
                setSku(prod.sku);
                setDescricao(prod.descricao)
                setGtim(prod.num_fabricante)
            }

        }
    }


///////////////////
    useEffect(() => {
            function setConexao(){
           const unsubscribe = NetInfo.addEventListener((state) => {
                   setConnected(state.isConnected);
                   console.log('conexao com a internet :', state.isConnected);
              });
           // Remove o listener quando o componente for desmontado
           return () => {
               unsubscribe();
           };
       }
       setConexao();
        carregarProduto();
       }, []);
///////////////////
   

    async function gravar (){
      
        if( connected === false ) return Alert.alert('Erro', 'É necessario estabelecer conexão com a internet para efetuar o cadastro !');

        if(!preco) setPreco(0);
        if(!estoque) setEstoque(0);
        if(!sku) setSku('');
        if(!referencia) setReferencia('');
        if(!marcaSelecionada) return Alert.alert('É necessario informar uma marca para gravar o produto!');
        if(!categoriaSelecionada) return Alert.alert('É necessario informar uma categoria para gravar o produto!');


        if( codigo_produto > 0 || codigo_produto){
            let responseApi
                try{
                    let obj = { codigo: codigo_produto, fotos: imgs};
                    responseApi = await api.post('/offline/fotos', obj);
                    console.log(responseApi.data)
                }catch(e){
                    console.log(e);
                    return Alert.alert('Erro', 'ocorreu um erro ao tentar cadastrar/atualizar as fotos do produto! ')
                }


                let imgsProd:typeFotoProduto[] = await useQueryFotos.selectByCode(codigo_produto);
                if ( imgsProd.length > 0 ||imgs?.length === 0  ){
                    await useQueryFotos.deleteByCodeProduct(codigo_produto);
                }  
                if(imgs?.length === 0 ){
                    setImgs(imgsProd)
                }
               imgs?.forEach( async ( f:typeFotoProduto )=>{
                    await useQueryFotos.create(f)
               })     
               Alert.alert("" ,"Produto alterado com sucesso")
               await delay(300)
               navigation.goBack();
                 
        }else{

        let data =   { 
                    "preco":preco,
                    "estoque":estoque,
                    "descricao":descricao,
                    "sku":sku,
                    "referencia":referencia,
                    "marca":marcaSelecionada.codigo,
                    "grupo":categoriaSelecionada.codigo
                }

                let response =   await api.post('/produtos', data)
                if(response.data.codigo > 0 ){

                    try{
                           await useQueryProdutos.createByCode(response.data, response.data.codigo)
                           Alert.alert(`Produto ${descricao} registrado com sucesso!`)
                        setTimeout(()=>{},1000)
                        navigation.goBack()
                    }catch(e){
                        console.log(" ocorreu um erro ao cadastrar o produto ",e)
                    }
             }
        }
    }
    const renderImgs = ({ item }: { item: typeFotoProduto }) => {
        return (
          <View style={{ margin: 5, padding: 4, borderRadius: 10, backgroundColor: "#FFF", elevation: 3 }}>
            <TouchableOpacity onPress={() => deleteItemListImgs(item)}>
              <AntDesign name="closecircle" size={24} color="red" />
            </TouchableOpacity>
            {item.foto && item.link ? (
              <Image
                source={{ uri: `${item.link}` }}
                style={{ width: 120, height: 120, borderRadius: 5 }}
                resizeMode="contain"
              />
            ) : null}
          </View>
        );
      };
    
      
  const deleteItemListImgs = (item:typeFotoProduto) => {
    setImgs((prev: any) => {
      let aux = prev.filter((i: typeFotoProduto) => i.sequencia !== item.sequencia);
        setFotos(aux);
       return aux;
    });
  };
      const gravarImgs = () => {
        if (link === "") return;
      
        let sequencia = imgs.length > 0 ? Math.max(...imgs.map((i) => i.sequencia)) + 1 : 1;
      
        const newImage: typeFotoProduto = {
          produto: codigo_produto,
          data_cadastro: "0000-00-00",
          data_recadastro: "0000-00-00 00:00:00",
          descricao: link,
          foto: link,
          link: link,
         
          sequencia: sequencia,
        };
      
          setImgs((prev: any) => {
              const aux = [...prev,newImage]
                 setFotos(aux)
             return aux
            });
    
          setLink('');
      };
    

    return (
        <View style={{ flex: 1 }}>
 
          <View style={{ flex: 1 ,width: '100%',  backgroundColor: '#EAF4FE' }} >
                <View style={{ margin: 10, gap: 15, flexDirection: "row" }}>
                    
                                        
                                       { /*produto && produto?.fotos[0] ?
                                        (   <Modal_fotos  imgs={imgs} codigo_produto={codigo_produto} setImgs={ setImgs} />   )
                                        :(   <Modal_fotos  imgs={[]} codigo_produto={codigo_produto} setImgs={ setImgs}  />   )
                                        */}
                            <TouchableOpacity onPress={() => setVisible(true)}>
                                <View style={{ margin: 2 }}>
                                {imgs && imgs.length > 0 ? (
                                    <Image
                                    source={{ uri: `${imgs[0].link}` }}
                                    style={{ width: 100, height: 100, borderRadius: 5 }}
                                    resizeMode="contain"
                                    />
                                ) : (
                                    <MaterialIcons name="no-photography" size={100} color="black" />
                                )}
                                </View>
                            </TouchableOpacity>
                                                        <Modal visible={visible} transparent={true}>
                                                                <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", flex: 1 }}>
                                                                <View style={{ backgroundColor: "#FFF", flex: 1, margin: 15, borderRadius: 15, height: "80%" }}>
                                                                    <View style={{ backgroundColor: "#FFF" }}>
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                        setVisible(false);
                                                                        }}
                                                                        style={{
                                                                        margin: 15,
                                                                        backgroundColor: "#185FED",
                                                                        padding: 7,
                                                                        borderRadius: 7,
                                                                        width: "20%",
                                                                        elevation: 5,
                                                                        }}
                                                                    >
                                                                        <Text style={{ color: "#FFF", fontWeight: "bold" }}>voltar</Text>
                                                                    </TouchableOpacity>
                                                                    </View>

                                                                    <View style={{ alignItems: "center" }}>

                                                                    {imgs && imgs.length > 0 && (
                                                                        <FlatList
                                                                        data={imgs}
                                                                        keyExtractor={(item) => String(item.sequencia)}
                                                                        renderItem={renderImgs}
                                                                        horizontal={true}
                                                                        />
                                                                    )}
                                                                    </View>
                                                                    <View style={{ alignItems: "center" }}>
                                                                        {link !== "" ? (
                                                                        <View style={{ margin: 10 }}>
                                                                            <Image style={{ width: 100, height: 100 }} source={{ uri: `${link}` }} />
                                                                        </View>
                                                                        ) : (
                                                                        <View style={{ margin: 10 }}>
                                                                            <Entypo name="image" size={54} color="#185FED" />
                                                                        </View>
                                                                        )}
                                                                        <TextInput
                                                                        style={{ borderWidth: 1, width: "90%", padding: 10, borderRadius: 5 }}
                                                                        placeholder="https://reactnative.dev/img/tiny_logo.png"
                                                                        onChangeText={(v) => {
                                                                            setLink(v);
                                                                        }}
                                                                        value={link}
                                                                        />
                                                                        <TouchableOpacity style={{ padding: 5, alignItems: "center" }} onPress={() => gravarImgs()}>
                                                                        <Entypo name="arrow-with-circle-up" size={35} color="#185FED" />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                                </View>
                                                     </Modal>



                    <View style={{ gap:10}}>
                            <View style={{ alignItems:"center", flexDirection:"row", width: '50%',backgroundColor: '#fff' , padding:2,borderRadius: 5,  elevation: 5}}>
                                    <Text style={{fontWeight:"bold"}} > codigo: {codigo_produto} </Text>
                            </View>

                        <View style={{ alignItems:"center", flexDirection:"row", width: '50%',backgroundColor: '#fff' ,borderRadius: 5,  elevation: 5}}>
                        <Text style={{fontWeight:"bold"}} > Preço:$ </Text>
                                    <TextInput
                                    onChangeText={(v)=> setPreco( v )}
                                    style={{ height:30,backgroundColor:'#FFF', width: '50%'}}
                                    keyboardType="numeric"
                                    value={String(preco.toFixed(2))}
                                    />

                            </View>

                            <View style={{ alignItems:"center", flexDirection:"row", width: '50%',backgroundColor: '#fff' ,borderRadius: 5,  elevation: 5}}>
                                <Text style={{fontWeight:"bold"}} > Estoque: </Text>
                                    <TextInput
                                    onChangeText={(value)=> setEstoque( value )}
                                    style={{ height:30,backgroundColor:'#FFF', width: '50%'}}
                                    keyboardType="numeric"
                                    value={String( estoque )}

                                    />
                            </View>

                        </View>

                </View>

                <View style={{ margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 5 }}>
                    <TextInput
                         onChangeText={(value)=> setDescricao( value )}
                        style={{ padding: 5, backgroundColor: '#FFF' }}
                        placeholder="descrição"
                        value={String(descricao)}
                    />
                </View>
               
                <View style={{ margin: 7, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 35, elevation: 5 }}>
                    <Text > SKU: </Text>
                        <TextInput
                                onChangeText={(value)=> setSku( value )}
                                value={String(sku)}
                            />
                    </View>
                <View style={{ margin: 7, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 35, elevation: 5 }}>
                    <Text > Cod.Barras: </Text>
                        <TextInput
                                onChangeText={(value)=> setGtim( value )}
                                value={String(gtim)}
                        />
                </View>
                <View style={{ margin: 7, backgroundColor: '#fff', alignItems: "center", justifyContent: "flex-start", flexDirection: "row", borderRadius: 5, height: 35, elevation: 5 }}>
                    <Text > Referencia: </Text>
                            <TextInput
                                onChangeText={(value)=> setReferencia( value )}
                                value={ referencia ? String(referencia) : '' }
                            />
                </View>

                <Text style={{marginLeft:5}} > { marcaSelecionada && 'Marca:'}</Text> 

                 <View style={{ flexDirection:"row" }}>
                    <RenderModalMarcas codigoMarca={  produto ? produto.marca : 0  } setMarca={setMarcaSelecionada} />
                 </View>  

                <Text style={{marginLeft:5}} > { categoriaSelecionada && 'Categoria:'}</Text> 

                 <View style={{ flexDirection:"row" }}>
                    <RenderModalCategorias  codigoCategoria={ produto ? produto.grupo : 0}  setCategoria={setCategoriaSelecionada}  />
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
    )
}