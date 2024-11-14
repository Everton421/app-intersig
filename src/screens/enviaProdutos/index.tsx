import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Button, Alert } from "react-native"
import { FlatList, TextInput } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { api } from "../../services/api";
import { StatusBar } from "expo-status-bar";

export const EnviaProduto = () => {
    const [pesquisa, setPesquisa] = useState();
    const [produtos, setProdutos] = useState<any>();
    const [selectedItem, setSelectedItem] = useState<any>({})
    const [visible, setVisible] = useState(false);
    const [selectedSetor, setSelectedSetor] = useState<any>();

    const [data, setData] = useState<any>();

    const [produto, setProduto] = useState<any>();


    const [marca, setMarca] = useState<any>();
    const [pesquisaMarca, setPesquisaMarca] = useState("");
    const [marcaSistama, setMarcaSistema] = useState<any>();

    const [itemSelecionado, setItemSelecionado] = useState<any>();
    const [descricaoEditada, setDescricaoEditada] = useState("");



    const [grupo, setGrupo] = useState<any>();
    const [pesquisaGrupo, setPesquisaGrupo] = useState("");
    const [grupoSistama, setGrupoSistema] = useState<any>();



    
    useEffect(
        ()=>{
            async function buscaGrupo(text:string){
                try{
                    const response = await api.get(`/produto/grupo/${text}`)
                    setGrupoSistema(response.data);
                    console.log(response.data);
                }catch(err){
                    console.log(err);
                }
            }
            
            if(pesquisaGrupo !== ''){
                buscaGrupo(pesquisaGrupo)
            }
          
        },[ pesquisaGrupo ]
    )
    useEffect(
        ()=>{
            async function buscaMarca(text:string){
                try{
                    const response = await api.get(`/produto/marca/${text}`)
                    setMarcaSistema(response.data);
                    console.log(response.data);
                }catch(err){
                    console.log(err);
                }
            }
            
            if(pesquisaMarca !== ''){
                buscaMarca(pesquisaMarca)
            }
          
        },[ pesquisaMarca ]
    )

    useEffect(
        () => {
            async function busca() {
                try {
                    if (!pesquisa) {
                        setProdutos(null)
                    }
                    const aux = await api.get(`/empresa2/produtos/${pesquisa}`);
                    setProdutos(aux.data);
                    //console.log(aux.data);
                } catch (err) {
                    console.log(err)
                }
            }
            busca();
        }, [pesquisa, selectedItem]
    )

    async function enviaProduto() {

         if (!produto.sku || produto.sku === '') {
            return Alert.alert('este produto nao possui um sku cadastrado!');
        }


        if(!marca ){
            console.log('é neessario informar uma marca antes de cadastrar!')
            return Alert.alert('erro', 'é neessario informar uma marca antes de cadastrar!');
        }

        if(!grupo){
            return Alert.alert('erro', 'é neessario informar um grupo antes de cadastrar!');
        }


        produto.grupo = grupo.codigo;
        produto.marca
            let objProduto =  {produto}
        
            console.log(objProduto)

            try {
                const response: any = await api.post("/produto/cadastrar", objProduto);
                if (response.status === 200) {
                    Alert.alert(`Produto cadastrado com sucesso!`, ` codigo: ` + response.data.codigo);
                    
                    setData(null);
                    setVisible(false)
                     setGrupo(null)
                      setMarca(null)
                }
            } catch (err: any) {
                if (err.response && err.response.status === 500 && err.response.data.err === "Produto já cadastrado com esse SKU") {
                    Alert.alert("Erro", "Produto já cadastrado com esse SKU.");
                    setData(null);
                    setVisible(false)
                     setGrupo(null)
                      setMarca(null)
                } else {
                    console.log(err);
                    Alert.alert("Erro", "Falha ao enviar o produto. Por favor, tente novamente.");
                }
            }
            
    
    }

    function adicionaGrupo(value: any) {
        setGrupo(value);
        setPesquisaGrupo('');
        setGrupoSistema(null)
    }

    function adicionaMarca(value: any) {
        setMarca(value);
        setPesquisaMarca('');
        setMarcaSistema(null)
    }
    function adicionaPesquisa(dado: any) {
        setPesquisa(dado);
    }
    function selecionaProduto(item: any) {
        setVisible(true);
        setProduto(item);
        setDescricaoEditada(item?.descricao || ''); // Configurando a descrição editada ao selecionar o item
    }


    function renderItem(item: any) {

        
        return (
            <TouchableOpacity style={{backgroundColor: '#FFF', marginTop: 25, padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 5, elevation: 8 }}
                onPress={() => selecionaProduto(item)}
            >
                <Text  style={{ fontWeight: 'bold' }} >CODIGO: {item.codigo} </Text>
                <Text style={{ fontWeight: 'bold' }}>  {item.descricao}</Text>
                <Text style={{ fontWeight: 'bold' }}> SKU:  {item.sku}</Text>

            </TouchableOpacity>
        )
    }


    return (
        <View style={{ backgroundColor: '#e9ecf1' }} >

{/**--------------------- input pesquisa os produtos ------------------- */}
            <View style={{ backgroundColor: '#333', alignItems: 'center', padding: 8, elevation: 9 }} >
                <TextInput placeholder="pesquisa" onChangeText={(value) => adicionaPesquisa(value)}
                    style={{ width: "75%", backgroundColor: "#FFF", padding: 5, borderRadius: 20 }}
                 />
            </View>
{/**---------------------------------------------------------------------- */}


{ /*----- lista de produtos vindos da pesquisa ----- */}
            <FlatList
                data={produtos}
                renderItem={({ item }) => renderItem(item)}
            />
{/**-------------------------------------------------- */}


{/**------------- modal onde sera exibido as configurações  para enviar o produto selecionado --------------*/}
{ selectedItem ? 
        <Modal visible={visible} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                            <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 40 }}>
                            
                                <TouchableOpacity onPress={() => setVisible(false)} style={{ alignSelf: "flex-end", padding: 5 }}>
                                    <Text style={{ color: "red" }}>Fechar</Text>
                             </TouchableOpacity>     
                                <View style={{ backgroundColor: "#f0f0f0", borderRadius: 7, margin: 10, padding: 20, elevation: 9 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                        <Text style={{ fontWeight: "bold", color: '#42414d' }}>Código:</Text>
                                        <Text style={{ fontSize: 15, color: '#42414d' ,fontWeight:'bold' }}>{produto?.codigo}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                        <Text style={{ fontWeight: "bold", color: '#42414d' }}>SKU:</Text>
                                        <Text style={{ fontSize: 15, color: '#42414d', fontWeight:'bold' }}>{produto?.sku}</Text>
                                    </View>

                        {/**---------------------------marca-------------------------------------------------------------------------- */}
                                
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                        <Text style={{ fontWeight: "bold", color: '#42414d' }}>MARCA:</Text>
                                        <Text style={{ fontWeight: "bold", color: '#42414d' }}> {marca?.descricao}</Text>
                                    </View>
                                            <TextInput
                                                    style={{backgroundColor:'#FFF',minWidth:"70%", borderRadius:5, marginBottom:30, elevation:2}}
                                                    placeholder="marca: "
                                                    onChangeText={(text) =>setPesquisaMarca(text)}
                                                    value={pesquisaMarca}
                                                />
                                            { marcaSistama ? (
                                                   <TouchableOpacity style={{ position: "absolute", top: 140, left: 20, backgroundColor: '#3339', borderRadius: 5, padding: 5 }}
                                                   onPress={() => adicionaMarca(marcaSistama)}
                                               >
                                                        <Text style={{color:'#FFF'}} > {marcaSistama.descricao}</Text> 
                                                    </TouchableOpacity>
                                                    ):  null
                                            }
                                {/**-------------------------------------------------------------------------------------------------- */}



                                { /** ------------------------------------grupo---------------------------------------------------------*/}
                              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                        <Text style={{ fontWeight: "bold", color: '#42414d' }}>GRUPO:</Text>
                                        <Text style={{ fontWeight: "bold", color: '#42414d' }}> {grupo?.nome}</Text>
                                    </View>
                                            <TextInput
                                                    style={{backgroundColor:'#FFF',minWidth:"70%", borderRadius:5, marginBottom:30,  elevation:2 }}
                                                    placeholder="grupo: "
                                                    onChangeText={(text) =>setPesquisaGrupo(text)}
                                                    value={pesquisaGrupo}
                                                />
                                            { grupoSistama ? (
                                                   <TouchableOpacity style={{ position: "absolute", top: 225, left: 20, backgroundColor: '#3339', borderRadius: 5, padding: 5 }}
                                                   onPress={() => adicionaGrupo(grupoSistama)}
                                               >
                                                        <Text style={{color:'#FFF'}} > {grupoSistama.nome}</Text> 
                                                    </TouchableOpacity>
                                                    ):  null
                                            }
                  {/**-------------------------------------------------------------------------------------------------- */}

                    {/**-------------------------------- descricao do produto ------------------------------------------------------------------ */}
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                        <Text style={{ fontWeight: "bold", color: '#42414d' }}>Descrição: </Text>
                                    </View>
                                    <TextInput
                                        style={{ borderWidth: 1, minWidth:"70%", marginBottom: 10, padding: 5, borderRadius: 5, backgroundColor: '#FFF', borderColor: "#FFF", elevation:2}}
                                        numberOfLines={5}
                                        multiline={true}
                                        value={descricaoEditada}
                                        onChangeText={(text) => setDescricaoEditada(text)}
                                        blurOnSubmit={false}
                                    />
                               </View>                               

                               
                                {/**---------------------- botao de envio--------------- */}
                                    <TouchableOpacity
                                        onPress={() => enviaProduto()}
                                       // onPress={()=> console.log(produto)}
                                        style={{ backgroundColor: "#333", padding: 10, alignItems: "center", borderRadius: 25, elevation: 2 }}
                                    >
                                        <Text style={{ color: "white" }}>Enviar</Text>
                                    </TouchableOpacity>
                                
                                </View>
                    </View>
                </Modal> 
                :null
}

        </View>
    )
}