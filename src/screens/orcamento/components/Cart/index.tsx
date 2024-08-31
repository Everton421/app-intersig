import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cloneElement, useContext, useEffect, useState } from "react";
import { OrcamentoContext } from "../../../../contexts/orcamentoContext";



export const Cart = (   )=>{ 


    const [visible , setVisible ] = useState(false)
const [ deleteItem, setDeleteItem ] = useState({})

    const { orcamento , setOrcamento } = useContext( OrcamentoContext) 
 
    function incrementProduto( item ){
      
        if(! orcamento.produtos || orcamento.produtos.length === 0   ){
            console.log( 'nenhum produto informado ')      
          } else{
              
                   const  produto = orcamento.produtos.find( i => i.codigo === item.codigo );

            if( produto !== undefined ){
                produto.quantidade = ( produto.quantidade + 1 );
                produto.total = (produto.quantidade * produto.preco) - produto.desconto
                
                let aux;
                const indexProduto = orcamento.produtos.findIndex( i => i.codigo === item.codigo)
                      aux = orcamento.produtos;
                    aux.splice( indexProduto , 1,  produto)
                    console.log(orcamento.produtos)

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
 
    
      useEffect(() => {
        function deleteProduto( ) {

            
           // const indexProduto = orcamento.produtos.findIndex(i => i.codigo === deleteItem.codigo);
           // let aux = orcamento.produtos;
           // if (indexProduto !== -1) {
           //   aux.splice(indexProduto, 1);
           // }

          }
          deleteProduto();

      }, [deleteItem, orcamento.produtos ]);
    
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

    <View>
        <TouchableOpacity style={{  width:'18%',margin:10}} onPress={ ()=>setVisible(true)} >
            <View style={{backgroundColor:'#009de2', width:20, height:20,borderRadius:10, alignItems:"center", justifyContent:"center", position:'absolute', zIndex: 99, top:-9, right:-1 }} >  
              
                    { orcamento.produtos ?  <Text style={{fontWeight:'bold' }}> {orcamento.produtos.length} </Text> : <Text style={{fontWeight:'bold' }}> 0 </Text>  }
             
            </View>
            <MaterialCommunityIcons name="cart-variant" size={35} color="black" />
        </TouchableOpacity>

    <Modal  transparent={true} visible={visible}  >

        <View style={{backgroundColor:'rgba( 52 , 52, 52 ,  0.8)'}}>

        <View style={{backgroundColor:'#FFFF', width:'95%', height:'95%', margin:10 , borderRadius:10}}>
            <TouchableOpacity style={{  width:'18%',margin:10, backgroundColor:'red'}} onPress={ ()=>setVisible(false)} >
                <Text style={{fontWeight:'bold' }}>
                    voltar
                </Text>
            </TouchableOpacity>

                        <View style={{ width:'90%',height:'90%' }}>
                            {
                            <FlatList
                            data={orcamento.produtos}
                            renderItem= { ({item})=>  <Item item={item}/>   } 
                            />
                            }

                        </View>
        </View>
        </View>
    </Modal>

        </View>


)


}