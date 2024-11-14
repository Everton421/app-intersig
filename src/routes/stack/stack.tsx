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
import { Teste } from "../../components/teste";

const Stack = createStackNavigator();

    export const  MyStack = ()=>{

  //const {  produtos }: any = useContext(ProdutosContext);
  const { logado, setLogado, usuario , setUsuario }:any = useContext(AuthContext)


        return(
                <Stack.Navigator>
   
                    <Stack.Screen name="home" component={Home} options={{headerShown:false}} />
                    <Stack.Screen name="produtos" component={Produtos} options={{headerShown:false}} />
                    <Stack.Screen name="serviços" component={Servicos}  options={{headerShown:false}} />
                    <Stack.Screen name="clientes" component={Clientes} options={{headerShown:false}} />
                    <Stack.Screen name="settings" component={Configurações}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="editarOrcamento" component={EditarOrcamento}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="editarOS" component={EditarOS}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="novoOrcamento" component={NovoOrcamento}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}}  />
                    <Stack.Screen name="orçamentos" component={OrcamentosRegistrados}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}}  />
                    <Stack.Screen name="NovaOs" component={NovaOs}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="usuarios" component={Usuarios}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="teste" component={Teste}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />

                    <Stack.Screen name="vendas" component={Vendas} options={{headerShown:false}} />

                    <Stack.Screen name="OS" component={Tela_os}  options={{headerShown:false}} />
                          
                        
                     
                </Stack.Navigator>
        )
    }

   