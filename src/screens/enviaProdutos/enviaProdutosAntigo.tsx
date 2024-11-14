import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ar, ScrollView, KeyboardAvoidingView } from "react-native";
import useApi from "../../services/api";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export const EnviaProdutoAntigo = () => {
    const [prod, setProd] = useState<any>();
    const [data, setData] = useState<any>();
    const [valorPesquisa, setValorPesquisa] = useState<number>();
    const [visible, setVisible] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState<any>();
    const [descricaoEditada, setDescricaoEditada] = useState("");
    
    const [marca, setMarca] = useState<any>();
    const [pesquisaMarca, setPesquisaMarca] = useState("");
    const [marcaSistama, setMarcaSistema] = useState<any>();
    
    const [grupo, setGrupo] = useState<any>();
    const [pesquisaGrupo, setPesquisaGrupo] = useState("");
    const [grupoSistama, setGrupoSistema] = useState<any>();

    const api = useApi();


    async function buscaProduto(v: number) {
        setValorPesquisa(v);
        try {
            const response = await api.get(`/produto/${v}`);
            if (response) {
                setData(response.data);
                setProd(response.data.produto);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function enviaProduto() {
        if (!data.setores) {
            data.setores = { "codigoSetor": 1, "data_recad": null, "estoque": 0, "local": "", "local1": "", "local2": "", "local3": "", "nome_setor": "ESTOQUE - FILIAL SC" }
        }
        if (descricaoEditada) {
            data.produto.descricao = descricaoEditada
            data.produto.aplicacao = descricaoEditada
        }

        if (!data.produto.outro_cod) {
            return Alert.alert('este produto nao possui um sku cadastrado!');
        }

        if( grupo.codigo ){
            data.produto.grupo = grupo.codigo;
        }

        if( marca.codigo){
        data.produto.marca = marca.codigo;
    }

        console.log(data)

        try {
            const response: any = await api.post("/produto/cadastrar", data);
            if (response.status === 200) {
                Alert.alert(`Produto cadastrado com sucesso!`, ` codigo: ` + response.data.codigo);
                setData(null);
                setProd(null);
                setVisible(false)
                 setGrupo(null)
                  setMarca(null)
            }
        } catch (err: any) {
            if (err.response && err.response.status === 500 && err.response.data.err === "Produto já cadastrado com esse SKU") {
                Alert.alert("Erro", "Produto já cadastrado com esse SKU.");
            } else {
                console.log(err);
                Alert.alert("Erro", "Falha ao enviar o produto. Por favor, tente novamente.");
            }
        }

    }


function adicionaMarca(value:any){
    setMarca(value);
    setPesquisaMarca('');
    setMarcaSistema(null)
}

    const Item = ({ item }: any) => {
        function selectedItem(item: any) {
            setVisible(true);
            setItemSelecionado(item);
            setDescricaoEditada(item?.produto?.descricao || ''); // Configurando a descrição editada ao selecionar o item
        }

        return (
            <TouchableOpacity
                onPress={() => selectedItem(item)}
                style={{ margin: 10, padding: 20, borderRadius: 5, backgroundColor: "#FFF", elevation: 3 }}
            >
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: "#020106", fontWeight: "bold" }}>Código: </Text>
                    <Text style={{ color: "#020106" }}>{item?.produto?.codigo}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                    <Text numberOfLines={3} ellipsizeMode="tail" style={{ color: "#020106", fontSize: 16 }}>{item?.produto?.descricao}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: "#020106", fontWeight: "bold" }}>SKU:  </Text>
                    <Text style={{ color: "#020106", fontWeight: "bold" }}>
                        {item?.produto?.outro_cod}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };
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



function adicionaGrupo(value:any){
    setGrupo(value);
    setPesquisaGrupo('');
    setGrupoSistema(null)
}

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


    return (
        <ScrollView style={{ backgroundColor: '#e9ecf1' }}>
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" />
                <View style={{ padding: 30, backgroundColor: "#333", elevation: 9 }}>
                    <TextInput
                        style={{ marginVertical: 10, borderWidth: 1.5, borderColor: "#FFF", backgroundColor: '#fff', padding: 5, borderRadius: 20, color: '#42414d', fontSize: 15 }}
                        placeholder="codigo:  "
                        onChangeText={(v) => buscaProduto(parseInt(v))}
                    />
                </View>

                {prod ?

                    <Item item={data} />

                    : null}

                <Modal visible={visible} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 40 }}>
                            <TouchableOpacity onPress={() => setVisible(false)} style={{ alignSelf: "flex-end", padding: 5 }}>
                                <Text style={{ color: "red" }}>Fechar</Text>
                            </TouchableOpacity>
                           
                            {itemSelecionado ?
                           
                           <View style={{ backgroundColor: "#f0f0f0", borderRadius: 7, margin: 10, padding: 20, elevation: 9 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                        <Text style={{ fontWeight: "bold", color: '#42414d' }}>Código:</Text>
                                        <Text style={{ fontSize: 15, color: '#42414d' ,fontWeight:'bold' }}>{itemSelecionado?.produto?.codigo}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                        <Text style={{ fontWeight: "bold", color: '#42414d' }}>SKU:</Text>
                                        <Text style={{ fontSize: 15, color: '#42414d', fontWeight:'bold' }}>{itemSelecionado?.produto?.outro_cod}</Text>
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
                                  

                                    <TouchableOpacity
                                    onPress={() => enviaProduto()}
                                     //onPress={()=> console.log(data)}
                                        style={{ backgroundColor: "#333", padding: 10, alignItems: "center", borderRadius: 25, elevation: 2 }}
                                    >
                                        <Text style={{ color: "white" }}>Enviar</Text>
                                    </TouchableOpacity>
                                </View>

                                : null}
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
};
