// seu arquivo de teste
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Cart } from '../src/screens/orcamento/components/Cart';
import { Cadastro_FormaPagamento } from '../src/screens/cadastro-FormaPagamento';
 

test(' teste fpgt   orcamento', () => {
  render(<Cadastro_FormaPagamento />);
});