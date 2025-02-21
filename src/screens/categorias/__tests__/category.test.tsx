import { render } from "@testing-library/react-native"
import { RenderItemsCategory } from '../renderItensCategory/RenderItensCategory'
import { Categoria } from "..";
describe('categoryTest',()=>{
    test('renderItemsCategory',()=>{
        let item = { codigo:1, descricao:'teste'};
         const { } = render(<RenderItemsCategory item={item} /> ) 
    })

    test('categoryScreen',()=>{
        const { } = render(<Categoria/>);
    })
})