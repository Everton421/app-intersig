import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, Modal, TouchableOpacity, ScrollView, TouchableOpacityBase, StatusBar } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { api } from '../../services/api';
import { FlatList, TextInput } from 'react-native-gesture-handler';

export default function Acerto() {

 

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [value, setValue] = useState<any>();
  const [prod, setProd] = useState<any>([]);

  const [saldo, setSaldo] = useState(0);

  
  
  const [preco, setPreco] = useState([]);
  const [ setor, setSetor ] = useState <any> ([]);
  const [dataRequest, setDataRequest ] = useState<any>([]);
  const [loading , setLoading ] = useState(false);
  const [novoSaldo, setNovoSaldo] = useState(0);
  const [saldoSistema, setSaldoSistema] = useState();

  const [prodSetores, setProdSetores] = useState();
  const [prodSetor, setProdSetor] = useState();

  const[saldoAtual, setSaldoAtual ] = useState<any|undefined>(); 

  const [selectedSetor, setSelectedSetor] = useState<any>();



  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    async function busca() {
      setLoading(true)
      if(!value !== undefined){

      
      try {
        const valor = await api.get(`/acerto/produto/${value}`);
        if(!valor.data){
          Alert.alert("produto nao encontrado")     
          setScanned(false);
      } 
        setDataRequest(valor.data);
        setProd(valor.data);
        setSaldoSistema(valor.data.estoque)

      } catch (err) {
        console.log('erro ao buscar o produto', err);
      }finally{
        setLoading(false);
      }
    }
    }

    if (scanned && value) {
      busca();
    }
  }, [scanned, value]);


  useEffect(() => {
    async function fetchSetores() {
      try {
        const response = await api.get(`/acerto/setores`);
        setSetor(response.data);
        const response2 = await api.get(`/acerto/produtoSetor/${prod.codigo}`)
          setProdSetores(response2.data);

      } catch (err) {
        console.log(err +" erro ao consultar /acerto/setores ");
        console.log(err+ ` erro ao consultar /acerto/produtoSetor/${prod.codigo}`);

      }
    }
  
    if (scanned && value) {
      fetchSetores();
    }
  }, [scanned, value]);

  useEffect( ()=>{
    const aux = prodSetores?.find( (item:any)=>  item.codigo === selectedSetor?.codigo)
    setProdSetor(aux)
    if(aux){
      setSaldoAtual(aux.estoque);

    }

},[selectedSetor])




  function closeModal(){
    setScanned(false);
    setValue(undefined)
    setSelectedSetor(undefined)
    setDataRequest(undefined)
    setNovoSaldo(0)
  }

function changeSetor(item:any) {
  return (
      <View>
      <TouchableOpacity onPress={() => setSelectedSetor(item)} style={{ backgroundColor: '#FFF', margin: 5,  borderRadius: 5, elevation:5,padding:3}}>
          <Text style={{ fontWeight: 'bold' }}>
              CODIGO: {item?.codigo}
            
          </Text>
          <Text style={{ fontWeight: 'bold' }}>
             SETOR: {item?.nome}
          </Text>
          
      </TouchableOpacity>
      </View>
  )
}
  
