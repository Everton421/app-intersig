import { cliente, objOrderReducer, orderItem, orderService, parcela } from "../types/order"
import { configMoment } from "../../../services/moment"
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth";

const moment = configMoment()

const initialCustomer: cliente = {
  cep: '',
  cnpj: '',
  codigo: 0,
  endereco: '',
  numero: 0,
  nome: ''
}

const defaultInstallment: parcela = {
  parcela: 0,
  valor: 0,
  vencimento: moment.dataAtual()
}

export const initialOrderState: objOrderReducer = {
  codigo: '1',
  contato: '',
  forma_pagamento: 0,
  observacoes: '',
  situacao: 'EA',
  cliente: initialCustomer,
  total_geral: 0,
  total_produtos: 0,
  total_servicos: 0,
  descontos: 0,
  frete: 0,
  descontos_produtos: 0,
  descontos_servicos: 0,
  servicos: [],
  produtos: [],
  parcelas: [defaultInstallment],
  data_cadastro: moment.dataAtual(),
  data_recadastro:moment.dataHoraAtual(),
  enviado:'N',
  id_externo:'',
  quantidade_parcelas: 1,
  tipo_os:0,
  veiculo:0,
  vendedor: 1,
  tipo:1

}

export function createInitialState(overrides?: Partial<objOrderReducer>): objOrderReducer {
  return {
    ...initialOrderState,
    ...overrides,
  }
}
