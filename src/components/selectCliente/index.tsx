import { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useClients } from "../../database/queryClientes/queryCliente";

import AntDesign from '@expo/vector-icons/AntDesign';


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
    const [pesquisa, setPesquisa] = useState('');
    const [ data, setData ] = useState([])
    const [ visible, setVisible]= useState<boolean>(false)
    const [ nomeCliente, setNomeCliente ] = useState<string>();

     const useQueryClients = useClients();

    ////////////////////
        useEffect(() => {
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

    const renderItem = ({ item } :cliente)  => {
        return (
            <TouchableOpacity style={[styles.item, { backgroundColor:  '#009de2'  }]} 
            onPress={()=> selectCliente(item)}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                       <Text style={  { fontWeight:  'bold', color:'#FFF'  }  }>
                         Código: {item.codigo}
                      </Text>
                </View>
                <Text style={[styles.txtDescricao, { color:  'white'    }]}>
                {item.nome}
                </Text>
            <View>
              <View style={{   justifyContent: 'space-between', margin: 2 }}>            
                   <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
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
                    style={{ backgroundColor: '#FFF',padding:3, flexDirection:"row",alignItems: "center", justifyContent: "space-between", borderRadius: 5,elevation:3 , width:'90%' }}
                         onPress={()=>setVisible(true)}
                    >
                        {
                            nomeCliente ? (
                                <Text style={{ fontWeight: "bold", }} numberOfLines={2} >{nomeCliente}</Text>
                            ):(
                                <Text style={{ fontWeight: "bold",     }}numberOfLines={2} >Cliente</Text>
                            )
                        }
                        <AntDesign name="caretdown" size={24} color="black" />
                </TouchableOpacity>

     <Modal visible={visible}  animationType="slide"  transparent={true} >
                <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                <View
                                    style={{
                                        margin: 20,backgroundColor: 'white',borderRadius: 20,width: '90%',height: '90%',shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },shadowOpacity: 0.25,shadowRadius: 4,elevation: 5,
                                    }} >
                
                        <View style={{padding:5}}>
                                <TouchableOpacity onPress={()=>setVisible(false)}
                                    style={{margin:15, backgroundColor:'#009de2',padding:7, borderRadius:7,width:'25%',elevation: 5}} >
                                    <Text style={{color:'#FFF',fontWeight:'bold'}}>
                                        voltar
                                </Text>
                                </TouchableOpacity>
                        </View>

                        <View style={{marginBottom:20, margin:5, flexDirection:'row',justifyContent:'space-between', elevation:5}}>
                            <TextInput
                                style={{  backgroundColor: '#FFF', borderRadius: 4,   width:'80%',  padding:7, margin:2,  elevation: 5}}
                                placeholder='Pesquisar'
                                value={pesquisa}
                                onChangeText={setPesquisa}
                                placeholderTextColor='#009de2'
                            />
                                <TouchableOpacity  style={{  borderRadius: 5,backgroundColor: 'red',width: 50,  alignItems: 'center',justifyContent:'center' }}>
                                    <Text style={{color:'#FFF',fontWeight:'bold'}}>limpar</Text>
                                </TouchableOpacity>
                        </View>

                        <View style={{backgroundColor:'#dcdcdd'}}>
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.codigo}
                            />
                        </View>

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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    elevation: 5
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
