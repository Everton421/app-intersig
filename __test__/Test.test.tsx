import { render } from '@testing-library/react-native'
import { Produtos } from '../src/screens/Produtos'

jest.mock('../src/database/queryProdutos/queryProdutos' , ()=>({
   useProducts: jest.fn(()=> ({
      selectByDescription: jest.fn().mockResolvedValue( []),
      selectAllLimit: jest.fn().mockResolvedValue([]),
   }))
}))



test("component teste", ()=>{
   const mockNavigation = { 
      navigate: jest.fn(),
      goBack: jest.fn(),
      addListener: jest.fn()
   }
   render( 
      <Produtos navigation={mockNavigation}   />
   )
})