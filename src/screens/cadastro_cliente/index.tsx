import { Text, TextInput, TouchableOpacity, View } from "react-native"

export const Cadastro_cliente = ({navigation}:any)=>{
    return(
        <View style={{ flex:1}}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#EAF4FE' }} >

                <View style={{ margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 5 }}>
                                    <Text>Razao social:</Text>
                                   <TextInput
                                       style={{ padding: 5, backgroundColor: '#FFF' }}
                                       placeholder="descrição"
                                   />
                  </View>
        </View>   

    </View>   
    )
}