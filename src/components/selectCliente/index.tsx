import { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useClients } from "../../database/queryClientes/queryCliente";

import AntDesign from '@expo/vector-icons/AntDesign';
import { defaultColors } from "../../styles/global";
import { Ionicons } from "@expo/vector-icons";


type cli={
    codigo:number
    nome:string,
    cnpj:string,
    ie:string,
    endereco:string
    numero:any
}




interface cliente    { item: cli }

type props={
    codigoCliente:number | null,
    setCodigoCliente:  (codigo:number)=> void
    
}
export const SelectCliente = ({codigoCliente, setCodigoCliente}:props ) =>{
    const [pesquisa, setPesquisa] = useState<string>('');
    const [ data, setData ] = useState([])
    const [ visible, setVisible]= useState<boolean>(false)
    const [ nomeCliente, setNomeCliente ] = useState<string>();

     const useQueryClients = useClients();

    ////////////////////
  /*      useEffect(() => {
          const busca = async () => {
              try{
                let aux:any = await  useQueryClients.selectByDescription(pesquisa,10);
                setData(aux)
              }catch(e){ console.log(e)}
          };
          busca();
  
          if (pesquisa === null || pesquisa === '') {
              setPesquisa('');
            }
        }, [pesquisa]);
  */

        useEffect(() => {
            const busca = async () => {
                if( codigoCliente && codigoCliente !== null ){
                
                try{
                  let aux:any = await  useQueryClients.selectByCode(codigoCliente);
                    setNomeCliente(aux[0].nome);
                }catch(e){ console.log(e)}
                } 
            };
            busca();
            },[codigoCliente])
    ////////////////////

    
    function selectCliente(item:cli){
       setCodigoCliente(item.codigo)
        setNomeCliente(item.nome)
        setVisible(false)
    }
    type prop ={ item:cli   }

    const renderItem = ({ item   } :prop)  => {
        return (
            <TouchableOpacity style={[styles.item,{   backgroundColor: codigoCliente === item.codigo ? defaultColors.darkBlue: '#FFF'  } ] } 
            onPress={()=> selectCliente(item)}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                   <Text style={[ { color: 'white', fontWeight: 'bold', fontSize: 15 }, { color: codigoCliente === item.codigo ? '#FFF': defaultColors.gray } ]}>
                         Código: {item.codigo}
                      </Text>
                </View>
                   <Text style={[ { color: 'white', fontWeight: 'bold', fontSize: 15 }, { color: codigoCliente === item.codigo ? '#FFF': defaultColors.gray } ]}>
                     {item.nome}
                  </Text>
             <View>
              <View style={{   justifyContent: 'space-between', margin: 2 }}>            
                   <Text style={[ { color: 'white', fontWeight: 'bold', fontSize: 15 }, { color: codigoCliente === item.codigo ? '#FFF': defaultColors.gray } ]}>
                    CNPJ : {item.cnpj}  
                   </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      };
    

return(
    <View style={{width:'100%', alignItems:'center'}}  >
        
            <TouchableOpacity 
                    style={{ backgroundColor: '#FFF',padding:3, flexDirection:"row",alignItems: "center", justifyContent: "space-between", borderRadius: 5,elevation:3 , width:'90%', marginTop:10 }}
                         onPress={()=>setVisible(true)}
                    >
                        {
                            nomeCliente ? (
                                <Text style={{ fontWeight: "bold",fontSize:20, color: defaultColors.gray }} numberOfLines={2} >{nomeCliente}</Text>
                            ):(
                                <Text style={{ fontWeight: "bold",fontSize:25, color: defaultColors.gray }}numberOfLines={2} >Cliente</Text>
                            )
                        }
                        <AntDesign name="caret-down" size={24} color={ defaultColors.darkBlue} />
                </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", height: "90%", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 5 }}>
            <View style={{ backgroundColor: '#185FED', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Selecionar Cliente</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 12, height: 45 }}>
                <Ionicons name="search" size={20} color="#185FED" style={{ marginRight: 8 }} />
                <TextInput
                  style={{ flex: 1, color: '#333', fontSize: 15, fontWeight: 'normal' }}
                  placeholder='Pesquisar cliente...'
                  placeholderTextColor="#999"
                  value={pesquisa}
                  onChangeText={setPesquisa}
                />
              </View>
            </View>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.codigo.toString()}
              contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
 )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     
  },
  item: {
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    width:'80%',
    padding:7,
    margin:2,
    elevation: 5
  },
 
  
  button: {
    margin: 3,
    backgroundColor: '#FFF',
    elevation: 4,
    width: 60,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15
  },
  txtDescricao: {
    fontWeight: 'bold',
    fontSize: 15
  },
  txt: {
    fontWeight: 'bold',
  }
});
