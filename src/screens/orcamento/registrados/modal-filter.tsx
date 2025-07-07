import { Modal, Text, TouchableOpacity, View } from "react-native"
import { useCallback, useContext, useEffect, useState } from "react"
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-timezone';


  type statusPedido = {
                todos:boolean
                orcamentos:boolean
                pedidos:boolean
                faturado:boolean
                reprovados:boolean
                parcial:boolean
              }
type props = {
     visible:boolean ,
     setVisible: React.Dispatch<React.SetStateAction<boolean>>,
     setStatus: React.Dispatch<React.SetStateAction< string >>
    setDate:any
    }


     
export const ModalFilter = ({ visible , setVisible, setStatus,   setDate }:props ) =>{

     
        const [showPicker, setShowPicker] = useState(false);
            const [ auxData, setAuxData ] = useState<string | Date >( new Date() );
        const [ statusSelecionado, setStatusSelecionado ] = useState('EA');

            function selectStatus( status:string ){
                    switch ( status ){
                        case '*':
                                setStatusSelecionado('*')
                                setStatus('*')
                            break;
                        case 'EA':
                                setStatusSelecionado('EA')
                                setStatus('EA')
                            break;
                        case 'FI':  
                                setStatusSelecionado('FI')
                                setStatus('FI')
                                break;
                        case 'FP':  
                                setStatusSelecionado('FP')
                                setStatus('FP')
                             break;
                          case 'AI':
                             setStatusSelecionado('AI')
                                setStatus('AI')
                             break;
                           case 'RE':
                             setStatusSelecionado('RE')
                                setStatus('RE')
                           break;
                            default:  
                               setStatusSelecionado('*')
                                setStatus('*')
                        
                        }
            }

        
 

    const formatDate  = ( date:string )=>{
        let auxDate = new Date(date);
    const year = auxDate.getFullYear();
        const month = String(auxDate.getMonth() + 1).padStart(2, '0');
        const day = String(auxDate.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    const handleEvent = (event:any , selectedDate:any) => {
         const currentDate = selectedDate || new Date();
         const dia = String(currentDate.getDate()).padStart(2,'0');
         const mes = String( currentDate.getMonth()).padStart(2,'0');
         const ano = currentDate.getFullYear();
         const data = `${ano}-${mes}-${dia}`;
         setAuxData( data )
        console.log(data)
        setDate(data)
    setShowPicker(false);
    };
    
        return(
                 <Modal  visible={visible}  transparent={true} >
                            <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" , flex:1, alignItems:"center", justifyContent:"flex-start" }}>
                                <View style={{ backgroundColor:'#FFF', width:'80%', height:'80%', marginTop:10, borderRadius:10 }}>    
                                              <TouchableOpacity onPress={()=>setVisible(false)}
                                                           style={{ margin:10, backgroundColor:'#0023F5',height: 30 ,alignItems:"center",justifyContent:"center",  borderRadius:7,width:'20%',elevation: 5}} >
                                                            <Text style={{color:'#FFF',fontWeight:'bold'}}>
                                                              voltar
                                                            </Text>
                                               </TouchableOpacity>
                                        
                                        <View style={{   width:'95%', height:"100%", marginLeft: 5 } } >
                                                        <View style={{  borderColor: '#DDD', borderWidth: 1,padding: 10,marginVertical: 5, borderRadius: 5, width: '95%'  }}>
                                                          <Text style={{ fontWeight:"bold"}}> Data Cadastro:</Text>   

                                                        <TouchableOpacity onPress={() => setShowPicker(true)} style={{ flexDirection: 'row', gap: 7 }}>
                                                        <Fontisto name="date" size={24} color="black" />
                                                            <Text style={{ fontSize: 20, fontWeight: 'bold' , width:'100%'}}>
                                                                {  formatDate(auxData) }
                                                            </Text>
                                                          </TouchableOpacity>
                                                       { showPicker &&
                                                          <DateTimePicker
                                                             value={new Date(auxData)}
                                                            display="calendar"
                                                            mode="date"
                                                            onChange={handleEvent}
                                                            //locale="pt-BR"
                                                         />
                                                         }
                                                       </View>
                                                <View style={{    backgroundColor: '#FFF'   }}>

                                                            <View style={{ marginBottom: 5,  width: '100%', alignItems: 'center' }}>
                                                                <TouchableOpacity
                                                                    style={{ marginVertical: 5, alignItems: "center", flexDirection: 'row', padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 5, width: '90%', justifyContent: 'center' }}
                                                                    onPress={() => {
                                                                           {   selectStatus('EA')   }  
                                                                    }}
                                                                >
                                                                    <View style={[{ width: 20, height: 20, borderWidth: 2, borderRadius: 10, marginRight: 10, alignItems: 'center', justifyContent: 'center', 
                                                                        borderColor:    statusSelecionado === 'EA'  ?  "#1E9C43" : "#868686" 
                                                                    }  
                                                                        ]}>
                                                                        {  statusSelecionado === 'EA'   ? (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#1E9C43", borderRadius: 5 }} />
                                                                          ) : (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#868686", borderRadius: 5 }} />
                                                                          )
                                                                        }
                                                                    </View>
                                                                    <Text style={{ fontWeight: "bold", color: "#868686", flexShrink: 1 }}>
                                                                        Orçamentos
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>

                                                            <View style={{ marginBottom: 5, width: '100%', alignItems: 'center' }}>
                                                                <TouchableOpacity
                                                                    style={{ marginVertical: 5, alignItems: "center", flexDirection: 'row', padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 5, width: '90%', justifyContent: 'center' }}
                                                                    onPress={() => {
                                                                        {  selectStatus('AI')
                                                                         }  
                                                                    }}
                                                                >
                                                                    <View style={[{ width: 20, height: 20, borderWidth: 2, borderRadius: 10, marginRight: 10, alignItems: 'center', justifyContent: 'center', 
                                                                        borderColor:     statusSelecionado === 'AI'     ? "#307CEB" : "#868686"
                                                                        }]}>
                                                                        { statusSelecionado === 'AI'    ? (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#307CEB", borderRadius: 5 }} />
                                                                       )  : (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#868686", borderRadius: 5 }} />
                                                                          )
                                                                        }
                                                                    </View>
                                                                    <Text style={{ fontWeight: "bold", color: "#868686", flexShrink: 1 }}>
                                                                        Pedidos
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>

                                                            <View style={{ marginBottom: 5, width: '100%', alignItems: 'center' }}>
                                                                <TouchableOpacity
                                                                    style={{ marginVertical: 5, alignItems: "center", flexDirection: 'row', padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 5, width: '90%', justifyContent: 'center' }}
                                                                    onPress={() => {
                                                                        selectStatus('FI')
                                                                    }}
                                                                >
                                                                    <View style={[{ width: 20, height: 20, borderWidth: 2, borderRadius: 10, marginRight: 10, alignItems: 'center', justifyContent: 'center', 
                                                                        borderColor:    statusSelecionado === 'FI'     ? "#FF7F27" : "#868686"
                                                                        }]}>
                                                                        { statusSelecionado === 'FI'  ? (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#FF7F27", borderRadius: 5 }} />
                                                                       )  : (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#868686", borderRadius: 5 }} />
                                                                          )
                                                                        }
                                                                    </View>
                                                                    <Text style={{ fontWeight: "bold", color: "#868686", flexShrink: 1 }}>
                                                                        Faturados
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={{ marginBottom: 5, width: '100%', alignItems: 'center' }}>
                                                                <TouchableOpacity
                                                                    style={{ marginVertical: 5, alignItems: "center", flexDirection: 'row', padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 5, width: '90%', justifyContent: 'center' }}
                                                                    onPress={() => {
                                                                        selectStatus('FP')
                                                                    }}
                                                                >
                                                                    <View style={[{ width: 20, height: 20, borderWidth: 2, borderRadius: 10, marginRight: 10, alignItems: 'center', justifyContent: 'center', 
                                                                        borderColor:   statusSelecionado === 'FP'    ? "#0023F5" : "#868686"
                                                                        }]}>
                                                                        {  statusSelecionado === 'FP'   ? (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#0023F5", borderRadius: 5 }} />
                                                                       )  : (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#868686", borderRadius: 5 }} />
                                                                          )
                                                                        }
                                                                    </View>
                                                                    <Text style={{ fontWeight: "bold", color: "#868686", flexShrink: 1 }}>
                                                                       Parcialmente faturados
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                         <View style={{ marginBottom: 5, width: '100%', alignItems: 'center' }}>
                                                                <TouchableOpacity
                                                                    style={{ marginVertical: 5, alignItems: "center", flexDirection: 'row', padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 5, width: '90%', justifyContent: 'center' }}
                                                                    onPress={() => {
                                                                      selectStatus('RE')
                                                                    }}
                                                                >
                                                                    <View style={[{ width: 20, height: 20, borderWidth: 2, borderRadius: 10, marginRight: 10, alignItems: 'center', justifyContent: 'center', 
                                                                        borderColor:  statusSelecionado === 'RE'  ? "red" : "#868686"
                                                                        }]}>
                                                                        { statusSelecionado === 'RE'? (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "red", borderRadius: 5 }} />
                                                                       )  : (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#868686", borderRadius: 5 }} />
                                                                          )
                                                                        }
                                                                    </View>
                                                                    <Text style={{ fontWeight: "bold", color: "#868686", flexShrink: 1 }}>
                                                                        Reprovados
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={{ marginBottom: 5, width: '100%', alignItems: 'center' }}>
                                                                <TouchableOpacity
                                                                    style={{ marginVertical: 5, alignItems: "center", flexDirection: 'row', padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 5, width: '90%', justifyContent: 'center' }}
                                                                    onPress={() => {
                                                                      selectStatus('*')
                                                                    }}
                                                                >
                                                                    <View style={[{ width: 20, height: 20, borderWidth: 2, borderRadius: 10, marginRight: 10, alignItems: 'center', justifyContent: 'center', 
                                                                        borderColor: statusSelecionado === '*'   ? "#000" : "#868686"
                                                                        }]}>
                                                                        {  statusSelecionado === '*' ? (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#000", borderRadius: 5 }} />
                                                                       )  : (
                                                                            <View style={{ width: 10, height: 10, backgroundColor: "#868686", borderRadius: 5 }} />
                                                                          )
                                                                        }
                                                                    </View>
                                                                    <Text style={{ fontWeight: "bold", color: "#868686", flexShrink: 1 }}>
                                                                        Todos
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                            
                                              </View>
                                        </View>

                                </View>
                            </View>
                        </Modal>

        )
}