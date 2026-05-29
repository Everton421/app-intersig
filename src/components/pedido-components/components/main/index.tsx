import { useContext, useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View, ScrollView, Alert, ActivityIndicator } from "react-native";
import { ListaProdutos } from "../produtos";
import { ListaClientes } from "../clientes";
import { Parcelas } from "../parcelas";
import { OrcamentoContext, OrcamentoModel } from "../../../../contexts/orcamentoContext";
import { ConnectedContext } from "../../../../contexts/conectedContext";
import { usePedidos } from "../../../../database/queryPedido/queryPedido";
import { Detalhes } from "../detalhes";
import { AuthContext } from "../../../../contexts/auth";
import { Servico } from "../servico";
import { configMoment } from "../../../../services/moment";
import { generatorId } from "../../../../utils/id-generator";
import { CustomHeader } from "../../../custom-header";

const styles = {
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 12,
    marginVertical: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    color: '#185FED',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  bottomBar: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: '#185FED',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#185FED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
};

export const Pedido_Component = ({ orcamentoEditavel, navigation, tipo, codigo_orcamento }: any) => {

  const [totalGeral, setTotalGeral] = useState<number | undefined>();
  const [descontosGeral, setDescontosGeral] = useState<number>(0);
  const [totalProdutos, setTotalProdutos] = useState<number>();
  const [observacoes, setObservacoes] = useState<string>("");
  const [status, setStatus] = useState<number>(0);
  const [response, setResponse] = useState<string>("");
  const [editavel, setEditavel] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataAtual, setDataAtual] = useState<any>();
  const [dataHora, setDataHora] = useState<any>();
  const [codigoOrcamento, setCodigoOrcamento] = useState<number>();
  const { usuario }: any = useContext(AuthContext);

  const { orcamento, setOrcamento } = useContext(OrcamentoContext);
  const { connected } = useContext(ConnectedContext);

  const useQuerypedidos = usePedidos();
  const useMoment = configMoment();

  const gerarCodigo = () => {
    let data = useMoment.generatorDate();
    let secret = data + usuario.codigo;
    const codigo = parseInt(secret);
    return codigo;
  };

  useEffect(() => {
    let atualDate = useMoment.dataHoraAtual();
    let data = useMoment.dataAtual();
    setDataAtual(data);
    setDataHora(atualDate);
    async function init() {
      if (!codigo_orcamento || codigo_orcamento === null) {
        setOrcamento((prevOrcamento: OrcamentoModel) => ({
          ...prevOrcamento,
          vendedor: usuario.codigo,
          total_produtos: 0,
          total_geral: 0,
          descontos: 0,
          contato: `react-native `,
          observacoes: observacoes || "",
          quantidade_parcelas: 0,
          enviado: "N",
          cliente: {},
          situacao: "EA",
          parcelas: [],
          produtos: [],
          servicos: [],
          data_cadastro: data,
          veiculo: 0,
          tipo_os: 0,
          tipo: tipo,
        }));
      } else {
        setEditavel(true);
        setCodigoOrcamento(codigo_orcamento);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (status === 200 && response) {
      setOrcamento((prevOrcamento: OrcamentoModel) => ({
        ...prevOrcamento,
        cliente: null,
        produtos: [],
        parcelas: [],
        vendedor: 0,
        situacao: "EA",
        tipo: tipo,
      }));
      setTotalGeral(0);
      setDescontosGeral(0);
      Alert.alert('', response);
      navigation.goBack();
    }

    if (status === 500) {
      setOrcamento((prevOrcamento: OrcamentoModel) => ({
        ...prevOrcamento,
        cliente: null,
        produtos: [],
        parcelas: [],
        situacao: "EA",
        vendedor: 0,
        tipo: tipo,
      }));
      setTotalGeral(0);
      setDescontosGeral(0);
      Alert.alert(response);
      navigation.goBack();
    }
  }, [ ]);
  //}, [status, response, navigation, setOrcamento]);

  useEffect(() => {
    let novoTotalGeralProdutos = 0;
    let totaDescontosProdutos = 0;
    let totalValorProdutos = 0;
    let novoTotalGeralServicos = 0;
    let totaDescontosServicos = 0;
    let totalValorServicos = 0;
    let totalGeralOrcamento = 0;

    if (orcamento.produtos.length > 0) {
      orcamento.produtos.forEach((i: any) => {
        novoTotalGeralProdutos += i.total;
        totaDescontosProdutos += i.desconto;
        totalValorProdutos += i.preco * i.quantidade;
      });
      setTotalProdutos(totalValorProdutos);
      setDescontosGeral(totaDescontosProdutos);
    }

    if (orcamento.servicos.length > 0) {
      orcamento.servicos.forEach((i: any) => {
        novoTotalGeralServicos += i.total;
        totaDescontosServicos += i.desconto;
        totalValorServicos += i.valor * i.quantidade;
      });
    }
    totalGeralOrcamento = novoTotalGeralServicos + novoTotalGeralProdutos;
    setTotalGeral(totalGeralOrcamento);

    setOrcamento((prevOrcamento: OrcamentoModel) => ({
      ...prevOrcamento,
      total_produtos: totalValorProdutos,
      total_servicos: totalValorServicos,
      contato: `react-native `,
      total_geral: totalGeralOrcamento,
      descontos: totaDescontosProdutos,
      data_recadastro: dataHora,
    }));
  }, [ ]);

  //}, [orcamento.produtos, orcamento.parcelas, orcamento.descontos, orcamento.servicos]);

  const gravar = async () => {
    setLoading(true);

    setOrcamento((prevOrcamento: OrcamentoModel) => ({
      ...prevOrcamento,
      data_recadastro: dataHora,
    }));

    if (editavel) {
      try {
        await useQuerypedidos.updateOrder(orcamento, codigoOrcamento);
        setStatus(200);
        setResponse("Orçamento atualizado com sucesso!");
      } catch (e) {
        console.log("erro ao atualizar o orcamento no SQLITE", e);
      } finally {
        setLoading(false);
      }
    } else {
      let cliente, produtos, parcelas;
      if (!orcamento.cliente.codigo) {
        Alert.alert("É necessário informar o cliente!");
        setLoading(false);
        return;
      } else {
        cliente = orcamento.cliente;
      }
      if (orcamento.parcelas.length === 0) {
        Alert.alert("É necessário informar as parcelas!");
        setLoading(false);
        return;
      } else {
        parcelas = orcamento.parcelas;
      }

      let arrlasId = await useQuerypedidos.selectLastId();
      let lastId
      if (arrlasId && arrlasId[0]?.id) {
        lastId = arrlasId[0].id
      } else {
        lastId = `0000000000-${usuario.codigo}`
      }

      let codigoGerado = gerarCodigo();
      let id = generatorId(lastId, usuario.codigo);

      try {
        setLoading(false);
        let response = await useQuerypedidos.createOrder(orcamento, codigoGerado, id, 0);

        if (response > 0) {
          setStatus(200);
          setResponse("Orçamento registrado com sucesso!");
        } else {
          setStatus(500);
          setResponse(" falha ao registrar orcamento! ");
        }
      } catch (e) {
        console.log("erro ao gravar o orcamento no SQLITE", e);
      } finally {
        setLoading(false);
      }
    }
  };

  const SectionCard = ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <View style={styles.sectionCard}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#EAF4FE" }}>
      <CustomHeader
        title={editavel ? "Editar Pedido" : "Novo Pedido"}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {editavel === true && orcamentoEditavel?.id ? (
          <View style={[styles.sectionCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>
              Pedido #{orcamentoEditavel.id}
            </Text>
            <View style={{ backgroundColor: '#EAF4FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ color: '#185FED', fontWeight: '600', fontSize: 12 }}>
                {orcamentoEditavel.situacao}
              </Text>
            </View>
          </View>
        ) : null}

        <SectionCard title="Cliente">
          <ListaClientes codigo_orcamento={codigo_orcamento} />
        </SectionCard>

        {tipo && tipo === 3 && (
          <SectionCard title="Serviços">
            <Servico codigo_orcamento={codigo_orcamento} />
          </SectionCard>
        )}

        <SectionCard title="Produtos">
          <ListaProdutos codigo_orcamento={codigoOrcamento} />
        </SectionCard>

        <SectionCard title="Parcelas">
          <Parcelas
            orcamentoEditavel={orcamentoEditavel}
            codigo_orcamento={codigo_orcamento}
          />
        </SectionCard>

        <SectionCard title="Detalhes">
          <Detalhes orcamentoEditavel={orcamentoEditavel} />
        </SectionCard>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#333' }}>
            Total: <Text style={{ color: '#185FED', fontSize: 16 }}>R$ {orcamento.total_geral?.toFixed(2)}</Text>
          </Text>
          <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
            Descontos: R$ {descontosGeral.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => gravar()}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#FFF' }}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0.5)',
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
          <View style={{
            backgroundColor: '#FFF',
            borderRadius: 16,
            padding: 30,
            alignItems: 'center',
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
          }}>
            <ActivityIndicator size={50} color="#185FED" />
            <Text style={{ marginTop: 15, color: '#333', fontWeight: '600' }}>Salvando...</Text>
          </View>
        </View>
      )}
    </View>
  );
};