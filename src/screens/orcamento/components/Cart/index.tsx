import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cloneElement, useContext, useEffect, useState } from "react";
import { OrcamentoContext } from "../../../../contexts/orcamentoContext";
import AntDesign from '@expo/vector-icons/AntDesign';

import FontAwesome from '@expo/vector-icons/FontAwesome';


export const Cart = (   )=>{ 


    const [visible , setVisible ] = useState(false)
const [ deleteItem, setDeleteItem ] = useState({})

    const { orcamento , setOrcamento } = useContext( OrcamentoContext) 
 

    function incrementProduto( item ){
        if(! orcamento.produtos || orcamento.produtos.length === 0   ){
          
          //console.log( 'nenhum produto informado ')      
          
          } else{
                   const  produto = orcamento.produtos.find( i => i.codigo === item.codigo );

            if( produto !== undefined && produto.quantidade >  0 ){
                produto.quantidade = ( produto.quantidade + 1 );
                produto.total = (produto.quantidade * produto.preco) - produto.desconto
                
                let aux;
                const indexProduto = orcamento.produtos.findIndex( i => i.codigo === item.codigo)
                      aux = orcamento.produtos;
                    aux.splice( indexProduto , 1,  produto)
                   

                    let novoTotalGeral = 0;
                    let totaDescontos = 0;
                    let totalValorProdutos = 0;
                            orcamento.produtos.forEach((i: any) => {
                                novoTotalGeral += i.total;
                                totaDescontos += i.desconto;
                                totalValorProdutos += i.preco * i.quantidade;
                            });
             
                        setOrcamento((prevOrcamento: OrcamentoModel) => ({
                            ...prevOrcamento,
                            total_produtos: totalValorProdutos,
                            total_geral: novoTotalGeral,
                            descontos: totaDescontos,
                         produtos:  aux,
                         }));
                 }
             }
      }
 
      function handleDescontoChange( item , value){
         
            if(! orcamento.produtos || orcamento.produtos.length === 0   ){
               
            //  console.log( 'nenhum produto informado ')      
              
            } else{
                       const  produto = orcamento.produtos.find( i => i.codigo === item.codigo );
    
                if( produto !== undefined   && value !== null ){
                    const desconto = parseFloat(value) || 0;
                    produto.desconto = desconto;
                    produto.total = (produto.quantidade * produto.preco) -  produto.desconto;
                    let aux;
                    const indexProduto = orcamento.produtos.findIndex( i => i.codigo === item.codigo)
                          aux = orcamento.produtos;
                        aux.splice( indexProduto , 1,  produto)
                       
    
                        let novoTotalGeral = 0;
                        let totaDescontos = 0;
                        let totalValorProdutos = 0;
                                orcamento.produtos.forEach((i: any) => {
                                    novoTotalGeral += i.total;
                                    totaDescontos += i.desconto;
                                    totalValorProdutos += i.preco * i.quantidade;
                                });
                 
                            setOrcamento((prevOrcamento: OrcamentoModel) => ({
                                ...prevOrcamento,
                                total_produtos: totalValorProdutos,
                                total_geral: novoTotalGeral,
                                descontos: totaDescontos,
                             produtos:  aux,
                             }));
                     }
                 }
    
      }

      function decrementProduto( item ){
        if(! orcamento.produtos || orcamento.produtos.length === 0   ){

          //  console.log( 'nenhum produto informado ')      
          
          } else{
                   const  produto = orcamento.produtos.find( i => i.codigo === item.codigo );

            if( produto !== undefined  &&  produto.quantidade > 1 ){
                produto.quantidade = ( produto.quantidade - 1 );
                produto.total = (produto.quantidade * produto.preco) - produto.desconto
                
                let aux;
                const indexProduto = orcamento.produtos.findIndex( i => i.codigo === item.codigo)
                      aux = orcamento.produtos;
                    aux.splice( indexProduto , 1,  produto)
                   

                    let novoTotalGeral = 0;
                    let totaDescontos = 0;
                    let totalValorProdutos = 0;
                            orcamento.produtos.forEach((i: any) => {
                                novoTotalGeral += i.total;
                                totaDescontos += i.desconto;
                                totalValorProdutos += i.preco * i.quantidade;
                            });
             
                        setOrcamento((prevOrcamento: OrcamentoModel) => ({
                            ...prevOrcamento,
                            total_produtos: totalValorProdutos,
                            total_geral: novoTotalGeral,
                            descontos: totaDescontos,
                         produtos:  aux,
                         }));
                 }
             }
      }

 

      function deleteProduto( item ) {
        Alert.alert('', `deseja excluir o item : ${item.descricao} ?`,[
            { text:'Não',
                onPress: ()=> console.log('nao excluido o item'),
                style:'cancel',
            },
            {
                text: 'Sim', onPress:()=>{ 
                    console.log(`Excluindo o item ${item.descricao}`) ;
                    if( orcamento.produtos ){
                        const indexProduto = orcamento.produtos.findIndex(i => i.codigo === item.codigo);
                        let aux = orcamento.produtos;
                        if (indexProduto !== -1) {
                          aux.splice(indexProduto, 1);
                        }
                        setOrcamento((prevOrcamento: OrcamentoModel) => ({
                            ...prevOrcamento,
                         produtos:  aux,
                         }));
                  }
                }
            }
        ] )
   

      }


   
      const renderItem = ({ item }) => {
       // const isSelected = selectedItem.find(i => i.codigo === item.codigo);
       // const quantidade = isSelected ? isSelected.quantidade : 0;
       // const desconto = isSelected ? isSelected.desconto : 0;
       // item.preco = 10;
       // item.total = (quantidade * item.preco) - desconto;
    
        return (
          <View style={  { backgroundColor:  '#009de2', margin:15, borderRadius:10  , elevation:5 }}    >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin:5 }}>
                <Text style={{ fontWeight: 'bold' , color: 'white',fontSize:15}} >
                  Código: {item.codigo}
                </Text>
                <Text style={  { color:  'white', fontWeight: 'bold', fontSize:15  } }>
                  R$: {item.preco}
                </Text>

                    <TouchableOpacity 
                    //onPress={()=>alertaExclusao(item)} 
                    onPress={()=> deleteProduto(item)}
                        
                        >
                        <FontAwesome name="close" size={24} color="white" />
                        {/*** exluir item  */}
                    </TouchableOpacity>

            </View>
                <View style={{margin:5}}>
                <Text style={  { color:  'white',fontWeight: 'bold'  } }>
                    {item.descricao}
                </Text>
                </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>
                <View style={{ marginTop: 25 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                    Desconto: {item.desconto }
                  </Text>
                  <TextInput
                    style={{ backgroundColor: 'white', borderRadius: 5, elevation: 4, textAlign: 'center' }}
                    keyboardType='numeric'
                    defaultValue ={ item.desconto  }
                    onChangeText={(i) => handleDescontoChange(item, i)}
                  />
                </View>
                <View style={{ marginTop: 3 }}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 25, elevation: 4, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}> { item.quantidade  } </Text>
                    </View>
                    <View style={{ flexDirection: 'row'}}>
                      <TouchableOpacity
                         onPress={()=> incrementProduto(item)}  style={{margin: 3,backgroundColor: '#FFF', elevation: 4,width: 60,height: 35, alignItems: 'center', justifyContent: 'center',  borderRadius: 5 }}>
                        <Text style={{fontWeight: 'bold', fontSize: 15}}> + </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                      onPress={() => decrementProduto(item)}
                      style={{margin: 3,backgroundColor: '#FFF', elevation: 4,width: 60,height: 35, alignItems: 'center', justifyContent: 'center',  borderRadius: 5 }}>
                        <Text style= {{ fontWeight: 'bold', fontSize: 15}} > - </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, elevation: 5 }}>
                      Total R$: {item.total}
                    </Text>
                  </View>
                </View>
              </View>
        
          </View>
        );
      };

    const  Item = ( {item} )=>{
        return (

            <View style={{ borderWidth:2, margin:10, borderColor:'#DFDFDF', borderRadius:3}}>

            <View style={{flexDirection:'row', gap:10  }}>
                <Text>
                    Cod. {item.codigo}
                </Text>

                <Text>
                    {item.nome}
                </Text>
            </View>

                <View style={{ flexDirection:"row"}} >
                    <TouchableOpacity 
                    style={{  width:15,margin:10, backgroundColor:'red', alignItems:"center", justifyContent:"center"}}  
                    onPress={()=> setDeleteItem(item)}
                    >
                        <Text style={{fontWeight:'bold' }}>
                        X
                        </Text>
                    </TouchableOpacity>



                                            <Text> {item.quantidade} </Text>
                        <View style={{ flexDirection:"row" }}>
                            <TouchableOpacity style={{  width:15,margin:10, backgroundColor:'#168fff', alignItems:"center", justifyContent:"center"}}  
                                onPress={()=> incrementProduto(item)}
                            >
                                <Text style={{fontWeight:'bold' }}>
                                   +
                                </Text>
                             </TouchableOpacity>
                             <TouchableOpacity style={{  width:15,margin:10, backgroundColor:'#168fff', alignItems:"center", justifyContent:"center"}}   >
                                <Text style={{fontWeight:'bold' }}>
                                   -
                                </Text>
                             </TouchableOpacity>
                        </View>


                  </View>
            </View>
        )
    }

