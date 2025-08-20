import React, { useEffect, useContext, useState } from "react";
import { View, FlatList, Text, Alert,   TouchableOpacity,   Image, ActivityIndicator, ScrollView } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { restartDatabaseService } from "../../services/restartDatabase";
import { queryEmpresas } from "../../database/queryEmpresas/queryEmpresas";
import  MaterialIcons from '@expo/vector-icons/MaterialIcons';
import  useApi from "../../services/api";
import { defaultColors } from "../../styles/global";
import { queryConfig_api } from "../../database/queryConfig_Api/queryConfig_api";
import { configMoment } from "../../services/moment";
import { useSyncProdutos } from "../../hooks/sync-produtos/useSyncProdutos";
import { useSyncCategorias } from "../../hooks/sync-categorias/useSyncCategorias";
import { useSyncFotos } from "../../hooks/sync-fotos/useSyncFotos";
import { useSyncMarcas } from "../../hooks/sync-marcas/useSyncMarcas";
import { useSyncServices } from "../../hooks/sync-servicos/useSyncServicos";
import { useSyncClients } from "../../hooks/sync-clientes/useSyncClientes";
import { useSyncVeiculos } from "../../hooks/sync-veiculos/useSyncVeiculos";
import { useSyncTiposDeOs } from "../../hooks/sync-tipos-de-os/useSyncTiposDeOs";
import { useSyncFormasPagamento } from "../../hooks/sync-formas-pagamento/useSyncFormasPagamento";
import { useSyncUsuarios } from "../../hooks/sync-usuarios/useSyncUsuarios";
import { InitialLoadingData } from "../../components/initialloadingData";

type cadEmpre =
  {
    cnpj: string,
    email_empresa: string,
    telefone_empresa: string,
    nome: string,
    codigo: number,
    responsavel: number
  }

export const Home = ({ navigation }: any) => {

  const { setLogado, setUsuario, usuario }: any = useContext(AuthContext);
  const api = useApi();
  const useMoment = configMoment();

   const syncProdutos = useSyncProdutos();
   const syncCategorias = useSyncCategorias();
   const syncFotos = useSyncFotos();
   const syncMarcas = useSyncMarcas();
   const syncServicos = useSyncServices();
   const syncClientes = useSyncClients();
   const syncVeiculos = useSyncVeiculos();
   const syncTipoDeOs = useSyncTiposDeOs();
   const syncFormasPagamento =   useSyncFormasPagamento();
   const syncUsusarios =  useSyncUsuarios();
   
  const useQueryConfigApi = queryConfig_api();

 const [isLoading, setIsLoading] = useState(false);

  const [sair, setSair] = useState<boolean>(false)
  const [cadEmpresa, setCadEmpresa] = useState<cadEmpre>()
  const [loaidngEmpr, setLoadingEmpr] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ item , setItem ] = useState<String>();

  let useQueryEmpresa = queryEmpresas();
  let restartDB = restartDatabaseService();


     const verifyDateSinc = async ()=>{
    let validConfig = await useQueryConfigApi.select(1)
    let dataUltSinc:string;
    let data =
    {
     codigo:1,
     url:'',
     porta:3306,
     token:'',
     data_sinc: useMoment.dataHoraAtual(),
      data_env:'0000-00-00 00:00:00'
   }

      if( validConfig && validConfig?.length > 0   ){
          dataUltSinc = validConfig[0].data_sinc
          console.log("Ultima Sincronizacao : ", validConfig[0].data_sinc )
          useQueryConfigApi.updateByParam(data)
      }else{
       let aux = await useQueryConfigApi.create(data);
       dataUltSinc ='';
       console.log("Executando primeira sincronizacao")
      }
        return dataUltSinc;
  }


  const syncDataProcess = async () => {
    let data =  await verifyDateSinc();
        setIsLoading(true);
        setProgress(0);
        
        try {
             await syncProdutos.syncData( { data , setIsLoading, setProgress, setItem } );
             await syncMarcas.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncCategorias.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncFotos.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncServicos.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncClientes.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncVeiculos.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncTipoDeOs.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncFormasPagamento.syncData( { data, setIsLoading, setProgress, setItem } );
             await syncUsusarios.syncData( { data, setIsLoading, setProgress, setItem } );
         console.log('Fim do processo')
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
          setTimeout(() => setProgress(0), 1000); // Reseta o progresso após 1 segundo

        }
  };



