import { addDays, format } from "date-fns";
import { actionOrderReducer, objOrderReducer, orderItem, parcela, serviceItem } from "../types/order";

function calculateTotals(
  produtos: orderItem[],
  servicos: serviceItem[],
  frete: number
) {
  let totalGeral = 0;
  let totalProdutos = 0;
  let totalServicos = 0;
  let descontosProdutos = 0;
  let descontosServicos = 0;
  let descontos = 0;

  for (const item of produtos) {
    totalProdutos += item.quantidade * item.preco;
    descontosProdutos += item.descontos || 0;
    descontos += item.descontos || 0;
    totalGeral += item.total;
  }

  for (const item of servicos) {
    totalServicos += item.quantidade * item.valor;
    descontosServicos += item.descontos || 0;
    descontos += item.descontos || 0;
    totalGeral += item.total;
  }

  totalGeral += frete;

  return {
    total_geral: totalGeral,
    total_produtos: totalProdutos,
    total_servicos: totalServicos,
    descontos_produtos: descontosProdutos,
    descontos_servicos: descontosServicos,
    descontos,
  };
}

export function orderReducer(state: objOrderReducer, action: actionOrderReducer) {
  switch (action.type) {
    case 'ADD_SERVICE': {
      const serviceToadd = action.payload
      const { quantity } = action;
      const serviceExists = state.servicos.find(service => service.codigo === serviceToadd.codigo)
      let newServices: serviceItem[];
      if (serviceExists) {
        newServices = state.servicos.map((item) => {
          if (item.codigo === serviceToadd.codigo) {
            const newDesconto = quantity * item.desconto;
            const newTotal = (quantity * item.valor) - newDesconto;
            return { ...item, quantidade: quantity, descontos: newDesconto, total: newTotal }
          }
          return item;
        })
      } else {
        newServices = [...state.servicos, { ...serviceToadd, quantidade: quantity }];
      }
      const totals = calculateTotals(state.produtos, newServices, state.frete);
      return { ...state, ...totals, servicos: newServices };
    }

    case 'RM_SERVICE': {
      const { quantity } = action;
      const newServices = state.servicos
        .map((item) => {
          if (item.codigo === action.payload && item.quantidade >= quantity) {
            const newQuantity = item.quantidade - quantity;
            const discountTotal = item.desconto / item.quantidade * newQuantity || 0;
            return {
              ...item,
              quantidade: newQuantity,
              descontos: discountTotal,
              total: (newQuantity * item.valor) - discountTotal
            }
          }
          return item
        })
        .filter((item) => item.quantidade > 0)
      const totals = calculateTotals(state.produtos, newServices, state.frete);
      return { ...state, ...totals, servicos: newServices };
    }

    case 'ADD_PRODUCT': {
      const productToadd = action.payload
      const { quantity } = action;
      const productExists = state.produtos.find(product => product.codigo === productToadd.codigo)
      let newProducts: orderItem[];
      if (productExists) {
        newProducts = state.produtos.map((item) => {
          if (item.codigo === productToadd.codigo) {
            const newDesconto = quantity * productToadd.desconto;
            const newTotal = (quantity * item.preco) - newDesconto;
            return { ...item, quantidade: quantity, descontos: newDesconto, desconto: productToadd.desconto, total: newTotal }
          }
          return item;
        })
      } else {
        newProducts = [...state.produtos, { ...productToadd, quantidade: quantity }];
      }
      const totals = calculateTotals(newProducts, state.servicos, state.frete);
      return { ...state, ...totals, produtos: newProducts };
    }

    case 'ADD_DISCOUNT_PRODUCT': {
      const { codeProduct, discount } = action
      const newProducts = state.produtos.map((item) => {
        if (item.codigo === codeProduct) {
          const newDiscounts = item.quantidade * discount;
          let newTotal = (item.quantidade * item.preco) - newDiscounts;
          if (newTotal < 0) { newTotal = 0 }
          return { ...item, descontos: newDiscounts, desconto: discount, total: newTotal }
        }
        return item;
      })
      const totals = calculateTotals(newProducts, state.servicos, state.frete);
      return { ...state, ...totals, produtos: newProducts };
    }

    case 'RM_PRODUCT': {
      const { quantity } = action;
      const newProducts = state.produtos
        .map((item) => {
          if (item.codigo === action.payload && item.quantidade >= quantity) {
            const newQuantity = item.quantidade - quantity;
            const discountTotal = item.desconto / item.quantidade * newQuantity || 0;
            return {
              ...item,
              quantidade: newQuantity,
              descontos: discountTotal,
              total: (newQuantity * item.preco) - discountTotal
            }
          }
          return item
        })
        .filter((item) => item.quantidade > 0)
      const totals = calculateTotals(newProducts, state.servicos, state.frete);
      return { ...state, ...totals, produtos: newProducts };
    }

    case 'FREIGHT': {
      const newTotals = calculateTotals(state.produtos, state.servicos, action.payload);
      return { ...state, frete: action.payload, ...newTotals };
    }

    case 'ADD_DISCOUNT_SERVICE': {
      const { codeService, discount } = action
      const newServices = state.servicos.map((item) => {
        if (item.codigo === codeService) {
          const newDiscounts = item.quantidade * discount;
          let newTotal = (item.quantidade * item.valor) - newDiscounts;
          if (newTotal < 0) { newTotal = 0 }
          return { ...item, descontos: newDiscounts, desconto: discount, total: newTotal }
        }
        return item;
      })
      const totals = calculateTotals(state.produtos, newServices, state.frete);
      return { ...state, ...totals, servicos: newServices };
    }

    case 'ADD_CUSTOMER': {
      const { payload } = action;
      const { cep, cnpj, codigo, endereco, numero, nome } = payload;
      return { ...state, cliente: { cep, cnpj, codigo, endereco, numero, nome } }
    }

    case 'CALCULATE_INSTALLMENTS': {
      const { payload } = action;
      const { intervalo_parcelas, quantidade_parcelas, total_geral } = payload;
      let novas_parcelas: parcela[] = [];
      let valorParcelas = total_geral / quantidade_parcelas;
      for (let i = 1; i <= quantidade_parcelas; i++) {
        const vencimento = addDays(new Date(), intervalo_parcelas * i);
        novas_parcelas.push({ parcela: i, valor: valorParcelas, vencimento: format(vencimento, 'yyyy-MM-dd') });
      }
      return { ...state, parcelas: novas_parcelas }
    }

    case 'ADD_PAYMENT_METHOD': {
      const { payload } = action;
      const { codigo } = payload
      return { ...state, forma_pagamento: codigo }
    }

    case 'EDIT_DUE_INSTALLMENTS': {
      const { payload } = action
      const { parcela, vencimento } = payload
      const newInstallments = state.parcelas.map((i) => {
        if (i.parcela === parcela) { i.vencimento = vencimento }
        return i
      })
      return { ...state, parcelas: newInstallments }
    }

    case 'EDIT_OBSERVATIONS': {
      return { ...state, observacoes: action.payload }
    }

    case 'EDIT_SITUATION': {
      return { ...state, situacao: action.payload }
    }

    case 'EDIT_CONTACT': {
      return { ...state, contato: action.payload }
    }

    case 'LOAD_ORDER': {
      return { ...action.payload }
    }
  }
}
