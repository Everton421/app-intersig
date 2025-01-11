import { useState } from "react";
import { Alert, Button, FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors"
import useApi from "../../services/api";
import { useCategoria } from "../../database/queryCategorias/queryCategorias";
import { useMarcas } from "../../database/queryMarcas/queryMarcas";
import { useFormasDePagamentos } from "../../database/queryFormasPagamento/queryFormasPagamento";

export const Cadastro_FormaPagamento = ( {navigation}:any ) => {


    const [ input , setInput ] = useState('');
    const [ marcaApi, setMarcaApi ] = useState<boolean>(false);
     
    const [ quantidade, setQuantidade ] = useState() ;
    const [ intervalo, setIntervalo ] = useState(1);
    const [ parcelas, setParcelas ] = useState<parcela[]>();
    const [ descricao, setDescricao ] = useState<string>(); 
    let api = useApi();
    let useQueryfpgt = useFormasDePagamentos();

     type parcela = {
        parcela:number
        vencimento:number
    }


    const Gerar = () => {
        let vencimento = intervalo;
        let parcelas1: parcela[] = [];
        for (let i = 1; i <= quantidade; i++) {
          parcelas1.push({ parcela: i, vencimento: vencimento * i });
        }
    
    
      const Item = ({ item }: { item: parcela }) => {
        return <Text>{` Parcela: ${item.parcela},  Vencimento: ${item.vencimento}`} dias </Text>;
      };
    
      return (
            <View style={{ flex: 1, backgroundColor: "#EAF4FE" , alignItems:"center" ,maxHeight:150 }}>
                <View style={{ marginTop: 20, backgroundColor:'#FFF', width:'90%',borderRadius:5, elevation:3 }}>

                    <FlatList
                    data={parcelas1}  
                    renderItem={Item}  
                    keyExtractor={(item) => item.parcela.toString()} 
                    />

                </View>
            </View>
        );
    };

    async function gravar() {
        if(!intervalo || intervalo === null) return Alert.alert('É necessario informar o intervalo para gravar!')
         if(!quantidade || quantidade === null) return Alert.alert('É necessario informar a quantidade de parcelas para gravar!')
            let data =
         {
            intervalo:Number(intervalo),
            parcelas:Number(quantidade),
            descricao:descricao
        }
        console.log(data);

        try{
          let response = await api.post('/formas_pagamento',  {data} );
            if(response.data.codigo > 0  ){
                let result:any = await useQueryfpgt.create(response.data)
                 if(result > 0  ) {
                          Alert.alert(`Forma De Pagamento registrada com sucesso!`) 
                         setTimeout(()=>{},3000);
                         navigation.goBack()
                    }
            }
        }catch(e){ }
        }


    return (
        <View style={{ flex:1 ,  backgroundColor:'#EAF4FE'}}>

 
            <View style={{ marginTop:20}}>
                <Text style={{   left:5, bottom:5  ,fontWeight:"bold"  }} > Descrição:</Text>
                       <View style={{ margin: 7, backgroundColor: '#FFF', padding: 2, borderRadius: 5, elevation: 3 }}>
                            <TextInput
                                style={{ padding: 5, backgroundColor: '#FFF' }}
                                placeholder=" 30/60 dias"
                                 onChangeText={(v:any)=> setDescricao(v)}
                                 value={descricao}
                            />
                      </View>    
             </View>
              
                    <View style={{margin:5, flexDirection:"row", alignItems:"center", justifyContent:"space-between",   width:'100%'}}>

                    <View style={{ width:'50%' }}>
                    <Text style={{   left:5, bottom:5  ,fontWeight:"bold"  }} >quantidade de parcelas:</Text>
                                <TextInput
                                    style={{ elevation:2, borderRadius:5 ,width:'90%',margin:5,padding: 5, backgroundColor: '#FFF' }}
                                    placeholder="ex. 2"
                                     onChangeText={(v:any)=> setQuantidade(v)}
                                     keyboardType="numeric"
                                />
                            </View>

                            <View style={{ width:'50%' }}>
                            <Text style={{   left:5, bottom:5  ,fontWeight:"bold"  }} >intervalo entre parcelas:</Text>
                                <TextInput
                                    style={{ elevation:2,borderRadius:5 ,width:'90%',margin:5,padding: 5, backgroundColor: '#FFF' }}
                                    placeholder="ex. 30"
                                     onChangeText={(v:any)=> setIntervalo(v)}
                                     keyboardType="numeric"
                                />
                            </View>
                    </View>
                <Gerar/>
                            

             <View style={{ flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center", marginTop: 10 }} >
                    <TouchableOpacity 
                    style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius: 15, padding: 5 }}
                       onPress={ ()=> gravar()}
                    >
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
                    </TouchableOpacity>
                </View>
  

        </View>
    )
}