return(

    <View style={{    marginTop:10, margin:5  }} >
        <TouchableOpacity  onPress={ ()=>setVisible(true)} >
            <View style={{backgroundColor:'#009de2', width:20, height:20,borderRadius:10, alignItems:"center", justifyContent:"center", position:'absolute', zIndex: 99, top:-9, right:-1 }} >  
              
                    { orcamento.produtos ?  <Text style={{fontWeight:'bold' }}> {orcamento?.produtos.length} </Text> : <Text style={{fontWeight:'bold' }}> 0 </Text>  }
             
            </View>
            <MaterialCommunityIcons name="cart-variant" size={35} color="black" />
        </TouchableOpacity>

    <Modal  transparent={true} visible={visible}  >

        <View style={{backgroundColor:'rgba( 52 , 52, 52 ,  0.8)'}}>

        <View style={{backgroundColor:'#FFFF', width:'95%', height:'95%', margin:10 , borderRadius:10}}>
           

            <TouchableOpacity  onPress={ ()=>setVisible(false)  }
                style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '20%', elevation: 5 }} >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                  voltar
                </Text>
              </TouchableOpacity>

                        <View style={{   height:'90%'   }}>
                            { 
                                orcamento.produtos ?
                                <FlatList
                                data={orcamento.produtos}
                                renderItem= { renderItem  } 
                                />
                                :
                                <Text style={{ fontWeight:'bold'}} > Nenhum Produto informado !  </Text>
                            }

                        </View>
        </View>
        </View>
    </Modal>

        </View>


)


}
const styles = StyleSheet.create({
    txt: {
        fontWeight: 'bold',
      },
       txtDescricao: {
    fontWeight: 'bold',
    fontSize: 15
  },
})