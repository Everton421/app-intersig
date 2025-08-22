import React,{ useRef } from "react";
import { Image, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from 'expo-sharing';

export const ShareProdutoComponent = ({ produto })=>{

      const viewShotRef = useRef();

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


  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
        <View style={styles.produtoContainer}>
          <Image source={{ uri: produto.imagem }} style={styles.imagem} />
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>
          <Text style={styles.descricao}>{produto.descricao}</Text>
        </View>
      </ViewShot>
      <TouchableOpacity style={styles.botaoCompartilhar} onPress={compartilharProduto}>
        <Text style={styles.textoBotao}>Compartilhar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
  },
  produtoContainer: {
    alignItems: 'center',
  },
  imagem: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  preco: {
    fontSize: 16,
    color: 'green',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  botaoCompartilhar: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
