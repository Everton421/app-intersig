import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Modal, Touchable, Button } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from 'react-native';


export const AcertoProduto = () => {
    const [produtos, setProdutos] = useState<any>();
    const [selectedItem, setSelectedItem] = useState<any>({})
    const [pesquisa, setPesquisa] = useState();
    const [visible, setVisible] = useState(false);
    const [novoSaldo, setNovoSaldo] = useState(0);
    const [prodSetores, setProdSetores] = useState<any>();

    const [prodSetor, setProdSetor] = useState();

    const [setores, setSetores] = useState();


    const [selectedSetor, setSelectedSetor] = useState<any>();
    const [saldoSistema, setSaldoSistema] = useState();
    const [estoqueSetores, setEstoqueSetores] = useState()

    const [saldoAtual, setSaldoAtual] = useState< any|undefined > ();

    const [value, setValue] = useState<any>();

    function changeSetor(item:any) {
        return (
            <View style={{flexDirection:'row',justifyContent:'center'}}>
            <TouchableOpacity onPress={() => setSelectedSetor(item)} style={{ backgroundColor: '#FFF', margin: 10, padding: 7, borderRadius: 5, flexDirection:'row',justifyContent:'space-between', width:'auto', elevation:5 }}>
                <Text style={{ fontWeight: 'bold' ,margin:3}}>
                    CODIGO: {item.codigo}
                </Text>
                <Text style={{ fontWeight: 'bold' ,margin:3}}>
                   SETOR: {item.nome}
                </Text>
                
            </TouchableOpacity>
            </View>
        )
    }

    useEffect(
        () => {
            async function busca() {
                try {
                    const aux = await api.get(`/acerto/produtos/${pesquisa}`);
                    setProdutos(aux.data);
                    //console.log(aux.data);
                } catch (err) {
                    console.log(err)
                }
            }
            busca();
                    //setSaldoSistema()
        }, [pesquisa]
    )

useEffect( ()=>{
    async function busca(){
                try {
                    const response1= await api.get(`/acerto/setores`)
                    setSetores(response1.data)

                    const response2 = await api.get(`/acerto/produtoSetor/${selectedItem.codigo}`)
                    setProdSetores(response2.data);

                } catch (err) {
                    console.log(err,"erro");
                }
            }
            busca();

},[selectedItem]
)

useEffect( ()=>{
    const aux = prodSetores?.find( (item:any)=>  item.codigo === selectedSetor?.codigo)
    console.log(aux);

    if(aux){
    setSaldoAtual(aux.estoque)
    }
  
},[selectedSetor])

//    useEffect( ()=>{
//
// async function busca(){
//                try {
//                    const response = await api.get(`/acerto/produtoSetor/${selectedItem.codigo}`)
//                    setEstoqueSetores(response.data);
//                    //console.log(response.data);
//                } catch (err) {
//                    console.log(err);
//                }
//            }
//            busca();
//        
//    },[selectedSetor])

    function closeModal() {
        setVisible(false);
        setSelectedSetor(undefined);
        setNovoSaldo(0)
    }



    function toggleSelection(item: any) {
        setVisible(true);
        setSelectedItem(item);

    }

    function adicionaPesquisa(dado:any) {
        setPesquisa(dado);
    }



  async function postAcerto(){

    if(selectedItem.estoque < 0 ||  selectedItem.estoque === undefined  ){
       return  Alert.alert("alert", "você nao informou uma quantidade !")
    }
    try{
    const response =  await api.post('/acerto/',selectedItem);
    if(response.status ==200 ){
      Alert.alert(response.data.ok, `saldo ${selectedItem.estoque}  setor: ${selectedSetor.nome}`)
      setNovoSaldo(0)
      setSelectedItem(undefined)
      setVisible(false)
    }
      setSelectedSetor(undefined);   
         
    }catch(err) {
    console.log(err)
  }
  }

  function atualizaSaldo(v: number) {
    setSaldoSistema(selectedSetor?.estoque);
    setNovoSaldo(v);
    let aux = v;
    selectedItem.estoque = aux;
    selectedItem.setor = selectedSetor.codigo

    //item.estoque = v;
}

    function renderItem(item: any) {
        return (
            <TouchableOpacity style={styles.item}
                onPress={() => toggleSelection(item)}
            >
                <Text
                >CODIGO: {item.codigo} </Text>
                <Text style={styles.txt}>  {item.descricao}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                </View>
            </TouchableOpacity>
        )
    }


    return (
        <View >

            <View style={{margin:'3%' }}  >
                <TextInput  
                style={{ backgroundColor:'#FFF',padding:5, borderRadius:10, elevation:5 }}
                placeholder="Pesquisar " 
                onChangeText={(value) => adicionaPesquisa(value)}
                 />
            </View>
            
            <Modal visible={visible} >
                <View style={{ flex: 1,  backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems:'center' ,justifyContent:'center'}}>
                           <View style={{ backgroundColor: "#f0f0f0", borderRadius: 7,   padding: 20, elevation: 9 , height:"auto",width:"95%"}}>
                             <TouchableOpacity onPress={() => closeModal()} 
                             style={{margin:5, borderWidth:1, borderColor:"red",borderRadius:4,backgroundColor:"#FFF", elevation:4, width:50}}
                             >
                                <Text style={{color:'red'}}> voltar</Text>
                            </TouchableOpacity>

                                     <Text style={{ fontWeight: 'bold' }}>
                                        CODIGO: {selectedItem?.codigo}
                                    </Text>
                                  <Text>
                                    {selectedItem?.descricao}
                                  </Text>
        {    selectedSetor !== undefined ?
                  <View >
                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                              <Text style={{ fontSize: 15, fontWeight:'bold' }} >setor: {selectedSetor?.nome}</Text>
                          </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                              <Text style={{ fontSize: 15, fontWeight:'bold'}}> novo saldo : {novoSaldo} </Text>
                              <Text style={{ fontSize: 15, fontWeight:'bold'}}> saldo atual :  {saldoAtual} </Text>


                              
                            {/** <Text style={{ fontSize: 15, fontWeight:'bold', color: '#42414d'}} >saldo atual: {saldoSistema}</Text>
                         */}
                         </View>

                       <View style={{ alignItems: 'center' }}>
                            <TextInput style={{ backgroundColor:'#FFF', marginTop: 5, borderRadius: 5,  paddingHorizontal: 95 , elevation:5}}
                               onChangeText={(v => atualizaSaldo(parseInt(v)))}
                                placeholder="ex. 5"
                               keyboardType='numeric'
                            />

                        <TouchableOpacity style={{backgroundColor:"#FFF", borderRadius:5, alignItems:'center', elevation:5, marginTop:"15%", padding:8, width:"80%"}}
                          onPress={()=> postAcerto()}
                           >
                        <Text  style={{ fontSize: 15, fontWeight:'bold'}} >
                          GRAVAR
                        </Text>
                      </TouchableOpacity>
                      
                      </View>
                  </View>

                  :
                    <View style={{borderWidth:1, borderColor:'#333', marginTop:5, borderRadius:6 }}>
                        <View style={{ alignItems: 'center' }} >
                            <Text>selecione um setor</Text>
                        </View>
                        <View style={{padding:5,  maxHeight:300, overflow:'scroll'}}>
                            
                            { setores === undefined ?
                            <Text>carregando setores...</Text>
                                :
                                <FlatList
                                data={setores}
                                //horizontal= {true}
                                renderItem={({ item }) => changeSetor(item)}
                                keyExtractor={item => item.codigo}
                                />
                            }
                        </View>
                    </View>
                  }
                               </View>
                        </View>
                    </Modal>

            <View  >
                    <FlatList
                        data={produtos}
                        renderItem={({ item }) => renderItem(item)}
                    />
            </View>
                
        </View>
    )
}

const styles = StyleSheet.create({
    txt: {
        fontWeight: 'bold'
    },
    item: {
        backgroundColor: '#FFF', //#dcdcdd
        elevation:5,
        marginTop:25,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 5
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 4,
        paddingHorizontal: 70,
        marginTop: 3,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10
    },
})