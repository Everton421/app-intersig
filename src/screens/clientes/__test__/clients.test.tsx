 
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { Clientes } from '..';   
import { cliente,   } from '../../../database/queryClientes/queryCliente';


const mockNavigation = { 
  navigate: jest.fn(),
  goBack: jest.fn(),
  addlistener: jest.fn((event, callback)=>{
    if(event === 'focus'){
      callback();
    }
    return ()=>{}
  })
}

  const objMockClient: cliente =
   {
    codigo:1,
    celular:'44 999317550',
    cep:'86990000',
    cidade:'maringa',
    cnpj:'00000000000',
    endereco:'Rua teste.',
    estado:'PR',
    bairro: 'Conj teste.',
    ie:'16.395.238-3',
    nome:'Client test',
    numero:'1',
    data_cadastro:'2025-08-25',
    data_recadastro:'2025-08-25 00:00:00',
    vendedor: 2,
    
  }

 
jest.mock('../../../database/queryClientes/queryCliente', ()=> ({
   useClients: jest.fn(()=>({
    selectAllLimit: jest.fn().mockResolvedValue( [ objMockClient ] )
   }))
}) )

 

  test('testing screen clients',async () => {

        const { findByText } = render(<Clientes navigation={ mockNavigation }  />);

  //  await waitFor(()=>{
  //  //    expect(useClients().selectAllLimit).toHaveBeenCalled();
  //  //
    //  })


        
  //    render( <RenderItensClients handleSelect={ ( client)=>{} } item={objMockClient} /> )


  
});