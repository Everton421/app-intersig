import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";
import { Login } from "../../screens/login"; 
import { Home } from "../../screens/home";

import AcertoCamera from "../../screens/acertoCodigoBarras/acertoCamera";
import { Configurações } from "../../screens/configurações";

import { Produtos } from "../../screens/produtos";
import { EnviaProduto } from "../../screens/enviaProdutos";
import { EnviaProdutoAntigo } from "../../screens/enviaProdutos/enviaProdutosAntigo";
import { AcertoProduto } from "../../screens/acerto_old/acertoProduto";
import { ListaProdutos } from "../../screens/orcamento/components/produtos";
import { useContext } from "react";
import ProdutosProvider, { ProdutosContext } from "../../contexts/produtosDoOrcamento";
import { Cliente    } from "../../screens/teste";
import { EditarOrcamento } from "../../screens/editar_orcamento";
import OrcamentoProvider from "../../contexts/orcamentoContext";
import { NovoOrcamento } from "../../screens/novo_orcamento";
import { OrcamentosRegistrados } from "../../screens/orcamento/registrados";   
import { Vendas } from "../../screens/tela_orcamentos";
 
import { NovaOs } from "../../screens/nova_os";
import { Tela_os } from "../../screens/tela_os";
import { EditarOS } from "../../screens/editar_os";
import { Api_config } from "../../screens/api_config";
import { Clientes } from "../../screens/clientes";
import { Servicos } from "../../screens/servicos";

const Stack = createStackNavigator();

    export const  MyStack = ()=>{

  const {  produtos }: any = useContext(ProdutosContext);


        return(
                <Stack.Navigator>

                    <Stack.Screen name="home" component={Home} options={{headerShown:false}} />
                    <Stack.Screen name="Acerto" component={AcertoCamera} options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}}/>
                    <Stack.Screen name="acertoProduto" component={AcertoProduto} options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="produtos" component={Produtos} options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="serviços" component={Servicos} options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="clientes" component={Clientes} options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="settings" component={Configurações}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                 
                    <Stack.Screen name="editarOrcamento" component={EditarOrcamento}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="editarOS" component={EditarOS}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />

                    <Stack.Screen name="novoOrcamento" component={NovoOrcamento}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}}  />
                    <Stack.Screen name="orçamentos" component={OrcamentosRegistrados}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}}  />
                    
                    <Stack.Screen name="vendas" component={Vendas} options={{headerShown:false}}/>
                    <Stack.Screen name="NovaOs" component={NovaOs}  options={{ headerStyle:{ backgroundColor:'#3339'}, headerTintColor:'#FFF', title:"voltar"}} />
                   
                    <Stack.Screen name="OS" component={Tela_os}  options={{headerShown:false}} />
                   

                    
                </Stack.Navigator>
        )
    }

  