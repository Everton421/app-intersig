// seu arquivo de teste
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Cart } from '../src/screens/orcamento/components/Cart';

// Mock do @expo/vector-icons de forma mais completa
jest.mock('@expo/vector-icons', () => ({
  Ionicons: {
    createIconSetFromFontello: jest.fn(),
  },
  AntDesign: {
    createIconSetFromFontello: jest.fn(),
  },
}));

test('teste component orcamento', () => {
  render(<Cart />);
});