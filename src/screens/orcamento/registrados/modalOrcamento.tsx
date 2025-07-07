import { View, Text, Modal, FlatList, Button, TouchableOpacity } from "react-native"

export const ModalOrcamento = ({visible , orcamento, setVisible} )=>{


       const ProdOrcamento = ( {item}:any )=>{
            return(
                <View style={{backgroundColor:'#3335' , borderRadius:5 , margin: 3,width:'100%'}}>
                        <Text style={{ fontWeight:"bold"}}>
                            codigo: {item.codigo}
                        </Text>
                        <Text>
                            { item.descricao}
                        </Text>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                            <Text style={{ fontWeight:"bold",width:'30%',fontSize:12}}>
                                    Quantidade: {item.quantidade}
                                </Text>
                            <Text style={{ fontWeight:"bold",width:'40%',fontSize:12}}>
                                    unitario: {item.preco.toFixed(2)}
                                </Text>
                                <Text style={{ fontWeight:"bold",width:'20%',fontSize:12}}>
    
                                    total: {item.total.toFixed(2)}
                                </Text>
                            </View>  
    
                </View>
            )
        }
    

        
       const ParcelasOrcamento = ( {item}:any )=>{
        return(
            <View style={{backgroundColor:'#3335' , borderRadius:5 , margin: 3,width:'100%'}}>
                    <Text style={{ fontWeight:"bold"}}>
                        parcela: {item.parcela}
                    </Text>
                   
                   
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                        <Text style={{ fontWeight:"bold",width:'30%',fontSize:12}}>
                           parcela: {item.parcela}
                        </Text>
                         
                        <Text style={{ fontWeight:"bold",width:'40%',fontSize:12}}>
                                valor: {item.valor.toFixed(2)}
                           </Text>
                            <Text style={{ fontWeight:"bold",width:'20%',fontSize:12}}>
                                vencimento: {item.vencimento}
                            </Text> 
                        </View>  

            </View>
        )
    }
        const ServiceOrcamento = ( { item }:any )=>{
            return(
                <View style={{backgroundColor:'#3335' , borderRadius:5 , margin: 3, width:'90%' }}>
                        <Text style={{ fontWeight:"bold"}}>
                            codigo: {item.codigo}
                        </Text>
                        <Text>
                            { item.aplicacao}
                        </Text>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                        
    
                            <Text style={{ fontWeight:"bold"}}>
                                    Quantidade: {item.quantidade}
                                </Text>
                                
                                <Text style={{ fontWeight:"bold"}}>
                                    unitario: {item?.valor.toFixed(2)}
                                </Text>
                                <Text style={{ fontWeight:"bold"}}>
    
                                    total: {item?.total.toFixed(2)}
                                </Text>
                            </View>  
    
                </View>
            )
        }


    return(
        <Modal transparent={true}  visible={ visible }>
        <View style={{ flex:1, backgroundColor:'rgba( 50 , 50, 50 , 0.5)', alignItems:'center', justifyContent:"center", width:'100%' }}>
              <View style={{ backgroundColor:'#FFF', width:'97%', height:'97%', borderRadius:10}}>
                  <View style={{ padding:5 , justifyContent:"space-between", flexDirection:"row"  }} >
                     <TouchableOpacity  onPress={() => {  setVisible(false)  }} 
                       style={{  margin: 15, backgroundColor: "#185FED",  padding: 7, borderRadius: 7, width: "20%",  elevation: 5,   }}  >
                                    <Text style={{ color: "#FFF", fontWeight: "bold" }}>voltar</Text>
                     </TouchableOpacity>
                         <View>   
                          <Text>    
                             { orcamento?.tipo === 1 ? ( <Text style={{ fontSize:15, fontWeight:"bold"}}> Orçamento: {orcamento?.id} </Text> ) : 
                               orcamento?.tipo === 3 ? ( <Text style={{ fontSize:15, fontWeight:"bold"}}>  OS: {orcamento?.id} </Text> ) : null
                             }
                           </Text>
                           <Text style={{ fontSize:15, fontWeight:"bold"}}> Id externo: { orcamento?.id_externo ? orcamento?.id_externo : 0 } </Text>
                         </View>

                  </View>


              <View style={{ padding:5 }}>   

                     <Text style={{ fontSize:15, fontWeight:"bold"}}>
                           Data Cadastro: {orcamento?.data_cadastro}
                     </Text>      
                    <Text style={{  fontWeight:"bold"}} >
                        cliente: {orcamento?.cliente.codigo}
                    </Text>
                    <Text style={{ fontWeight:"bold"}}>
                        {orcamento?.cliente.nome}
                    </Text>
             </View>

             <View style={{   padding:3}}>   
                        <View style={{ flexDirection:"row" , justifyContent:'space-between'}}>
                                <Text style={{ fontWeight:"bold", width:'50%'}}>
                                    Total: { orcamento?.total_geral ? orcamento?.total_geral.toFixed(2) : 0  }
                                </Text>
                                
                                <Text style={{ fontWeight:"bold", width:'50%'}}>
                                    Descontos: {orcamento?.descontos ? orcamento?.descontos.toFixed(2) : 0}
                                </Text>
                        </View>

                        <View style={{ flexDirection:"row" , justifyContent:'space-between' }}>
                            <Text style={{ fontWeight:"bold",width:'50%'}}>
                                Total Servicos: {  orcamento?.total_servicos ?  orcamento?.total_servicos.toFixed(2) : 0  }
                            </Text>
                            <Text style={{ fontWeight:"bold",width:'50%'}}>
                                Total Produtos: {  orcamento?.total_produtos ? orcamento?.total_produtos.toFixed(2) : 0  }
                            </Text>
                        
                        </View>
             </View>  

              {/** *** separador ***/} 

                        {   orcamento?.produtos && orcamento?.produtos.length > 0 &&
                        <View style={{ width:'100%'}}>
                            <View style={{ borderWidth: 0.5, margin: 5 }}></View> 
                                  <View style={{   width:'90%'}}>
                                                <Text>  PRODUTOS  </Text>
                                        <FlatList
                                            data={orcamento?.produtos}
                                            renderItem={ ({item})=> <ProdOrcamento item={item} /> }
                                            />
                              </View>
                            </View>

                            }

                        {/** *** separador ***/} 
              <View style={{ borderWidth: 0.5, margin: 5 }}></View> 

                        { orcamento?.servicos &&
                             <View style={{   width:'100%'}}>
                                        <Text> SERVIÇOS  </Text>
                                <FlatList
                                    data={orcamento?.servicos}
                                    renderItem={ ({item})=> <ServiceOrcamento item={item} /> }
                                    />
                          </View>
                        }
              <View style={{ borderWidth: 0.5, margin: 5 }}></View> 
                 {
                 orcamento?.parcelas && 
                 <View style={{   width:'100%'}}>
                      <Text> PARCELAS  </Text>
                      <FlatList
                                    data={orcamento?.parcelas}
                                    renderItem={ ({item})=> <ParcelasOrcamento item={item} /> }
                                    />
                 </View>

                }
                    
                           
            </View>

        </View>
    </Modal>
    )
}