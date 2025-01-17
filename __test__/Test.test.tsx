import { render } from '@testing-library/react-native'
import { Teste } from '../src/components/teste'
import { useMarcas } from '../src/database/queryMarcas/queryMarcas'
import { Produtos } from '../src/screens/Produtos'

test("component teste", ()=>{
   render( <Produtos/>)
})