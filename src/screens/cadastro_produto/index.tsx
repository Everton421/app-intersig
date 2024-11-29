import { Button, Image, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors"

export const Cadastro_produto = ()=>{
    return(
        <View style={{ flex:1 }}>

            <View style={{ width:'100%',height:'100%'  , backgroundColor:'#EAF4FE' }} >
                                    

                                 <View style={{ margin:10, gap:15, flexDirection:"row"}}>
                                    <Image
                                        style={{ width: 70 , height: 70   }}
                                        source={{
                                            uri:'https://reactnative.dev/img/tiny_logo.png' 
                                        }}
                                        />

                                     <View style={{ backgroundColor:'#fff',alignItems:"center", justifyContent:"flex-start", width:'50%', flexDirection:"row", borderRadius:5, height:25, elevation:5 }}>
                                       <Text > Preço R$:  </Text>
                                         <TextInput
                                          placeholder="10,00"
                                          />
                                     </View>   
                                     
                                 </View>
  
                                        <View style={{ margin:7,backgroundColor:'#FFF',  padding:2, borderRadius:5, elevation:5  }}>
                                            <TextInput
                                                  style={{ padding:5,  backgroundColor:'#FFF' }}
                                                  placeholder="descrição" 
                                            />
                                          </View>
                                       

                                        <View style={{ margin:7,padding:3, backgroundColor:'#fff',alignItems:"center", justifyContent:"flex-start",   flexDirection:"row", borderRadius:5, height:25, elevation:5 }}>
                                            <Text > Estoque: </Text>
                                                <TextInput
                                            />
                                        </View>  

                                        <View style={{  margin:7,backgroundColor:'#fff',alignItems:"center", justifyContent:"flex-start",   flexDirection:"row", borderRadius:5, height:25, elevation:5 }}>
                                            <Text > SKU: </Text>
                                                <TextInput
                                            />
                                        </View>  
                                        <View style={{  margin:7,backgroundColor:'#fff',alignItems:"center", justifyContent:"flex-start",   flexDirection:"row", borderRadius:5, height:25, elevation:5 }}>
                                            <Text > GTIN: </Text>
                                                <TextInput
                                            />
                                        </View>  
                                      
                                        <View style={{  margin:7,backgroundColor:'#fff',alignItems:"center", justifyContent:"flex-start",   flexDirection:"row", borderRadius:5, height:25, elevation:5 }}>
                                            <Text > Referencia: </Text>
                                                <TextInput
                                            />
                                        </View> 

                                             

                                        <View style={{ flexDirection:"row", width:'100%', alignItems:"center", justifyContent:"center", marginTop:10 }} >
                                            <TouchableOpacity style={{ backgroundColor:'#185FED', width:'80%', alignItems:"center", justifyContent:"center", borderRadius:15, padding:5}}>
                                                <Text style={{ fontWeight:"bold", color:"#FFF", fontSize:20 }}>gravar</Text>
                                            </TouchableOpacity>
                                        </View>
                    </View>

         
         </View>
    )
}