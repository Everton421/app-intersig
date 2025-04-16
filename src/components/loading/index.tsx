import {View, ActivityIndicator, Modal } from "react-native";


type props = { isLoading:boolean}

export const LodingComponent = ({ isLoading }:props) => (
  <Modal animationType='slide' transparent={true} visible={isLoading}>
    <View style={ {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    }}>
      <ActivityIndicator size="large" color="#FFF" />
      {/**
      <Text style={styles.loadingText}>Carregando  pedidos ...  </Text>
       <Animated.View style={[styles.progressBar, { width: `${1}%` }]} />*/}
    </View>
  </Modal>
);
  