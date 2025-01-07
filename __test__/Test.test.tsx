import { render } from '@testing-library/react-native'
import { Teste } from '../src/components/teste'
import { useMarcas } from '../src/database/queryMarcas/queryMarcas'

test("component teste", ()=>{
   render( <Teste/>)
})