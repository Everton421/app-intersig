import { useContext, useEffect, useState } from "react";
import { View,Text, TouchableOpacity, Modal, Button } from "react-native"
import { FlatList, TextInput } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { api } from "../../services/api";
import { ConnectedContext } from "../../contexts/conectedContext";

export const Produtos = ()=>{
    const [pesquisa, setPesquisa] = useState();
    const [produtos, setProdutos] = useState<any>();
    const [selectedItem, setSelectedItem] = useState<any>({})
    const [visible, setVisible] = useState(false);
    const [selectedSetor, setSelectedSetor] = useState<any>();

    const [descricaoSistema, setDescricaoSistema] = useState<any>();
    const [skuSistema, setSkuSistema] = useState<any>();
    const [setor , setSetor] = useState([]);
    const [saldoTotal, setSaldoTotal]= useState(0);
    const [tabelasProduto, setTabelasProduto] = useState([]);

   



    useEffect(
        () => {
            async function busca() {
                try {
                    if(!pesquisa){
                        setProdutos(null)
                    }
                    const aux = await api.get(`/acerto/produtos/${pesquisa}`);
                    setProdutos(aux.data);
                } catch (err) {
                    console.log(err)
                }
            }
            busca();
        }, [pesquisa]
    )
    useEffect( ()=>{
        async function busca(){
                    try {
                        const response = await api.get(`/acerto/produtoSetor/${selectedItem.codigo}`);
                        setSetor(response.data);
                        
                    } catch (err) {
                        console.log(err,"erro");
                    }
                    try {
                    const response2 = await api.get(`/acerto/produtoPreco/${selectedItem.codigo}`);
                      setTabelasProduto(response2.data);
                   //   console.log(response2.data)
                  } catch (err) {
                    console.log(err,"erro");
                }
                }
                busca();
    },[selectedItem]
    )

useEffect(()=>{
    
},[])


    function adicionaPesquisa(dado:any) {
        setPesquisa(dado);
    }
    function selectProduto(item:any){
        setVisible(true);
        setSelectedItem(item)
        setDescricaoSistema(item.descricao);
        setSkuSistema(item.sku)
    }

    function saldoProdutos(item:any){
        return(
            <View style={{flexDirection:'row'}}>
                 <Text style={{fontWeight:"bold"}}>
                       setor: {item.nome}   </Text>
                 <Text style={{fontWeight:"bold"}}>
                       saldo: {item.estoque}</Text> 
            </View>
        )
    }
    function precoProdutos(item:any){
        return(
            <View style={{flexDirection:'row'}}>
                 <Text style={{fontWeight:"bold"}}>
                       tabela: {item.tabela}   </Text>
                 <Text style={{fontWeight:"bold"}}>
                       preco: {item.preco}</Text> 
            </View>
        )
    }


    function renderItem(item: any) {
        return (
            <TouchableOpacity style={ { backgroundColor: '#FFF', //#dcdcdd
            marginTop:25,
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
            borderRadius: 5,
            elevation:8
        } }
            onPress={()=> selectProduto(item)}
            >
                <Text
                style={{fontWeight:'bold'}}
                >CODIGO: {item.codigo} </Text>
                <Text style={{fontWeight:'bold'}}>  {item.descricao}</Text>
                <Text style={{fontWeight:'bold'}}> SKU:  {item.sku}</Text>
            </TouchableOpacity>
        )
    }


    return(
        <View >
        <View style={{ alignItems:'center', padding:8 }} >
            <TextInput  placeholder="pesquisa" onChangeText={(value) => adicionaPesquisa(value)} 
                style={{width:"75%",  backgroundColor:"#FFF", padding:5,  borderRadius:10,  elevation:5}}
            />
        </View>

        <Modal visible={visible}>
            
            <View style={{backgroundColor:'#3332', flex:1}}>

                <View style={{ margin:10}}>
            <TouchableOpacity onPress={()=> setVisible(false)}  
            style={{margin:5, borderWidth:1, borderColor:"red",borderRadius:4,backgroundColor:"#FFF", elevation:4, width:50}}
                >
                <Text style={{color:'red'}}> voltar</Text>
            </TouchableOpacity>

                <Text style={{fontWeight:"bold"}}>
                   Codigo: {selectedItem.codigo}
                </Text>
          
                <TextInput
                     style={{backgroundColor:'#FFF', borderRadius:5,padding:3, maxWidth:'90%',margin:5, elevation:4}}
                     numberOfLines={3}
                     multiline={true}
                     value={descricaoSistema}
                     onChangeText={(v)=> setDescricaoSistema(v)}
                     /> 
        </View>
              
               <View style={{flexDirection:'row',margin:5, alignItems:'center'}}>
               <Text style={{fontWeight:"bold"}}>
                      Sku: 
                  </Text>
                     <TextInput
                     style={{backgroundColor:'#FFF', borderRadius:5,padding:3,margin:5,minWidth:"80%",elevation:4}}
                     numberOfLines={2}
                     multiline={true}
                     value={skuSistema}
                     onChangeText={(v)=> setSkuSistema(v)}
                     /> 
                </View>
               {/**  <Text style={{fontWeight:"bold"}}>saldo total:  {saldoTotal} </Text>


*/}
                 {/** linha separadora */}
                <View style={{alignItems:'center'}}>
                    <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 10, width: '98%' }} />
                </View>
                
                {/** lista  dos saldos */}
        <View style={{margin:5}}>
                <FlatList
                data={setor}
                renderItem={({item})=>saldoProdutos(item)}
                />
        </View>                
                {/** linha separadora */}
                <View style={{alignItems:'center'}}>
                    <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 10, width: '98%' }} />
                </View>

                {/** lista  de precos */}
                <View style={{margin:5}}>

                    {
                        !tabelasProduto.length ? <Text>não encontrado tabela de preço deste produto!</Text>
                        : (
                            <FlatList
                            data={tabelasProduto}
                            renderItem={({item})=>precoProdutos(item)}
                            />

                        )
                    }
                </View>
              

            </View>
        
        </Modal>


        <FlatList
            data={produtos}
            renderItem={({ item }) => renderItem(item)}
        />

       
    </View>
    )
}