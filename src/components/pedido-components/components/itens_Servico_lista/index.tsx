import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { OrcamentoContext } from '../../../../contexts/orcamentoContext';






export const ItensServicoListaHorizontal = ({ item, handleDecrement, handleIncrement }) => {
    const [visibleModalServices, setVisibleModalServices] = useState(false);
    const { orcamento, setOrcamento } = useContext(OrcamentoContext)


    function deleteServicos(value){
        let novosServicos ;
        if(orcamento.servicos ){
          novosServicos = orcamento.servicos.filter((i) => i.codigo !== value.codigo);
       // console.log(novosProdutos);
        }  
       //setProdutos(novosProdutos)
       
       setOrcamento((prevOrcamento: OrcamentoModel) => ({
            ...prevOrcamento,
            servicos: novosServicos,
        }));

            
    }




    const alertaExclusao = (item) => {
        Alert.alert('', `deseja excluir o item : ${item.aplicacao} ?`, [
            {
                text: 'Não',
                 onPress: ( ) => console.log(  item    ),
              //  onPress: () => deleteServicos(item),
                style: 'cancel',
            },
            {
                //text: 'Sim', onPress: () => console.log( item   )
                text: 'Sim', onPress: () => deleteServicos( item   )

            }
        ])
    }



    return (

        <View style={{ backgroundColor: '#009de2', elevation: 7, margin: 3, borderRadius: 30, padding: 35 }}>


            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                  
                    <TouchableOpacity onPress={() => alertaExclusao(item)} style={{ elevation: 5 }}>
                        <FontAwesome name="close" size={24} color="white" />
                    </TouchableOpacity>

                     <TouchableOpacity style={{   margin: 2, width: 35, padding: 5,   borderRadius: 7, alignItems: "center" }}
                            onPress={() => setVisibleModalServices(true)} >
                            <Feather name="edit" size={24} color="white" />
                        </TouchableOpacity>
                </View>

            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={styles.buttonText}>
                    Codigo: {item.codigo}    Quantidade: {item.quantidade}
                </Text>
                {/***  item exclusao */}
            </View>

            <Text style={ [styles.buttonText,{   width: '90%' }]}  >
                {item.aplicacao}
            </Text>

    

       
                
                    <Text style={styles.buttonText}> Unitario: {item?.valor.toFixed(2)} </Text>
            

              <Text style={[ styles.buttonText ,{ color: 'white',  elevation: 5 } ] }>
                        Total R$: {item.total}
             </Text>


            <Modal visible={visibleModalServices} transparent={true} >
                <View style={{
                    marginTop: 25, margin: 10, backgroundColor: 'white', borderRadius: 20, width: '96%',
                    height: '80%', shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                }}>

                    <TouchableOpacity
                        onPress={() => { setVisibleModalServices(false) }}
                        style={{ margin: 15, backgroundColor: '#009de2', padding: 7, borderRadius: 7, width: '25%', elevation: 5 }} >
                        <Text style={styles.buttonText}>
                            voltar
                        </Text>
                    </TouchableOpacity>


                    <View style={{ margin: 10 }} >
                        <Text style={styles.buttonText}>
                            Cod. {item.codigo}    Qtd. {item.quantidade}
                        </Text>
                        <Text style={{ fontWeight: 'bold', width: '80%' }} numberOfLines={2}>
                            {item.descricao}
                        </Text>
                    </View>

                    <View style={{ marginTop: 3 }}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'white', borderRadius: 25, elevation: 4, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}> { } </Text>
                            </View>
                            <View style={styles.buttonsContainer}
                            >
                                <TouchableOpacity
                                    onPress={() => handleIncrement(item)} style={styles.button}
                                >
                                    <Text style={styles.buttonText}
                                    > + </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDecrement(item)} style={styles.button}
                                >
                                    <Text style={styles.buttonText}
                                    > - </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, elevation: 5 }}>
                                Total R$: {item.total}
                            </Text>
                        </View>
                    </View>

                </View>
            </Modal>


        </View>
    );
}

const styles = StyleSheet.create({
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
    }, buttonsContainer: {
        flexDirection: 'row'
    },
})