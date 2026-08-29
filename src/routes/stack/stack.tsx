import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "../../screens/home";
import { Configurações } from "../../screens/configurações";
import { Produtos } from "../../screens/Produtos";    
import { EditarOrcamento } from "../../screens/editar_orcamento";
import { Clientes } from "../../screens/clientes";
import { Servicos } from "../../screens/servicos";
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
import Veiculos from "../../screens/veiculos";
import Cadastro_veiculo from "../../screens/cadastroVeiculo";
import { CadastroUsuario } from "../../screens/cadastrarUsuarios";
import { Lista_pedidos } from "../../screens/pedidos";
import { Cadastro_caracteristicas } from "../../screens/cadastro-caracteristicas";
import { PedidoComponent } from "../../screens/_pedido_novo";
import { View } from "react-native";

const Stack = createStackNavigator();


    /** componente novo pedido */
    const NewOrderCompoent = ({navigation}:any)=>{
     return   <PedidoComponent navigation={navigation} tipo={1} isNewOrder={true}/>
    }

    /** Componente edição de um pedido */
    const EditOrderCompoent = ({navigation, route}:any)=>{
        const { codigo_orcamento } = route.params || {}
        return (
            <PedidoComponent
            tipo={1}
                navigation={navigation}
                isNewOrder={false}
                orderIdEdit={codigo_orcamento}
            />
        )
    }

    /** Componente nova ordem de serviço */
    const NewOsComponent = ( {navigation}:any ) =>{
        return   <PedidoComponent navigation={navigation} tipo={3} isNewOrder={true}/>
    }

    /** componente adição de uma ordem de serviço */
        const EditOsCompoent = ({navigation, route}:any)=>{
        const { codigo_orcamento } = route.params || {}
        return (
            <PedidoComponent
            tipo={3}
                navigation={navigation}
                isNewOrder={false}
                orderIdEdit={codigo_orcamento}
            />
        )
    }


    /*** componente que exibe os pedidos  */
    const Tela_lista_pedidos = ( {navigation,route}:any ) =>{
            return <View style={{flex:1}}  >
                   <Lista_pedidos tipo={1}  navigation={navigation} to={'novoOrcamento'} route={route} />
            </View>
    }

      
        /*** componente que exibe as os  */
    const Tela_lista_os = ( {navigation,route}:any ) =>{
           return <View style={{flex:1}}  >
                   <Lista_pedidos tipo={3}  navigation={navigation} to={'NovaOs'} route={route} />
            </View>
    }

    export const  MyStack = ()=>{

        return(
                <Stack.Navigator>
                    <Stack.Screen name="home"                      component={Home}     options={{headerShown:false}} />

                    <Stack.Screen name="produtos"                  component={Produtos} />

                    <Stack.Screen name="serviços"                  component={Servicos}  options={{headerShown:false}} />
                    <Stack.Screen name="cadastro_servico"          component={Cadastro_servico}  options={{ headerShown:false}} />

                    <Stack.Screen name="clientes"                  component={Clientes} options={{headerShown:false}} />
                    <Stack.Screen name="cadastro_cliente"          component={Cadastro_cliente}  options={{ headerShown:false }} />
                    <Stack.Screen name="cadastro_produto"          component={Cadastro_produto}  options={{headerShown:false}}  />

                    <Stack.Screen name="cadastro_caracteristicas"   component={Cadastro_caracteristicas}  options={{ headerShown:false }} />

                    <Stack.Screen name="cadastro_marcas"           component={Cadastro_Marcas}  options={{ headerShown:false }} />

                    <Stack.Screen name="cadastro_categorias"       component={ Cadastro_Categorias } options={{ headerShown:false }}  />

                    <Stack.Screen name="ajustes"                   component={Configurações}  options={{ headerShown:false }} />
                    
                    <Stack.Screen name="editarOrcamentoNovo"       component={EditOrderCompoent}  options={{ headerShown:false }} />
                    <Stack.Screen name="editarOS"                  component={EditOsCompoent}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="NovaOs"                    component={NewOsComponent}  options={{ headerShown:false }} />
                    <Stack.Screen name="novoOrcamento"             component={NewOrderCompoent}  options={{ headerShown:false }}  />
                    <Stack.Screen name="orçamentos"                component={Lista_pedidos}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}}  />
                  
                    <Stack.Screen name="vendas"                    component={Tela_lista_pedidos} options={{headerShown:false}} />
                    <Stack.Screen name="OS"                        component={Tela_lista_os}  options={{headerShown:false}} />
                
                
                    <Stack.Screen name="usuarios"                  component={Usuarios}  options={{headerShown:false}} />
                    <Stack.Screen name="cadastro_usuario"          component={CadastroUsuario}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="veiculos"                  component={ Veiculos }  options={{headerShown:false}}/>
                    <Stack.Screen name="cadastro_veiculos"         component={ Cadastro_veiculo }  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="Teste"                     component={ Teste }  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
                    <Stack.Screen name="ViewTabProdutos"           component={ViewTabProdutos} options={{headerShown:false}} />
                    <Stack.Screen name="formasPagamento"           component={FormasPagamento }      options={{headerShown:false}} />
                    <Stack.Screen name="cadastro_formaPagamento"   component={Cadastro_FormaPagamento}  options={{ headerStyle:{ backgroundColor:'#185FED'}, headerTintColor:'#FFF', title:"voltar"}} />
              
              
                </Stack.Navigator>
        )
    }

   