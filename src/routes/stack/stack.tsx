import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "../../screens/home";
import { Configurações } from "../../screens/configurações";
import { Produtos } from "../../screens/Produtos";    
import { useContext } from "react";
import { EditarOrcamento } from "../../screens/editar_orcamento";
import { NovoOrcamento } from "../../screens/novo_orcamento";
import { OrcamentosRegistrados } from "../../screens/orcamento/registrados";   
import { Vendas } from "../../screens/tela_orcamentos";
import { NovaOs } from "../../screens/nova_os";
import { Tela_os } from "../../screens/tela_os";
import { EditarOS } from "../../screens/editar_os";
import { Clientes } from "../../screens/clientes";
import { Servicos } from "../../screens/servicos";
 
import { AuthContext } from "../../contexts/auth";
import { Usuarios } from "../../screens/usuarios";
import { Cadastro_produto } from "../../screens/cadastro_produto";
import { ViewTabProdutos } from "../../screens/tabProdutos";
import { Cadastro_Marcas } from "../../screens/cadastrarMarcas";
import { Cadastro_Categorias } from "../../screens/cadastrarCategorias";
import { Cadastro_cliente } from "../../screens/cadastro_cliente";
import { FormasPagamento } from "../../screens/formasDePagamento";
import { Cadastro_FormaPagamento } from "../../screens/cadastro-FormaPagamento";
import { Teste } from "../../components/teste";
import { Cadastro_servico } from "../../screens/cadastro_servicos";

const Stack = createStackNavigator();

    export const  MyStack = ()=>{

        return(
                <Stack.Navigator>
   
                    <Stack.Screen name="home" component={Home} options={{headerShown:false}} />
                    <Stack.Screen name="produtos" component={Produtos} options={{headerShown:false}} />

                    <Stack.Screen name="serviços" component={Servicos}  options={{headerShown:false}} />
                    <Stack.Screen name="cadastro_servico" component={Cadastro_servico}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    
                    
                    <Stack.Screen name="clientes" component={Clientes} options={{headerShown:false}} />
                    <Stack.Screen name="settings" component={Configurações}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="editarOrcamento" component={EditarOrcamento}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="editarOS" component={EditarOS}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="novoOrcamento" component={NovoOrcamento}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}}  />
                    <Stack.Screen name="orçamentos" component={OrcamentosRegistrados}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}}  />
                    <Stack.Screen name="NovaOs" component={NovaOs}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="usuarios" component={Usuarios}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="cadastro_produto" component={Cadastro_produto}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="cadastro_cliente" component={Cadastro_cliente}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="cadastro_marcas" component={Cadastro_Marcas}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="cadastro_categorias" component={ Cadastro_Categorias }  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />

                    <Stack.Screen name="Teste" component={ Teste }  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />


                    <Stack.Screen name="ViewTabProdutos" component={ViewTabProdutos} options={{headerShown:false}} />
                    <Stack.Screen name="vendas" component={Vendas} options={{headerShown:false}} />
                    <Stack.Screen name="OS" component={Tela_os}  options={{headerShown:false}} />

                    <Stack.Screen name="formasPagamento" component={FormasPagamento }   options={{headerShown:false}} />
                    <Stack.Screen name="cadastro_formaPagamento" component={Cadastro_FormaPagamento}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />

        
                    
                </Stack.Navigator>
        )
    }

   