import { Image, Modal, Text, TouchableOpacity, View } from "react-native"
import { produto } from "../../../../database/queryProdutos/queryProdutos"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { defaultColors } from "../../../../styles/global";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRef, useState } from "react";
import ViewShot, { captureRef } from "react-native-view-shot";
  
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
                   <View style={{ flexDirection:"row"}}>
                    { 
                            item.fotos && item.fotos.length > 0 && item.fotos[0].link ?
                            (
                            <Image
                              source={{ uri: `${item.fotos[0].link}` }}
                              // style={styles.galleryImage}
                              style={{ width: 100, height: 100,  borderRadius: 5,}}
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
                          <FontAwesome name="share-square-o" size={30} color="#185FED" />
                      </TouchableOpacity>
                    </View> 
                   
            <Modal  visible={visible}  transparent={true} >
                  <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" , flex:1, alignItems:"center", justifyContent:"flex-start" }}>
                       <View  ref={viewShotRef} style={{ backgroundColor:'#FFF', width:'95%', height:'95%', marginTop:10, borderRadius:10 }}>  
                        <View style={{ flexDirection:"row"}}>
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
                        
                      
                        </View>
                    <Text style={{fontSize:15 ,fontWeight:"bold",  textAlign:"center"}}>
                          { item && item.descricao}
                    </Text>

                    <TouchableOpacity
                        style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius: 7, padding: 5 }}
                      //  onPress={() => gravar()}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>Compartilhar</Text>
                    </TouchableOpacity>
                    </View>
                  </View>
            </Modal>
                   
                </TouchableOpacity>
            )
        }
      
