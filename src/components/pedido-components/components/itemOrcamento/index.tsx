import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Image, Button, Modal } from 'react-native';
import { ProdutosContext } from "../../../../contexts/produtosDoOrcamento";
import AntDesign from '@expo/vector-icons/AntDesign';
import { OrcamentoContext } from "../../../../contexts/orcamentoContext";

export const ListaItemOrcamento = ( ) => {

    
    const {  orcamento , setOrcamento } = useContext(OrcamentoContext);
  
    const [totalGeral,         setTotalGeral]  = useState<number | undefined >();
    const [descontosGeral, setDescontosGeral]  = useState<number | undefined >();
    const [visible,              setVisible ]  = useState<boolean>(false);

    useEffect(()=>{
        let novoTotalGeral = 0;
        let totaDescontos  = 0;

        if(orcamento.produtos  ){
            orcamento.produtos.forEach((i) => {
                novoTotalGeral += i.total;
                totaDescontos += i.desconto;
            })
            setTotalGeral(novoTotalGeral);
            setDescontosGeral(totaDescontos);
        }
      

    },[orcamento.produtos])

      

      const Item = ({ item }) => {
        const [localQuantidade, setLocalQuantidade] = useState<number>(1);
        const [localTotalLiquido, setLocalTotalLiquido] = useState<number>(0);
        const [localDesconto,setLocalDesconto] = useState(0);
     
        function deleteProduto(value){
    //        const novosProdutos = produtos.filter((i) => i.codigo !== value.codigo);
           // console.log(novosProdutos);
//             setProdutos(novosProdutos)

        }
    
        return (
            <View style={styles.container}>
                <View style={styles.item}>
                    
                    <View style={styles.itemR}>
                        <Text >
                            Codigo: <Text style={{ fontWeight: 'bold' }}> {item.codigo} </Text>
                        </Text>
                        
                        <Text style={{ fontWeight: 'bold' }} > preço: {item?.preco.toFixed(2)} </Text>
    
                        <TouchableOpacity style={{backgroundColor:'red', width:20,alignItems:'center', borderRadius:5}} onPress={()=>deleteProduto(item)}>
                            <Text style={{color:'white'}}> X </Text>
                        </TouchableOpacity>
    
                    </View>
    
                    <View style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row", margin: 5 }}>
                        <Image
                            style={styles.logo}
                            source={{
                                uri: 'https://reactnative.dev/img/tiny_logo.png',
                            }}
                        />
                        <Text style={{ fontWeight: 'bold', maxWidth: 250, fontSize: 15 }} numberOfLines={3} >
                            {item.descricao}
                        </Text>
                        
     
                    </View>
    
                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly", margin: 3 }}>
                        <Text style={{ fontWeight: 'bold' }}  > quantidade: {item.quantidade} </Text>
                      
                        <Text style={{ fontWeight: 'bold' }}> total: R$ {item?.total.toFixed(2)}</Text>
                     
                    </View>
    
                    <View style={{ flexDirection: 'row', justifyContent: "flex-start", margin: 3 }}>
                    <Text style={{ fontWeight: 'bold' }}> descontos: R$ { item.desconto  ? item.desconto.toFixed(2) : 0 }</Text>
    
                    </View>
                </View>
            </View>
    
        )
    }

    return (
        <View  >
            <TouchableOpacity style={{backgroundColor:'#009de2', elevation:7, margin:3, borderRadius:5 ,padding:5 }}
            onPress={()=> setVisible(true)}
            >   
                <View style={{alignItems:'center'}}>
                    <Text style={{ fontSize:20, fontWeight:'bold',color:'#FFF'  }} >
                        itens do orçamento
            
                    <AntDesign name="caretdown" size={23} color="#FFF" style={{elevation:7}} />
           

                    </Text>
                </View>
                </TouchableOpacity>
      
        <Modal visible={visible}  >
            
            <TouchableOpacity onPress={()=>setVisible(false)}
                   style={{margin:15, backgroundColor:'#009de2',padding:7, borderRadius:7,width:'25%',elevation: 5}} >
                    <Text style={{color:'#FFF',fontWeight:'bold'}}>
                      voltar
                    </Text>
                  </TouchableOpacity>
              

            <View  style={{height:'87%'}} >
                <FlatList
                    data={orcamento.produtos}
                    renderItem={({ item }) => <Item item={item}   />}
                    keyExtractor={  (item:any) => item.codigo.toString()  }
                />
            </View>
        </Modal>
        
            
        </View>
    )

}



const styles = StyleSheet.create({
    item: {
        margin: 5,
        padding: 5,
        borderRadius: 7,
        backgroundColor: '#FFF',
        elevation:5
    },
    itemR: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    container: {
        marginTop: 10,
    },
    logo: {
        width: 66,
        height: 58,
    }
})
