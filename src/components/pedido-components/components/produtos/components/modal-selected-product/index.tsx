import { Button, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { defaultColors } from "../../../../../../styles/global";
import React, { cloneElement, useCallback, useContext, useEffect, useState } from "react";
import { useFunctionsProducts } from "../../utils/functions";
import { Ionicons } from "@expo/vector-icons";

type props = {
    visible:boolean
    isSelected:ItemType
    setVisible:React.Dispatch<React.SetStateAction<boolean>>
}
   type ItemType = {
        codigo:number,
        preco:number,
        estoque:number
        fotos:[ { link:string} ] | [ ],
        descricao:string,
        total:number
        quantidade?:number
        desconto?:number
    }




export const ModalSelectedProduct =   ({    isSelected,visible, setVisible  }:props )=>   {

      const [ quantidade, setQuantidade ] = useState(1);
      const [ desconto, setDesconto ] = useState(0);
      const [ total, setTotal ] = useState(0);
      const [ preco, setPreco  ] = useState(0);

      const useFunctions = useFunctionsProducts();

            useEffect(()=>{
                let auxQuant= 1;
                let auxDesc= 0 ;
                let auxPrice= 0;
                     if(isSelected.quantidade && isSelected.quantidade > 0  ){
                         setQuantidade(isSelected.quantidade)
                         auxQuant =isSelected.quantidade
                     }
                     if(isSelected.desconto && isSelected.desconto > 0 ){
                         auxDesc =isSelected.desconto;
                         setDesconto(isSelected.desconto)
                     }
                    if( isSelected.preco && isSelected.preco > 0 ) setPreco(isSelected.preco);
                     if(auxDesc > auxPrice ){
                         auxDesc = 0 
                     }
                    setTotal( (  auxPrice - auxDesc  ) * auxQuant )
            },[])

        
                 function handleSave   (item:ItemType) {
                        item.quantidade = quantidade    
                        item.total = (  preco - desconto  ) * quantidade 
                        item.desconto = desconto
                        setVisible(false)                        
                          useFunctions.toggleSelection(item)
                        setQuantidade(1)
                        setDesconto(0)
                        setTotal(0)
                        setPreco(0)
                          }

           function calcTotal( ){
                          if( desconto > ( quantidade * preco )){
                               setDesconto(0)
                              }
                 const total = (  preco - desconto  ) * quantidade 
                return total
                }

                    useEffect(()=>{
                       setTotal( calcTotal( ) ) 
                    },[desconto,quantidade, total])


        return (    
          <Modal  visible={visible} style={{ flex:1 }} transparent={true } >
            <View style={{ backgroundColor:'rgba(255,255,255, 0.1 )', flex:1, alignItems:"center",justifyContent:"center" }}>
              <View style={{ flex:1, backgroundColor:'#FFF', width:'95%', borderRadius:10, marginTop:5 }}>
                      <TouchableOpacity onPress={() => setVisible(false)}  style={ { width:'15%'  ,padding: 10, borderRadius: 12    }}>
                                   <Ionicons name="close" size={28} color={ '#6C757D' } />
                                 </TouchableOpacity>

                    <View style={{ flexDirection:"row", alignItems:'center', justifyContent:'space-between' }}>
                       <View  style={{ padding:1, minWidth:150, borderWidth:1,borderRadius:5, borderColor: '#CCC',  marginLeft:10, marginTop:5}}  >
                          {isSelected.fotos && isSelected.fotos[0] && isSelected.fotos[0].link  ?
                                (<Image source={{ uri: `${isSelected.fotos[0].link}` }} style={{  width: '100%', height: 100, borderRadius: 5, alignSelf: 'center' }} resizeMode="contain" />) :
                                (<MaterialIcons name="no-photography" size={100} color='#6C757D' />)
                            }
                        </View>
                            <View style={{ flex:1, flexDirection:'row',justifyContent:"space-around", alignItems:"center"}}>
                                    <View  style={{ borderWidth:1, borderRadius:5, padding:4,borderColor:'#CCC'}} > 
                                        <Text style={styles.label} >R${ Number(isSelected.preco).toFixed(2) }</Text>
                                    </View>
                                    <View  style={{ borderWidth:1, borderRadius:5, padding:4,borderColor:'#CCC'}} > 
                                         <Text style={styles.label} > estoque: { isSelected.estoque}</Text>
                                    </View>
                            </View>
                    </View>

                    <Text style={[styles.label,{ marginTop:3, margin:5} ]} numberOfLines={1} >
                            { isSelected.descricao}
                        </Text>
                    
                <View style={{ alignItems: "center" }}>

                    <View style={[styles.quantityContainer,{ flexDirection:"row",marginTop:5, marginBottom:5}]}>
                 <Text style={styles.label}>Total R$:  </Text>
                        <Text style={styles.label} >  { Number((  preco - desconto  ) * quantidade ).toFixed(2) } </Text>
                    </View>

                    <View style={styles.quantityContainer}>
                        <Text style={styles.label}>{  quantidade }</Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={() => {  setQuantidade(quantidade + 1) } /*useFunctions.handleIncrement(isSelected)*/  } style={[styles.button,{ backgroundColor:"#185FED"} ]}>
                                <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>
                        <TouchableOpacity onPress={() =>   setQuantidade(quantidade - 1) /*useFunctions.handleDecrement(isSelected)*/ }  style={[styles.button,{ backgroundColor:"#185FED"} ]}>
                            <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                    </View>
                </View>   
                 <View style={styles.descontoContainer}>
                    <Text style={[styles.label,{ fontSize:17}]}>Desconto Unitário: R$ { Number(desconto).toFixed(2)}  </Text>
                    <TextInput
                        style={[styles.inputDesconto,styles.label ]}
                        keyboardType="numeric"
                        defaultValue={  desconto ? String( desconto) : "0"}  
                        onChangeText={(e)=> setDesconto(Number(e))}
                    />
                </View>
              
                 <View style={{ alignItems:'center', marginTop:10}} >
                    <TouchableOpacity style={{ width:'80%', backgroundColor:'#185FED', padding:5, borderRadius:3, elevation:3}}
                        onPress={()=>{  handleSave(isSelected)} }
                        >
                        <Text style={{ color:'#FFF', fontWeight:"bold", fontSize:20, textAlign:'center'}}> incluir</Text>
                    </TouchableOpacity>
                 </View>
               </View>
             </View>
          </Modal>
          )
        } 
      

       const styles = StyleSheet.create({
         label: {   fontWeight: "bold", fontSize: 20, color:defaultColors.gray },
        descontoContainer: { flexDirection:"row", justifyContent:"center", alignItems:"center" },
        selectedControls: { flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-end', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.3)' },
        inputDesconto: { backgroundColor: "white",marginLeft:3, borderWidth:1, borderColor:'#CCC',elevation:2, borderRadius: 5, padding: 5, width: 80, textAlign: "center", marginTop: 5 },
        quantityContainer: { backgroundColor: "white", borderRadius: 25, elevation: 4, paddingVertical: 8, paddingHorizontal: 15, justifyContent: "center", alignItems: "center" },
        quantityText: { fontWeight: "bold", fontSize: 16 },
        buttonsContainer: { flexDirection: "row" },
        buttonText: { fontWeight: "bold", fontSize: 20, color:'#FFF' },
        totalText: { color: "white", fontWeight: "bold", fontSize: 20, elevation: 5, marginTop: 10 },
        button: { margin: 3, backgroundColor: "#FFF", elevation: 4, width: 50, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 5 },
        })
