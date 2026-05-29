import { Image, Modal, Text, TouchableOpacity, View } from "react-native"
import { produto } from "../../../../database/queryProdutos/queryProdutos"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { defaultColors } from "../../../../styles/global";
import { useRef, useState } from "react";
import ViewShot, { captureRef } from "react-native-view-shot";
import { AntDesign, Ionicons } from "@expo/vector-icons";
  import * as Sharing from 'expo-sharing'

          type prop =  {  item: produto, handleSelect: ( produto:produto )=>void }  
  
  export const  RenderItem = ({ item, handleSelect  }:prop ) => {
      const viewShotRef = useRef<any>(null);

    const [ visible, setVisible ] = useState(false);

const compartilharProduto = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 0.9,
      });

     console.log('URI da imagem:', uri);
   if (await Sharing.isAvailableAsync()) {
        try {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Compartilhar Produto',
            UTI: 'image/png',
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

    const hasImage = item.fotos && item.fotos.length > 0 && item.fotos[0]?.link;
    const preco = item.preco ? item.preco : 0;

    return (
      <>
        <TouchableOpacity 
          onPress={() => handleSelect(item)}
          style={{
            flexDirection: 'row',
            backgroundColor: '#FFF',
            borderRadius: 12,
            marginHorizontal: 10,
            marginVertical: 6,
            padding: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          }}
        >
          <View style={{
            width: 90, height: 90, borderRadius: 8, overflow: 'hidden', marginRight: 12
          }}>
                  {hasImage ? (
              <Image
                source={{ uri: `${item.fotos?.[0]?.link}` }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View style={{
                width: '100%', height: '100%', backgroundColor: '#F0F0F0',
                justifyContent: 'center', alignItems: 'center'
              }}>
                <MaterialIcons name="image-not-supported" size={30} color="#BDBDBD" />
              </View>
            )}
          </View>

          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#757575', flex: 1 }} numberOfLines={1}>
                Cód. {item.codigo}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#185FED' }}>
                R$ {Number(preco)?.toFixed(2) || '0.00'}
              </Text>
            </View>

            <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#333', marginVertical: 4 }}>
              {item.descricao}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 10, color: '#9E9E9E' }}>Estoque Total</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#424242' }}>
                  {Number(item.estoque)?.toFixed(2) || 0}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setVisible(true)}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: '#E3F2FD', paddingVertical: 6, paddingHorizontal: 10,
                  borderRadius: 6, gap: 4
                }}
              >
                <MaterialIcons name="share" size={18} color="#185FED" />
                <Text style={{ color: '#185FED', fontWeight: 'bold', fontSize: 12 }}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <Modal visible={visible} transparent={true}>
          <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
            <View style={{ backgroundColor: '#FFF', width: '95%', height: '95%', marginTop: 10, borderRadius: 10 }}>
              <TouchableOpacity onPress={() => { setVisible(false) }} style={{ width: '15%', padding: 16, borderRadius: 12 }}>
                <Ionicons name="close" size={28} color='#6C757D' />
              </TouchableOpacity>

              <ViewShot ref={viewShotRef as any} options={{ format: 'png', quality: 0.9 }} style={{ backgroundColor: '#FFF' }}>
                <View style={{ alignItems: "center" }}>
                  {hasImage ? (
                    <Image
                      source={{ uri: `${item.fotos?.[0]?.link}` }}
                      style={{ width: 200, height: 200, borderRadius: 5 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialIcons name="no-photography" size={40} color="#185FED" />
                  )}

                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 15, textAlign: "center" }}>
                      {item.descricao}
                    </Text>
                    <Text style={{ fontSize: 20, color: 'blue', marginLeft: 15 }}>
                      R$: {Number(preco)?.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </ViewShot>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 25 }}>
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
      </>
    )
  }
