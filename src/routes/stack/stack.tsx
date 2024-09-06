import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";
import { Login } from "../../screens/login";
import { Home } from "../../screens/home";

import AcertoCamera from "../../screens/acertoCodigoBarras/acertoCamera";
import { Configurações } from "../../screens/configurações";

import { Produtos } from "../../screens/Produtos";
import { EnviaProduto } from "../../screens/enviaProdutos";
import { EnviaProdutoAntigo } from "../../screens/enviaProdutos/enviaProdutosAntigo";
import { AcertoProduto } from "../../screens/acerto/acertoProduto";
import { ListaProdutos } from "../../screens/orcamento/components/produtos";
import { useContext } from "react";
import ProdutosProvider, { ProdutosContext } from "../../contexts/produtosDoOrcamento";
import { Cliente    } from "../../screens/teste";
import { TabsOrcamento } from "../bottomTabsOrcamento/tabs";
import { EditarOrcamento } from "../../screens/editar_orcamento";
import OrcamentoProvider from "../../contexts/orcamentoContext";
import { NovoOrcamento } from "../../screens/novo_orcamento";
import { Registrados } from "../../screens/orcamento/registrados";
import { Vendas } from "../../screens/tela_orcamentos";
import { ItemSQLITE } from '../../components/teste/index'

const Stack = createStackNavigator();

    export const  MyStack = ()=>{

  const {  produtos }: any = useContext(ProdutosContext);


        return(
                <Stack.Navigator>

                    <Stack.Screen name="home" component={Home} options={{headerShown:false}} />
                    <Stack.Screen name="Acerto" component={AcertoCamera} options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}}/>
                    <Stack.Screen name="acertoProduto" component={AcertoProduto} options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="Produtos" component={Produtos} options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="configurações" component={Configurações}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="TabsOrcamento" component={TabsOrcamento}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                  
                    <Stack.Screen name="editarOrcamento" component={EditarOrcamento}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="novoOrcamento" component={NovoOrcamento}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="orçamentos" component={Registrados}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="vendas" component={Vendas}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="ItemSQLITE" component={ItemSQLITE}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />

                    
                </Stack.Navigator>
        )
    }

  