async function buscaEmpresa (){
  setLoadingEmpr(true)
  let validEmpr:any  = await useQueryEmpresa.selectAll();
  if(validEmpr?.length > 0 ){
    setCadEmpresa(validEmpr[0]);
  setLoadingEmpr(false)
  }else{
    try{
      let validEmpresa = await api.post("/empresa/validacao" ,
        { Headers:{
          token: usuario.token
          }
        }  );
  
      if (validEmpresa.data.status.cadastrada) {
        let objEmpr = {
          codigo_empresa: validEmpresa.data.data.codigo,
          nome: validEmpresa.data.data.nome,
          cnpj: validEmpresa.data.data.cnpj,
          email: validEmpresa.data.data.email_empresa,
          responsavel: validEmpresa.data.data.responsavel,
        };
      let aux = await useQueryEmpresa.createByCode(objEmpr);
        setCadEmpresa(validEmpresa.data.data)
      }
    }catch(e:any){
      console.log( 'Ocorreu um erro ao tentar validar a empresa ',  e.response.data.msg )
    } finally{
      setLoadingEmpr(false)
    }
  }

 
}

  useEffect(
    () => {

      buscaEmpresa()
      syncDataProcess()

    }, [usuario.token]
  )


  function alertSair() {
    Alert.alert('Sair', 'Ao sair serão excluidos os dados do aplicativo, será necessario efetuar uma nova sincronização',
      [
        {
          text: 'Cancelar',
          onPress: () => setSair(false),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => setSair(true) }
      ]);

  }

  useEffect(() => {
    async function logout() {
      if (sair === true) {
        setLogado(false)
        setUsuario({})
        await restartDB.restart();
        navigation.navigate('inicio')
      }
    }
    logout()
  }, [sair])



  const data = [
    {
      "nome": "vendas",
      "icon": <MaterialCommunityIcons name="cart-variant" size={30} color={defaultColors.darkBlue} />
    },
    {
      "nome": "OS",
      "icon": <FontAwesome5 name="tools" size={25} color={defaultColors.darkBlue} />
    },
    {
      "nome": "usuarios",
      "icon": <FontAwesome name="users" size={24} color={defaultColors.darkBlue} />
    },
    {
      "nome": "ajustes",
      "icon": <FontAwesome5 name="sync-alt" size={24} color={defaultColors.darkBlue} />
    }

  ];

  const Item = ({ value }: any) => {
    return (
      <TouchableOpacity style={{ margin: 5 }} onPress={() => navigation.navigate(value.nome)}    >
        <View
          style={{ backgroundColor: "#FFF", margin: 10, borderRadius: 100, width: 55, height: 55, alignItems: "center", justifyContent: "center", elevation: 5 }} >
          {value.icon}

        </View>
        <Text style={{ fontSize: 15, fontWeight: "bold", textAlign: "center", maxWidth: 150, color:'#FFF' }}> {value.nome}</Text>


      </TouchableOpacity>

    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EAF4FE" , height:'auto'}}>

   <InitialLoadingData 
       isLoading={isLoading}
       item={item}
       progress={progress}  />

      <View style={{  backgroundColor:  defaultColors.darkBlue , elevation: 7, padding: 5,height:200,borderBottomEndRadius:50, borderStartEndRadius:50}}>
         <View  >
            < View style={{ width:'100%' ,alignItems: "center",    flexDirection: "row", justifyContent:"space-between"}} >
                    <View style={{ backgroundColor: '#FFF', borderRadius: 55, padding: 3, margin: 3 }}>

                    <Image
                      style={{ width: 45, height: 45, resizeMode: 'stretch', }}
                      source={
                        require('../../imgs/intersig120x120.png')
                      }
                    />
                  </View>

                  {
                    loaidngEmpr ? (
                      <ActivityIndicator size={20} color={'#FFF'} />
                    ) : (
                      <Text style={{ fontWeight: "bold", color: '#FFF', margin: 7 }}>
                        {cadEmpresa?.nome}
                      </Text>

                    )
                  }
            </View>

      <View style={{ margin: 10, alignItems: "center"   }}>
          <FlatList
            horizontal={true}
            data={data}
            renderItem={({ item }) => <Item value={item} />}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        </View>

      </View>

      <ScrollView style={{ flex:1}}>
    

        <View style={{ alignItems: "center", width: '100%', marginTop: 15, marginBottom:60 }}>

          <View style={{ flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity style={{ marginTop: 15, margin: 10, backgroundColor: '#FFF', width: '40%', padding: 15, borderRadius: 10, elevation: 2, justifyContent: "space-between", alignItems: "center" }}
              onPress={() => { navigation.navigate('ViewTabProdutos') }} >
              <View style={{ backgroundColor: defaultColors.ligthBlue, flexDirection: "row", height: 50, width: 50, alignItems: "center", justifyContent: "center", borderRadius: 7, elevation: 3 }}>
                <Foundation name="book" size={30} color={defaultColors.darkBlue} />
              </View>
              <Text style={{ fontWeight: "bold", fontSize: 15, color:  defaultColors.gray, width: '80%', textAlign: 'center' }} >Produtos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 15, margin: 10, backgroundColor: '#FFF', width: '40%', padding: 15, borderRadius: 10, elevation: 2, justifyContent: "space-between", alignItems: "center" }}
              onPress={() => { navigation.navigate('serviços') }} >
              <View style={{ backgroundColor: '#EAF4FE', flexDirection: "row", height: 50, width: 50, alignItems: "center", justifyContent: "center", borderRadius: 7, elevation: 3 }}>
                <Feather name="tool" size={30} color={defaultColors.darkBlue} />
              </View>
              <Text style={{ fontWeight: "bold", fontSize: 15, color:  defaultColors.gray, width: '80%', textAlign: 'center' }} >Serviços</Text>
            </TouchableOpacity>
          </View>



          <TouchableOpacity style={{ backgroundColor: '#FFF', marginTop: 15, width: '80%', padding: 15, borderRadius: 10, elevation: 2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
            onPress={() => { navigation.navigate('clientes') }}
          >
            <View style={{ backgroundColor: '#EAF4FE', flexDirection: "row", height: 50, width: 50, alignItems: "center", justifyContent: "center", borderRadius: 7, elevation: 3 }}>
              <Feather name="users" size={30} color={defaultColors.darkBlue} />
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 18, color:   defaultColors.gray, width: '50%', textAlign: 'center' }} >Clientes</Text>
            <AntDesign name="caretdown" size={24} color={defaultColors.darkBlue} />
          </TouchableOpacity>


          <TouchableOpacity style={{ backgroundColor: '#FFF', marginTop: 15, width: '80%', padding: 15, borderRadius: 10, elevation: 2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
            onPress={() => { navigation.navigate('veiculos') }}
          >
            <View style={{ backgroundColor: '#EAF4FE', flexDirection: "row", height: 50, width: 50, alignItems: "center", justifyContent: "center", borderRadius: 7, elevation: 3 }}>
            <FontAwesome5 name="car" size={24} color={defaultColors.darkBlue} />
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: defaultColors.gray, width: '50%', textAlign: 'center' }} >Veículos</Text>
            <AntDesign name="caretdown" size={24} color={defaultColors.darkBlue} />
          </TouchableOpacity>
          


          <TouchableOpacity style={{ backgroundColor: '#FFF', marginTop: 15, width: '80%', padding: 15, borderRadius: 10, elevation: 2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
            onPress={() => { navigation.navigate('formasPagamento') }}
          >
            <View style={{ backgroundColor: '#EAF4FE', flexDirection: "row", height: 50, width: 50, alignItems: "center", justifyContent: "center", borderRadius: 7, elevation: 3 }}>
              <MaterialIcons name="payment" size={30} color={defaultColors.darkBlue} />
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 15, color:  defaultColors.gray, width: '50%', textAlign: 'center' }} >Formas De Pagamento</Text>
            <AntDesign name="caretdown" size={24} color={defaultColors.darkBlue} />
          </TouchableOpacity>

        </View>
     </ScrollView> 

      <View style={{  flexDirection: "row", position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor:  defaultColors.darkBlue , padding: 10, justifyContent: "space-between", }}>
        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: "bold", width: '50%' }}>
          {usuario && usuario.nome}
        </Text>

        <TouchableOpacity onPress={() => alertSair()} style={{ flexDirection: "row" }}>
          <Text style={{ color: '#FFF', fontWeight: "bold" }} >Sair</Text>
          <MaterialCommunityIcons name="logout" size={24} color="white" />
        </TouchableOpacity>
 
      </View>

    </View>
  );
};
