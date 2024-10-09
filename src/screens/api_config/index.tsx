import { Alert, Button, Text, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { queryConfig_api } from "../../database/queryConfig_Api/queryConfig_api"
import { useState } from "react"


export const Api_config= ()=>{
    
    const [ url   , setUrl   ] = useState();
    const [ porta , setPorta ] = useState();
    const [ token , setToken ] = useState();


    const useQueryApi = queryConfig_api();



    async function cadastrar(){

         if( !url || url === ''){
            return Alert.alert("É necessario informar uma url valida!")
         }
         if( !porta || porta === ''){
            return Alert.alert("É necessario informar uma porta valida!")
         }


         let config = { codigo:1, url: url, porta:porta, token:token }

         await useQueryApi.create(config);
    }

    return(
 
        <View style={{flex:1}}>
            <Text >
                Configurações
            </Text>

                <View style={{ margin:10}} >
                   <Text> Url Da Api :</Text>                 
                            <TextInput style={{ marginTop:10 ,  backgroundColor:'#CCC', width:'90%', padding:15, borderRadius:5   }} placeholder="url: ex.  192.168.100.100"
                                onChangeText={(v)=>setUrl(v)}
                            >
                               { url ? url : null}  
                            </TextInput>
                </View>

                <View style={{ margin:10}} >
                        <Text> Porta :</Text>                 
                             <TextInput style={{marginTop:10 ,   backgroundColor:'#CCC', width:'90%', padding:15, borderRadius:5   }} placeholder="porta: ex. 3000"
                                onChangeText={(v)=>setPorta(v)}
                             >
                                    { porta ? porta : null}  
                             </TextInput>
                </View>

                <View style={{ margin:10}} >
                        <Text> Token :</Text>                 
                            <TextInput style={{marginTop:10 ,   backgroundColor:'#CCC', width:'90%', padding:15, borderRadius:5   }} placeholder="Token:"
                                onChangeText={(v)=>setToken(v)}
                            >
                                { token ? token : null}  
                            </TextInput>
                </View>

               <View style={{ margin:10}} >
                   <Button
                         title="Salvar"
                         onPress={()=> cadastrar()}
                     />
              </View>

        </View>
    )

}