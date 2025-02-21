import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Clientes } from '..';   
import   { setMockQueryResult } from '../../../../__mocks__/expo-sqlite'  

jest.mock('@react-navigation/native');

describe('testing screen clients', () => {
  it('should render clients correctly', async () => {

    render(<Clientes />);

  });

  
});