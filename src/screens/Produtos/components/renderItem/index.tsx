import { Image, Modal, Text, TouchableOpacity, View } from "react-native"
import { produto } from "../../../../database/queryProdutos/queryProdutos"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { defaultColors } from "../../../../styles/global";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRef, useState } from "react";
import ViewShot, { captureRef } from "react-native-view-shot";
import { AntDesign, Ionicons } from "@expo/vector-icons";
  import * as Sharing from 'expo-sharing'


          type prop =  {  item: produto, handleSelect: ( produto:produto )=>void }  
  
  export const  RenderItem = ({ item, handleSelect  }:prop ) => {
      const viewShotRef = useRef();

    const [ visible, setVisible ] = useState(false);

const compartilharProduto = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 0.9, // Qualidade da imagem (0 a 1)
      });

     console.log('URI da imagem:', uri); // Verifique a URI no console
      // Compartilhar a imagem
   if (await Sharing.isAvailableAsync()) {
        try {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Compartilhar Produto',
            UTI: 'image/png', // Uniform Type Identifier (iOS)
          });
        } catch (error) {
          console.error('Erro ao compartilhar com expo-sharing:', error);
        }
      } else {
        console.warn('Compartilhamento não está disponível neste dispositivo.');
      }
    } catch (error) {
      console.error('Erro ao capturar e compartilhar:', error);
    }
  };


            return(
                <TouchableOpacity 
                    onPress={ ()=> handleSelect(item) }
                    style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%' }}
                 >
                    
                
                   <Text style={{ fontSize:15, fontWeight:"bold", color: defaultColors.gray }}>
                      Codigo: {item && item.codigo}
                   </Text>

                   <Text style={{fontSize:15 ,fontWeight:"bold", color:defaultColors.gray}}>
                     { item && item.descricao}
                   </Text>
                   <View  style={{ padding:1,  borderWidth:1,borderRadius:5, borderColor:'#CCC', alignSelf:'flex-start'}}  >
                    { 
                            item.fotos && item.fotos.length > 0 && item.fotos[0].link ?
                            (
                            <Image
                              source={{ uri: `${item.fotos[0].link}` }}
                              // style={styles.galleryImage}
                              style={{ width: 100, height: 100, }}
                                resizeMode="contain"
                              />) :(
                                <MaterialIcons name="no-photography" size={40} color="#185FED"  />
                              )
                      }     
                 
                   </View>

                   

                    <View style={{ flexDirection:"row", justifyContent:"space-between", margin:3}}>  
                        <Text style={{ fontWeight:"bold", fontSize:15 , color:defaultColors.gray}}>
                           R$ { item && item.preco ? item.preco.toFixed(2)  : '0.00' }
                        </Text>
                        <Text style={{ fontWeight:"bold", fontSize:15 , color:defaultColors.gray}}>
                            estoque: {item && item.estoque}
                        </Text>
                       <TouchableOpacity 
                         onPress={()=>{ setVisible(true)}} 
                         style={{  borderRadius:5, elevation:5 ,backgroundColor:'white' ,width: 40,height: 40, padding:5, alignItems:"center", flexDirection:"row"}} >
                         <AntDesign name="sharealt" size={24}  color={defaultColors.darkBlue}  />
                      </TouchableOpacity>
                    </View> 
                   
            <Modal  visible={visible}  transparent={true} >
                  <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" , flex:1, alignItems:"center", justifyContent:"flex-start" }}>
                       <View   style={{ backgroundColor:'#FFF', width:'95%', height:'95%', marginTop:10, borderRadius:10 }}>  
                           <TouchableOpacity onPress={()=> {setVisible(false) }}  style={ { width:'15%'  ,padding: 16, borderRadius: 12    }}>
                              <Ionicons name="close" size={28} color={ '#6C757D' } />
                           </TouchableOpacity>
                        

                         <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}  style={{ backgroundColor:'#FFF'}} >
                              <View style={{ alignItems:"center"}}>
                                    { 
                                            item.fotos && item.fotos.length > 0 && item.fotos[0].link ?
                                            (
                                            <Image
                                              source={{ uri: `${item.fotos[0].link}` }}
                                              // style={styles.galleryImage}
                                              style={{ width: 200, height: 200,  borderRadius: 5,}}
                                                resizeMode="contain"
                                              />) :(
                                                <MaterialIcons name="no-photography" size={40} color="#185FED"  />
                                              )
                                      }     

                              <View style={{ marginTop:15}}>
                                  <Text style={{fontSize:15 ,   textAlign:"center"}}>
                                      { item && item.descricao}
                                  </Text>
                                 <Text style={{fontSize:20 ,color:'blue', marginLeft:15 }}>
                                      R$: {item && item.preco?.toFixed(2)}
                                 </Text>
                                </View>

                              </View>
                        </ViewShot>

                      <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"center" , marginTop: 25}} >
                        <TouchableOpacity
                            style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius: 3, padding: 5 }}
                            onPress={() => compartilharProduto()}
                          >
                          <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>Compartilhar</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </View>
            </Modal>
                   
                </TouchableOpacity>
            )
        }
      
