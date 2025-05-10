import { categoria, useCategoria } from "../database/queryCategorias/queryCategorias";
import { cliente, useClients } from "../database/queryClientes/queryCliente";
import { fpgt, useFormasDePagamentos } from "../database/queryFormasPagamento/queryFormasPagamento";
import { useFotosProdutos } from "../database/queryFotosProdutos/queryFotosProdutos";
import { marca, useMarcas } from "../database/queryMarcas/queryMarcas";
import { usePedidos } from "../database/queryPedido/queryPedido";
import { produto, useProducts } from "../database/queryProdutos/queryProdutos";
import { servico, useServices } from "../database/queryServicos/queryServicos";
import { tipoOs, useTipoOs } from "../database/queryTipoOs/queryTipoOs";
import { useVeiculos, Veiculo } from "../database/queryVceiculos/queryVeiculos";
 
import { configMoment } from "./moment";


 export  const insertDataFic = () => {

  const useQueryProdutos = useProducts();
  const useQueryClientes = useClients();
  const useQueryFpgt = useFormasDePagamentos();
  const useQueryTipoOs = useTipoOs();
  const useQueryServices = useServices();
  const useQueryVeiculos = useVeiculos();
  const useQueryPedidos = usePedidos();
   
  const useMoment = configMoment();
  const useQueryCategoria = useCategoria() 
  const useQueryMarcas = useMarcas();
  const useQueryFotos = useFotosProdutos();

  let products:produto[] = 
  [
    {
        codigo: 1,
        estoque:5,
        preco:10.5,
        grupo: 1,
        origem:"00" ,
        descricao:"Produto-teste-1",
        ativo: "S",
        sku: "PRD0001",
        marca:1,
        class_fiscal:"0000.00.00",
        cst:"00",
        num_fabricante:"132565",
        observacoes1:"",
        observacoes2:"",
        observacoes3:"",
        data_cadastro: useMoment.dataAtual(),
        data_recadastro:useMoment.dataHoraAtual(),
        tipo:'1'
    },
       {
        codigo: 2,
        estoque:6,
        preco:20.1,
        grupo: 1,
        origem:"00" ,
        descricao:"Produto-teste-2",
        ativo: "S",
        sku: "PRD0002",
        marca:1,
        class_fiscal:"0000.00.00",
        cst:"00",
        num_fabricante:"69344",
        observacoes1:"",
        observacoes2:"",
        observacoes3:"",
        data_cadastro: useMoment.dataAtual(),
        data_recadastro:useMoment.dataHoraAtual(),
        tipo:'1'

    }
  ]

let clients:cliente[] = [
    {
      codigo:1,
      nome:"sample-client-1",
      cnpj:"96.511.000/0001-25",
      ie: "099.999.812.097",
      cidade:"São Paulo",
      endereco:"Travessa C",
      cep:"04676-115",
      numero:"819",
      bairro:"Vila São Pedro",
      celular:"(11) 98185-7628",
      data_cadastro:useMoment.dataAtual(),
      data_recadastro: useMoment.dataHoraAtual(),
      estado:"SP",
      vendedor:1
    },
]
let fpgts:fpgt[] =
[
    {
        codigo:1,
        data_cadastro:useMoment.dataAtual(),
        data_recadastro:useMoment.dataHoraAtual(),
        desc_maximo:0,
        descricao:"A VISTA",
        intervalo:1,
        parcelas:1,
        recebimento:0
    }
]
let  tipoOs:tipoOs[] = [
    { 
        codigo:1,
        data_cadastro:useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
        descricao:"Pintura"
    },
    { 
        codigo:2,
        data_cadastro:useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
        descricao:"Manutenção"
    },
    
]

let services:servico[] = [
    {
        codigo:1,
        aplicacao: "Pintura",
        data_cadastro: useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
        tipo_serv:1,
        valor:100.50
    },
     {
        codigo:2,
        aplicacao: "Manutenção",
        data_cadastro: useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
        tipo_serv:2,
        valor:250.10
    }
]

let veiculos:Veiculo[] =[
    {
        codigo:1,
        ano:"2010",
        cliente:1,
        combustivel:"Gasolina",
        cor:"Vermelho",
        data_cadastro:useMoment.dataAtual(),
        data_recadastro:useMoment.dataHoraAtual(),
        marca:"Ford",
        modelo:"Fusion",
        placa:"MUT-1539",
        ativo:"S"
    },
    {
        codigo:2,
        ano:"2009",
        cliente:1,
        combustivel:"Diesel",
        cor:"Prata",
        data_cadastro:useMoment.dataAtual(),
        data_recadastro:useMoment.dataHoraAtual(),
        marca:"Ford",
        modelo:"Ranger TROPIVAN XLT 3.0 PSE 4x4 TB Dies.",
        placa:"BAY-6315",
        ativo:"S"
    },
] 

let categorias:categoria[] = [
    {
        codigo:1,
        data_cadastro:useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
        descricao:"Categoria-teste-1"
    },
    {
        codigo:2,
        data_cadastro:useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
        descricao:"Categoria-teste-2"
    },
    

]

let marcas:marca[] = [
        {
        codigo:1,
        data_cadastro:useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
        descricao:"Marca-teste-1"
    },
    {
        codigo:2,
        data_cadastro:useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
        descricao:"Marca-teste-2"
    },
    
]
let fotos=[
     {
		 produto : 1,
		 sequencia : 1,
		 descricao : "ft",
		 link : "https://i.ibb.co/H7grssp/RYZEN-5.png",
		 foto : "Wm5Rdw==",
		  data_cadastro:useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
	},
    {
		 produto : 2,
		 sequencia : 1,
		 descricao : "ft",
		 link : "https://i.ibb.co/Brqvtvj/Screenshot-6.png",
		 foto : "SUE9PQ==",
        data_cadastro:useMoment.dataAtual(),
        data_recadastro: useMoment.dataHoraAtual(),
	},
]

    async function main() {
            for( const p of products  ){
                    await useQueryProdutos.create(p)
            }
             for( const c of clients ){
                await useQueryClientes.createByCode(c)
            }
            for( const f of fpgts ){
                await useQueryFpgt.create(f)
            }
            for( const t of tipoOs){
                await useQueryTipoOs.create(t)
            }
            for( const s of services ){
                await useQueryServices.create(s);
            }
          for( const v of veiculos){
            await useQueryVeiculos.create(v)
          }

          for(const c of categorias ){
            await useQueryCategoria.create(c)
          }
          for( const m of marcas ){
            await useQueryMarcas.create(m)
          }
            for( const f of fotos ){
                await useQueryFotos.create(f)
            }
        }


    return {main }
}