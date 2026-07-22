import { useContext, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View, TextInput, ScrollView } from "react-native"
import useApi from "../../services/api";
import { useMarcas } from "../../database/queryMarcas/queryMarcas";
import NetInfo from '@react-native-community/netinfo';
import { ConnectedContext } from "../../contexts/conectedContext"
import { LodingComponent } from "../../components/loading";
import { CustomHeader } from "../../components/custom-header";
import { AlertType, CustomAlert } from "../../components/custom-alert";

export const Cadastro_Marcas = ( {navigation}:any ) => {


    const [ input , setInput ] = useState('');
    const [ marcaApi, setMarcaApi ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState(false); 
     
    const api = useApi();
    const useQueryMarcas = useMarcas();

     const [isVisibleAlert,  setIsVisibleAlert] = useState(false);
    const [titleAlert,      setTitleAlert ] = useState('');
    const [messageAlert,    setMessageAlert] =useState('');
    const [typeAlert,       setTypeAlert] = useState<AlertType>('success');
    const [cancelText,      setCancelText] = useState<string | undefined>();
    const [confirmText,     setConfirmText] = useState<string | undefined>();


    const {connected,  setConnected} = useContext(ConnectedContext)

     
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
       }, []);

    
    async function gravar (){

        if( connected === false ){ 
                setIsVisibleAlert(true)
                setTitleAlert("Atenção!")
                setMessageAlert("É necessario estabelecer conexão com a internet para efetuar o cadastro !");
                setTypeAlert('warning')
                setCancelText(undefined)
                setConfirmText('ok')
                return 
        } 
        
        if(!input || input === "") {
                setIsVisibleAlert(true)
                setTitleAlert("Atenção!")
                setMessageAlert("É necessario informar com a descrição da marca")
                setTypeAlert('warning')
                setCancelText(undefined)
                setConfirmText('ok')
                return 
            }
 
       try{
              setLoading(true)

      const resultLastbrandId = await useQueryMarcas.findLastBrandCode();
        console.log(resultLastbrandId)
      /*
      console.log(resultLastbrandId);
        let lastbrandId =1;
        //if(resultLastbrandId && Number(resultLastbrandId[0].codigo > 0 )){
//
        //}
            let resposta = await api.post('/marcas', { "descricao": input, id: ''});
            
            if(resposta.status === 200 && resposta.data.codigo > 0 ){

                    let valid:any = await useQueryMarcas.selectByCode(resposta.data.codigo);
                        if(valid?.length > 0 ){
                            console.log(valid) 
                        }else{
                            await useQueryMarcas.create(resposta.data)
                        }
                    setInput('')
                    navigation.goBack()

                setIsVisibleAlert(true)
                setTitleAlert("Ok")
                setMessageAlert(`Marca ${input} registrada com sucesso! `)
                setTypeAlert('success')
                setCancelText(undefined)
                setConfirmText('ok')
                return 

                }
          }catch(e:any){
                
              setIsVisibleAlert(true)
                setTitleAlert("Erro")
                setMessageAlert(`${e.response.data.message}`)
                setTypeAlert('error')
                setCancelText(undefined)
                setConfirmText('ok')
                return 
          }finally{
            setLoading(false)
          }
          */
        } 


    return (
        <View style={{ flex: 1, backgroundColor: '#F0F4F8' }}>
          <LodingComponent isLoading={loading} />
          <CustomHeader
            title="Nova Marca"
            showSearch={false}
            onBack={() => navigation.goBack()}
          />
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
              <Text style={{ fontWeight: '600', fontSize: 14, color: '#6C757D', marginBottom: 6 }}>Descrição da Marca</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333', backgroundColor: '#F9F9F9' }}
                placeholder="Ex: Bosch"
                placeholderTextColor="#999"
                onChangeText={(v) => setInput(v)}
              />
              {marcaApi && (
                <Text style={{ color: '#E53935', marginTop: 8, fontWeight: '500' }}>
                  Já existe uma marca cadastrada com esta descrição!
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#185FED', borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 24, elevation: 4, shadowColor: '#185FED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 }}
              onPress={() => gravar()}
            >
              <Text style={{ fontWeight: 'bold', color: '#FFF', fontSize: 18 }}>Gravar Marca</Text>
            </TouchableOpacity>


  
    
            <CustomAlert
                    visible={isVisibleAlert}
                    message={messageAlert}
                    onConfirm={() => setIsVisibleAlert(false)}
                    onCancel={() => setIsVisibleAlert(false)}
                    title={titleAlert}
                    type={typeAlert}
                    cancelText={cancelText}
                    confirmText={confirmText}
                  />

          </ScrollView>
        </View>
    )
}