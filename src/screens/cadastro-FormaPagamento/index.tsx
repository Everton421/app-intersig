import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View, TextInput, ScrollView } from "react-native"
import useApi from "../../services/api";
import { useFormasDePagamentos } from "../../database/queryFormasPagamento/queryFormasPagamento";
import NetInfo from '@react-native-community/netinfo';
import { ConnectedContext } from "../../contexts/conectedContext"
import { LodingComponent } from "../../components/loading";
import { defaultColors } from "../../styles/global";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CustomHeader } from "../../components/custom-header";


export const Cadastro_FormaPagamento = ( { route, navigation}:any ) => {
     
    const [ codigo, setCodigo ] = useState();
    const [ quantidade, setQuantidade ] = useState(1) ;
    const [ intervalo, setIntervalo ] = useState(1);
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
    
       
      const renderItem = ({ item }:{ item: parcela } )=>{
        return (
            <View style={{ elevation:7 ,flexDirection:"row", gap:7, alignItems:"center", width:'90%', backgroundColor:'#FFF',borderRadius:5  ,padding: 2, margin:3}}>
                
                <View style={{marginLeft:10 }}>
                    <FontAwesome name="credit-card-alt" size={24} color={defaultColors.darkBlue } />
                </View>
                
                <View style={{ }}>
                    <Text style={{ fontWeight:"bold",color:defaultColors.gray, fontSize:15 }} > {` Parcela: ${item.parcela} `}    </Text>
                    <Text style={{ fontWeight:"bold",color:defaultColors.gray, fontSize:15 }} > Vencimento:  {item.vencimento} dias </Text>
                </View>

            </View>
        )
      }
    

      return (
                <View style={{ width:'100%', left:5, maxHeight:'70%'}}>

                    <FlatList
                    data={parcelas1}  
                    renderItem={renderItem}  
                    keyExtractor={(item) => item.parcela.toString()} 
                    />
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
        <View style={{ flex: 1, backgroundColor: '#F0F4F8' }}>
          <LodingComponent isLoading={loading} />
          <CustomHeader
            title="Forma de Pagamento"
            showSearch={false}
            onBack={() => navigation.goBack()}
          />
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Descrição</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                  placeholder="Ex: 30/60 dias"
                  placeholderTextColor="#999"
                  onChangeText={(v) => setDescricao(v)}
                  value={descricao}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Qtd. Parcelas</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                    placeholder="Ex: 2"
                    placeholderTextColor="#999"
                    onChangeText={(v) => setQuantidade(v)}
                    defaultValue={String(quantidade)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Intervalo (dias)</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                    placeholder="Ex: 30"
                    placeholderTextColor="#999"
                    onChangeText={(v) => setIntervalo(v)}
                    defaultValue={String(intervalo)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <Gerar />

            <TouchableOpacity
              style={{ backgroundColor: '#185FED', borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 20, elevation: 4, shadowColor: '#185FED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 }}
              onPress={() => gravar()}
            >
              <Text style={{ fontWeight: 'bold', color: '#FFF', fontSize: 18 }}>Gravar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
    )
}