import { useContext, useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors"
import useApi from "../../services/api";
import { useCategoria } from "../../database/queryCategorias/queryCategorias";
import { useMarcas } from "../../database/queryMarcas/queryMarcas";
import { useFormasDePagamentos } from "../../database/queryFormasPagamento/queryFormasPagamento";
import NetInfo from '@react-native-community/netinfo';
import { ConnectedContext } from "../../contexts/conectedContext"
import { LodingComponent } from "../../components/loading";


export const Cadastro_FormaPagamento = ( { route, navigation}:any ) => {
     
    const [ codigo, setCodigo ] = useState();
    const [ quantidade, setQuantidade ] = useState(1) ;
    const [ intervalo, setIntervalo ] = useState(1);
    const [ parcelas, setParcelas ] = useState<parcela[]>();
    const [ descricao, setDescricao ] = useState<string>(); 
    const [ loading, setLoading ] = useState(false);

    let api = useApi();
    let useQueryfpgt = useFormasDePagamentos();
    const {connected,  setConnected} = useContext(ConnectedContext)

    let {  codigo_formaPagamento  }  =   route.params || { codigo_formaPagamento : 0};

     type parcela = {
        parcela:number
        vencimento:number
    }

    useEffect(() => {
        function setConexao(){
           const unsubscribe = NetInfo.addEventListener((state) => {
                   setConnected(state.isConnected);
                   console.log('conexao com a internet :', state.isConnected);
              });
           // Remove o listener quando o componente for desmontado
           return () => {
               unsubscribe();
           };
       }
       setConexao();

        async function busca(){
            let aux = await useQueryfpgt.selectByCode(codigo_formaPagamento);
                if(aux && aux?.length > 0){
                    console.log(aux)
                    setCodigo(codigo_formaPagamento);
                    setIntervalo(aux[0].intervalo)
                    setDescricao(aux[0].descricao)
                    setQuantidade(aux[0].parcelas)
                }
        }
       if(codigo_formaPagamento){
          busca();
       }


       }, []);

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
        if( connected === false ) return Alert.alert('Erro', 'É necessario estabelecer conexão com a internet para efetuar o cadastro !');

         if(!quantidade || quantidade === null) return Alert.alert('É necessario informar a quantidade de parcelas para gravar!')
            let data =
         {  
            codigo:codigo_formaPagamento,
            intervalo:Number(intervalo),
            parcelas:Number(quantidade),
            descricao:descricao
        }
        if( codigo_formaPagamento > 0){
           
            try{
                setLoading(true)
               let response = await api.put('/formas_pagamento',   data  );
                if( response.status === 200 && response.data.codigo > 0  ){
                    let result:any = await useQueryfpgt.update(response.data, response.data.codigo)
                            navigation.goBack()
                            return  Alert.alert('',`Forma De Pagamento Atualizada com sucesso!`) 
                }

            }catch(e:any){
                if(e.status === 400 ){
                    return  Alert.alert(`Erro!`, e.response.data.msg); 
                }else{
                    return Alert.alert(`Erro!`, 'Erro Desconhecido!');
                } 
            }finally{
                setLoading(false)
            }
        }else{
                try{
                        setLoading(true)
                    let response = await api.post('/formas_pagamento',   data  );

                        if( response.status === 200 && response.data.codigo > 0  ){
                            let result:any = await useQueryfpgt.create(response.data)
                            if(result > 0  ) {
                                    navigation.goBack()
                                    return  Alert.alert('',`Forma De Pagamento registrada com sucesso!`) 
                                }
                        }

                    }catch(e:any){
                        if(e.status === 400 ){
                            return  Alert.alert(`Erro!`, e.response.data.msg); 
                        }else{
                            return Alert.alert(`Erro!`, 'Erro Desconhecido!');
                        } 
                    }finally{
                        setLoading(false)
                    }
        }
      
         
        }


    return (
        <View style={{ flex:1 ,  backgroundColor:'#EAF4FE'}}>

            <LodingComponent isLoading={loading} />
 
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
                                     defaultValue={String(quantidade)}
                                     keyboardType="numeric"
                                />
                            </View>

                            <View style={{ width:'50%' }}>
                            <Text style={{   left:5, bottom:5  ,fontWeight:"bold"  }} >intervalo entre parcelas:</Text>
                                <TextInput
                                    style={{ elevation:2,borderRadius:5 ,width:'90%',margin:5,padding: 5, backgroundColor: '#FFF' }}
                                    placeholder="ex. 30"
                                     onChangeText={(v:any)=> setIntervalo(v)}
                                     defaultValue={String(intervalo)}
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