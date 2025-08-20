import { Image, Text, TouchableOpacity, View } from "react-native"
import { produto } from "../../../../database/queryProdutos/queryProdutos"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { defaultColors } from "../../../../styles/global";

  
          type prop =  {  item: produto, handleSelect: ( produto:produto )=>void }  
  
  export const  RenderItem = ({ item, handleSelect  }:prop ) => {
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

                    <View style={{ flexDirection:"row", justifyContent:"space-between", margin:3}}>  
                        <Text style={{ fontWeight:"bold", fontSize:15 , color:defaultColors.gray}}>
                        R$ { item && item.preco ? item.preco.toFixed(2)  : '0.00' }
                        </Text>
                        <Text style={{ fontWeight:"bold", fontSize:15 , color:defaultColors.gray}}>
                        estoque: {item && item.estoque}
                        </Text>
                    </View>
                   

                </TouchableOpacity>
            )
        }
      