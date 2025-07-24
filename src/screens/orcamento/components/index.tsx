import React, { useContext, useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View, ScrollView, Alert,  ActivityIndicator,  StyleSheet, } from "react-native";
import { ListaProdutos } from "./produtos";
import { ListaClientes } from "./clientes";
import { Parcelas } from "./parcelas";
import { OrcamentoContext, OrcamentoModel,} from "../../../contexts/orcamentoContext";
import { ConnectedContext } from "../../../contexts/conectedContext";
import { usePedidos } from "../../../database/queryPedido/queryPedido";
import { Detalhes } from "./detalhes";
import { AuthContext } from "../../../contexts/auth";
import { Servico } from "./servico";
import { configMoment } from "../../../services/moment";
import { generatorId } from "../../../utils/id-generator";


export const Orcamento = ({ orcamentoEditavel,  navigation, tipo,  codigo_orcamento, }: any) => {

  const [totalGeral, setTotalGeral] = useState<number | undefined>();
  const [descontosGeral, setDescontosGeral] = useState<number>(0);
  const [totalProdutos, setTotalProdutos] = useState<number>();
  const [observacoes, setObservacoes] = useState<string>("");
  const [formaPagamento, setFormaPagamento] = useState<number | undefined>();
  const [status, setStatus] = useState<number>(0);
  const [response, setResponse] = useState<string>("");
  const [editavel, setEditavel] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataAtual, setDataAtual] = useState<any>();
  const [dataHora, setDataHora] = useState<any>();
  const [codigoOrcamento, setCodigoOrcamento] = useState<number>();
  /////
  ////
  const { usuario }: any = useContext(AuthContext);

  const { orcamento, setOrcamento } = useContext(OrcamentoContext);
  const { connected } = useContext(ConnectedContext);

  const useQuerypedidos = usePedidos();
 
  const useMoment = configMoment();

  const gerarCodigo = () => {
    let data = useMoment.generatorDate();
    let secret = data + usuario.codigo;
    console.log(secret);
    const codigo = parseInt(secret);
    return codigo;
  };
  

  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    let atualDate = useMoment.dataHoraAtual();

    let data = useMoment.dataAtual();
    setDataAtual(data);
    setDataHora(atualDate);
    async function init() {
      if (!codigo_orcamento || codigo_orcamento === null) {
        setOrcamento((prevOrcamento:OrcamentoModel) =>  ({
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
 //   console.log('iniciando compoenente useEffect ****')
  }, []);
  ////////////////////////////////////////////////////////////////////////////
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

      Alert.alert('',response);
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

  }, [status, response, navigation, setOrcamento]);
  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    let novoTotalGeralProdutos = 0;
    let totaDescontosProdutos = 0;
    let totalValorProdutos = 0;

    let novoTotalGeralServicos = 0;
    let totaDescontosServicos = 0;
    let totalValorServicos = 0;
    let totalGeralOrcamento = 0;
    ////**** total de descontos esta considerando somente os
    ////**** descontos dos produtos

    if (orcamento.produtos.length > 0) {
      orcamento.produtos.forEach((i: any) => {
        novoTotalGeralProdutos += i.total;
        totaDescontosProdutos += i.desconto;
        totalValorProdutos += i.preco * i.quantidade;
      });
      setTotalProdutos(totalValorProdutos);
      setDescontosGeral(totaDescontosProdutos);
    }

    if (   orcamento.servicos.length > 0) {
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

  }, [ orcamento.produtos, orcamento.parcelas, orcamento.descontos, orcamento.servicos, ]);
  ////////////////////////////////////////////////////////////////////////////
  
 
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
          if( arrlasId && arrlasId[0].id  ){
            lastId  =  arrlasId[0].id   
          }else{
            lastId = `0000000000-${usuario.codigo}`
          }
          
          let codigoGerado = gerarCodigo( );
      let id = generatorId(  lastId , usuario.codigo );

      try {
          setLoading(false);
          let response = await useQuerypedidos.createOrder(
            orcamento,
            codigoGerado,
            id, 
            0
          );

          if (response > 0) {
            console.log("");
            console.log("codigo orcamento resgistrado : ", response);
            console.log("");
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

  return (
    <View style={{ flex: 1, backgroundColor: "#EAF4FE" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/** *** separador ***/}

        {  editavel === true && orcamentoEditavel && orcamentoEditavel.id  ? (
          <Text style={{ marginLeft:10, fontWeight:"bold",fontSize:17,  color:'#6C757D' }}>Pedido Id: { orcamentoEditavel.id }</Text>
        ) : null}

        <View style={{ flexDirection: "row" }}>
          <ListaClientes codigo_orcamento={codigo_orcamento} />
        </View>

        {/*//////////////// components serviços  ////////////////////////*/}
        {tipo && tipo === 3 && (
          <View>
        <View style={{ borderWidth: 0.4, margin: 10 }}></View>
            <Servico codigo_orcamento={codigo_orcamento} />
        <View style={{ borderWidth: 0.4, margin: 10 }}></View>
          
          </View>
          
        )}
        {/*//////////////// components produtos  ////////////////////////*/}
        <View style={{ flexDirection: "row", margin: 5 }}>
          <ListaProdutos codigo_orcamento={codigoOrcamento} />
        </View>

        {/*/////////////////////////// parcelas /////////////////////////////////////*/}
        <View style={{ borderWidth: 0.4, margin: 10 }}></View>
        <View style={{ margin: 5 }}>
          <Parcelas
            orcamentoEditavel={orcamentoEditavel}
            codigo_orcamento={codigo_orcamento}
          />
        </View>

        {/*/////////////////////////// detalhes /////////////////////////////////////*/}
            <View style={{ borderWidth: 0.4, margin: 10 }}></View>
            <Detalhes orcamentoEditavel={orcamentoEditavel} />
      </ScrollView>
      <View
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,  backgroundColor: "#FFF",  borderColor: "#ccc",  borderWidth: 1,  borderRadius: 5, elevation: 5,  padding: 10,   flexDirection: "row",  alignItems: "center",  justifyContent: "space-between",  }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 12 }}>
          Total: R$ {orcamento.total_geral?.toFixed(2)}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 12 }}>
          Descontos: R$ {orcamento.descontos ? descontosGeral.toFixed(2) : 0}
        </Text>

        <TouchableOpacity
          style={{
            padding: 7,
            backgroundColor: "#185FED",
            elevation: 5,
            margin: 3,
            borderRadius: 5,
          }}
          onPress={() => gravar()}
        >
          <Text style={{ fontWeight: "bold", fontSize: 12, color: "white" }}>
            Salvar
          </Text>
        </TouchableOpacity>

        {/*** <TouchableOpacity
                         style={{ padding: 7, backgroundColor: 'green', elevation: 5, margin: 3, borderRadius: 5 }}
                         onPress={() => console.log(orcamento)}
                            >
                         <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>Mostrar</Text>
                    </TouchableOpacity>
                  */}
      </View>

      {loading && (
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba( 50,50,50, 0.5 )",
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            height: "100%", // ,top: '50%', left: '60%', transform: [{ translateX: -50 }, { translateY: -50 }]
          }}
        >
          <ActivityIndicator size={55} color="#185FED" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 3,
    backgroundColor: "#FFF",
    elevation: 4,
    width: 60,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
});
