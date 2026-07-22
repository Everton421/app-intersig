import { View, Text, Alert, Modal, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native"
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons"
import useApi from "../../services/api"
import { useContext, useEffect, useState } from "react"
import { ConnectedContext } from "../../contexts/conectedContext"
import { AuthContext } from "../../contexts/auth"
import { restartDatabaseService } from "../../database/restart-database" 
import { configMoment } from "../../services/moment"
import { enviaPedidos } from "../../services/sendOrders"  
import { receberPedidos } from "../../services/getOrders"
import DateTimePicker from '@react-native-community/datetimepicker';
import { queryConfig_api } from "../../database/queryConfig_Api/queryConfig_api"
import { useSyncProdutos } from "../../hooks/sync-produtos/useSyncProdutos"
import { useSyncCategorias } from "../../hooks/sync-categorias/useSyncCategorias"
import { useSyncFotos } from "../../hooks/sync-fotos/useSyncFotos"
import { useSyncMarcas } from "../../hooks/sync-marcas/useSyncMarcas"
import { useSyncServices } from "../../hooks/sync-servicos/useSyncServicos"
import { useSyncClients } from "../../hooks/sync-clientes/useSyncClientes"
import { useSyncVeiculos } from "../../hooks/sync-veiculos/useSyncVeiculos"
import { useSyncTiposDeOs } from "../../hooks/sync-tipos-de-os/useSyncTiposDeOs"
import { useSyncFormasPagamento } from "../../hooks/sync-formas-pagamento/useSyncFormasPagamento"
import { useSyncUsuarios } from "../../hooks/sync-usuarios/useSyncUsuarios"
import { DotIndicatorLoadingData } from "../../components/dotIndicator"
import { CustomHeader } from "../../components/custom-header"
import { CustomAlert } from "../../components/custom-alert"

const LoadingOrders = ({ isLoadingOrder }: any) => (
  <Modal animationType='slide' transparent={true} visible={isLoadingOrder}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFF" />
      <Text style={styles.loadingText}>Carregando pedidos...</Text>
    </View>
  </Modal>
);

export const Configurações = ({ navigation }: any) => {

  const api = useApi();

  const { usuario }: any = useContext(AuthContext);
  const { connected, setConnected, internetConnected }: any = useContext(ConnectedContext);

  const useRestartService = restartDatabaseService();
  const useMoment = configMoment();
<View></View>
  const syncProdutos = useSyncProdutos();
  const syncCategorias = useSyncCategorias();
  const syncFotos = useSyncFotos();
  const syncMarcas = useSyncMarcas();
  const syncServicos = useSyncServices();
  const syncClientes = useSyncClients();
  const syncVeiculos = useSyncVeiculos();
  const syncTipoDeOs = useSyncTiposDeOs();
  const syncFormasPagamento = useSyncFormasPagamento();
  const syncUsusarios = useSyncUsuarios();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [progress, setProgress] = useState(0);
  const [item, setItem] = useState<String>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [conectado, setConectado] = useState<boolean>();
  const [dataSelecionada, setDataSelecionada] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [msgApi, setMsgApi] = useState('');

  const [visibleAlert, setVisibleAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState<string>('');
  const [typeAlert, setTypeAlert] = useState<'success' | 'error' | 'warning' | 'info'>('warning');
  const [titleAlert, setTitleAlert] = useState<string>('');
  const [cancelText, setCancelText] = useState<string | undefined>();
  const [confirmText, setConfirmText] = useState<string | undefined>();
  const [confirmAlertFunction, setConfirmAlertFunction] = useState<() => void>(() => {});
  const [cancelAlertFunction, setAlertCancelFunction] = useState<() => void>(() => {});

  const useGetOrders = receberPedidos();
  const useSendOrders = enviaPedidos();

  const useQueryConfigApi = queryConfig_api();

  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateToFormat: any) => {
    const day = String(dateToFormat.getDate()).padStart(2, '0');
    const month = String(dateToFormat.getMonth() + 1).padStart(2, '0');
    const year = dateToFormat.getFullYear();
    return `${day}/${month}/${year}`;
  };

  async function connect() {
    try {
      setLoading(true);
      const response = await api.get('/health', {});
      if (response.status === 200 && response.data.ok) {
        setConectado(true);
        setConnected(true);
        setMsgApi('');
      } else {
        setConectado(false);
        setConnected(false);
      }
      setError(undefined);
    } catch (err: any) {
      setConectado(false);
      setMsgApi(err.response?.data?.msg || "Erro");
      setError(err.response?.data?.msg || "Erro desconhecido");
      if (err.status === 400) {
        setVisibleAlert(true);
        setMessageAlert(err.response.data.msg);
        setTypeAlert('error');
        setTitleAlert("Erro");
        return;
      }
      if (err.status !== 400) {
        setVisibleAlert(true);
        setMessageAlert("Erro desconhecido!");
        setTypeAlert('error');
        setTitleAlert("Erro");
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  const handleEvent = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
    const dataaux: any = formatDate(currentDate);
    setDataSelecionada(dataaux);
  };

  const verifyDateSinc = async () => {
    let validConfig = await useQueryConfigApi.select(1)
    let dataUltSinc: string;
    let data = {
      codigo: 1,
      url: '',
      porta: 3306,
      token: '',
      data_sinc: useMoment.dataHoraAtual(),
      data_env: '0000-00-00 00:00:00'
    }

    if (validConfig && validConfig?.length > 0) {
      dataUltSinc = validConfig[0].data_sinc
      useQueryConfigApi.update(data)
    } else {
      let aux = await useQueryConfigApi.create(data);
      dataUltSinc = '';
    }
    return dataUltSinc;
  }

  const syncData = async () => {
    let data = await verifyDateSinc();
    setIsLoading(true);
    try {
     // await syncProdutos.syncData({ data, setIsLoading, setProgress, setItem });
      await syncMarcas.syncData({ data, setIsLoading, setProgress, setItem });
      await syncCategorias.syncData({ data, setIsLoading, setProgress, setItem });
     // await syncFotos.syncData({ data, setIsLoading, setProgress, setItem });
     // await syncServicos.syncData({ data, setIsLoading, setProgress, setItem });
     // await syncClientes.syncData({ data, setIsLoading, setProgress, setItem });
     // await syncVeiculos.syncData({ data, setIsLoading, setProgress, setItem });
     // await syncTipoDeOs.syncData({ data, setIsLoading, setProgress, setItem });
     // await syncFormasPagamento.syncData({ data, setIsLoading, setProgress, setItem });
     // await syncUsusarios.syncData({ data, setIsLoading, setProgress, setItem });
      setDataSelecionada(undefined);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleSync = () => {
    if (loading) {
      setVisibleAlert(true);
      setMessageAlert("Estabelecendo conexão...");
      setTypeAlert('info');
      setTitleAlert("Aguarde!");
      return;
    }

    if (!internetConnected) {
      setVisibleAlert(true);
      setMessageAlert("Sem conexão com a internet!");
      setTypeAlert('error');
      setTitleAlert("Erro");
      return;
    }

    if (!connected) {
      setVisibleAlert(true);
      setMessageAlert("Falha ao se conectar com o servidor!");
      setTypeAlert('error');
      setTitleAlert("Erro");
      return;
    }

    if (!conectado) {
      setVisibleAlert(true);
      setMessageAlert(msgApi);
      setTypeAlert('error');
      setTitleAlert("Erro");
      return;
    }
    syncData();
  };

  async function syncOrders() {
    try {
      setIsLoadingOrder(true)
      let dataPedidos: any = formatDate(date)

      await useGetOrders.getPedidos(dataPedidos);
      let responseSystem = await useSendOrders.postPedidos();
      console.log(responseSystem);

      setVisibleAlert(true);
      setMessageAlert("Pedidos sincronizados com sucesso!");
      setTypeAlert('success');
      setTitleAlert("Sucesso");

    } catch (e) {
      console.log(e);
      Alert.alert('Erro', 'Falha ao sincronizar pedidos.');
    } finally {
      setIsLoadingOrder(false)
    }
  }

  useEffect(() => {
    connect();
  }, []);

  function restart() {
    setVisibleAlert(true);
    setTitleAlert('Atenção');
    setTypeAlert('warning');
    setCancelText('cancel');
    setConfirmText('Sim');
    setMessageAlert(`Será necessario uma nova sincronização, deseja concluir esta operação ?`);
  }

  const openUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Não foi possível abrir esta URL: ${url}`);
    }
  };

  const MenuCard = ({ icon, title, subtitle, onPress, danger = false }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: danger ? 4 : 0,
        borderLeftColor: danger ? 'red' : 'transparent'
      }}
    >
      <View style={{
        width: 45, height: 45, borderRadius: 25,
        backgroundColor: danger ? '#FFEBEE' : '#E3F2FD',
        justifyContent: 'center', alignItems: 'center', marginRight: 15
      }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: danger ? '#D32F2F' : '#333' }}>{title}</Text>
        {subtitle && <Text style={{ fontSize: 12, color: '#666' }}>{subtitle}</Text>}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#EAF4FE' }}>
      {item && <DotIndicatorLoadingData isLoading={isLoading} item={item as string} progress={progress} />}

      <LoadingOrders isLoadingOrder={isLoadingOrder} />

      <CustomAlert
        visible={visibleAlert}
        message={messageAlert}
        onConfirm={() => setVisibleAlert(false)}
        onCancel={() => setVisibleAlert(false)}
        title={titleAlert}
        type={typeAlert}
        cancelText={cancelText}
        confirmText={confirmText}
      />

      <CustomHeader
        title="Configurações"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

        {/* Status Card */}
        <View style={{
          backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 20, elevation: 2,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <View>
            <Text style={{ fontSize: 14, color: '#777', marginBottom: 4 }}>Status da API</Text>
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <ActivityIndicator size="small" color="#185FED" />
                <Text style={{ fontWeight: 'bold', color: '#185FED' }}>Verificando...</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: connected ? '#4CAF50' : '#F44336' }} />
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: connected ? '#4CAF50' : '#F44336' }}>
                  {connected ? "Conectado" : "Desconectado"}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => connect()}
            style={{ padding: 8, backgroundColor: '#E3F2FD', borderRadius: 8 }}
          >
            <MaterialCommunityIcons name="refresh" size={24} color="#185FED" />
          </TouchableOpacity>
        </View>

        {/* Sincronização Section */}
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 10, marginLeft: 5 }}>Sincronização</Text>

        <MenuCard
          icon={<MaterialCommunityIcons name="database-sync" size={24} color="#185FED" />}
          title="Sincronizar Cadastros"
          subtitle="Atualizar produtos, marcas e categorias"
          onPress={handleSync}
        />

        {/* Pedidos Card */}
        <View style={{
          backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 10, elevation: 2,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
              <MaterialCommunityIcons name="clipboard-text-play" size={24} color="#185FED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Pedidos</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>Enviar e receber pendências</Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, color: '#555', marginBottom: 5, fontWeight: '600' }}>A partir da data:</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA',
              borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8,
              paddingHorizontal: 12, height: 45, marginBottom: 15
            }}
          >
            <Fontisto name="date" size={20} color="#185FED" style={{ marginRight: 10 }} />
            <Text style={{ flex: 1, fontSize: 16, color: '#333', fontWeight: '500' }}>
              {formatDisplayDate(date)}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#BDBDBD" />
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              display="calendar"
              mode="date"
              onChange={handleEvent}
            />
          )}

          <TouchableOpacity
            style={{
              backgroundColor: isLoadingOrder ? '#B0C4DE' : '#185FED',
              borderRadius: 10, paddingVertical: 12, flexDirection: "row",
              alignItems: 'center', justifyContent: 'center', gap: 8
            }}
            onPress={syncOrders}
            disabled={isLoadingOrder}
          >
            {isLoadingOrder ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <MaterialCommunityIcons name="folder-sync" size={22} color='#FFF' />
            )}
            <Text style={{ color: '#FFF', fontWeight: "bold", fontSize: 16 }}>
              {isLoadingOrder ? 'Sincronizando...' : 'Sincronizar Pedidos'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manutenção Section */}
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 10, marginTop: 10, marginLeft: 5 }}>Manutenção</Text>

        <MenuCard
          icon={<MaterialCommunityIcons name="database-remove" size={24} color="#D32F2F" />}
          title="Limpar Base de Dados"
          subtitle="Apaga todos os dados locais"
          danger={true}
          onPress={restart}
        />

        {/* Footer Links */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 30, opacity: 0.7 }}>
          <TouchableOpacity onPress={() => openUrl("https://www.intersig.com.br/termos-de-uso-app/")}>
            <Text style={{ color: '#185FED', textDecorationLine: 'underline' }}>Termos de uso</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openUrl("https://intersig.com.br/politicas-privacidade-app/")}>
            <Text style={{ color: '#185FED', textDecorationLine: 'underline' }}>Políticas de Privacidade</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FFF',
    width: '100%',
    textAlign: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