function atualizaSaldo(v: any) {
  setNovoSaldo(v);
  let aux = parseInt(v) 
  prod.estoque = aux
  prod.setor = selectedSetor.codigo

  //item.estoque = v;
}

  const handleBarCodeScanned = ({ type, data }:any) => {
    setScanned(true);
    setValue(data);

   /**  Alert.alert(
      'Código de barras lido!',
      `Tipo: ${type}\nValor: ${data}`,
      [{ text: 'OK', onPress: () => setScanned(false) }]
    );
    */
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Acesso à câmera negado</Text>;
  }

 


  async function postAcerto(){
    if(prod.estoque < 0 ||  prod.estoque === undefined  ){
      return  Alert.alert("alert", "você nao informou uma quantidade !")
   }
    try{

   await api.post('/acerto/',prod);
    const response =  await api.post('/acerto/',prod);
    if(response.status ==200 ){
      Alert.alert(response.data.ok, `saldo ${prod.estoque}  setor: ${prod.setor}`)
      setNovoSaldo(0)
    }
      setScanned(false);
      setSaldo(0);
      setSelectedSetor(undefined);      
      console.log(response.data)
    
    }catch(err) {
    console.log(err)
  }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#333'}/>

      <CameraView
        style={styles.camera}  facing={'back'}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
    
    >
      </CameraView>

  
   { scanned && value && (
        <Modal visible={ scanned }>
                    <View style={{ flex: 1,  backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems:'center' ,justifyContent:'center'}}>
                  
            { loading ? ( // Display "buscando produto" message when loading is true
              <Text>Buscando produto...</Text>
            ) : (
              prod !== undefined ? (
                <View>
                
                <View style={{ backgroundColor: "#f0f0f0", borderRadius: 7, marginTop: 40, padding: 20, elevation: 9 }}>
                <TouchableOpacity onPress={() => closeModal()} style={{ alignSelf: "flex-end", padding: 5 }}>
                                <Text style={{ color: "red" }}>Fechar</Text>
                            </TouchableOpacity>  


                  <View style={{backgroundColor:"#3339", padding:5, borderRadius:5 }}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{fontWeight:'bold' ,color: '#FFF'}}> Código:  </Text> 
                          <Text style={{color:'#FFF'}} > { prod.codigo }</Text>
                      </View>
                      <View style={{flexDirection:'column',marginTop:3}}>
                        <Text style={{fontWeight:'bold', color: '#FFF'}}> { prod.descricao }</Text>
                      </View>
                 </View>
                 

                          {
                          selectedSetor !== undefined ?

                  <View >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                          <Text style={{ fontSize: 15, fontWeight:'bold', color: '#42414d' }} >setor: {selectedSetor?.nome}</Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                          <Text style={{ fontSize: 15, fontWeight:'bold', color: '#42414d'}}> novo saldo {novoSaldo} </Text>
                           <Text style={{ fontSize: 15, fontWeight:'bold', color: '#42414d'}} >saldo atual: { saldoAtual}</Text>
                       
                      </View>

                      <View style={{ alignItems: 'center' }}>
                          <TextInput style={{ backgroundColor:'#FFF', marginTop: 5, borderRadius: 5,  paddingHorizontal: 95 , elevation:7}}
                              onChangeText={(v) => atualizaSaldo(v)}
                              placeholder="ex. 5"
                              keyboardType='numeric'
                          />


                    <TouchableOpacity style={{backgroundColor:"#FFF", borderRadius:5, alignItems:'center', elevation:7, marginTop:"15%", padding:8, width:"80%"}}
                    onPress={()=> postAcerto()}
            
                    >
                        <Text  style={{ fontSize: 15, fontWeight:'bold', color: '#42414d'}} >
                          GRAVAR
                        </Text>
                      </TouchableOpacity>
                      
                      </View>
                  </View>

                  :
                  <View style={{borderWidth:1, borderColor:'#333', marginTop:5, borderRadius:6 }}>
                      <View style={{ alignItems: 'center' }} >
                          <Text>selecione um setor</Text>
                      </View>
                      <View style={{padding:5}}>
                         
                          { setor === undefined ?
                          <Text>carregando setores...</Text>
                              :
                              <FlatList
                              data={setor}
                              //horizontal= {true}
                              renderItem={({ item }) => changeSetor(item)}
                            />
                          }
                      </View>
                  </View>
                  }

            
                 </View>
                </View>
              ) : (
                <View>
                  <Text>Produto não encontrado!</Text>
                  <Button 
                  title='OK'
                   onPress={()=>{closeModal()}}
                     />
                </View>
              )
            )
            }
          </View>
        </Modal>
      )
     }
      
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop:20
  },
  camera: {
    flex: 1,
  },
});
