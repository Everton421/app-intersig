import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator} from "react-native";
import { produto, useProducts } from "../../database/queryProdutos/queryProdutos";
import { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFotosProdutos } from "../../database/queryFotosProdutos/queryFotosProdutos";
import { RenderItem } from "./components/renderItem";
import { defaultColors } from "../../styles/global";
import { CustomHeader } from "../../components/custom-header";
import { EmptyState } from "../../components/empty-state";
import { Fab } from "../../components/fab";

export function Produtos ( {navigation}:any ){
  
    const useQueryProdutos = useProducts();
    const useQueryFotos = useFotosProdutos();

    const [ pesquisa, setPesquisa ] = useState<string>('');
    const [ dados , setDados ] = useState<produto[]>();
    const [ loadingItens, setLoadingItens  ] = useState(false);

type fotoProduto =
 {
    produto: number,
    sequencia:number,
    descricao:string,
    link:string,
    foto:string,
    data_cadastro:string,
    data_recadastro:string 
 }

    async function filterByDescription(){
        const response:any = await useQueryProdutos.selectByDescription(pesquisa, 10);

        for( let p of response ){
            let dadosFoto:any = await useQueryFotos.selectByCode(p.codigo)   
            if(dadosFoto?.length > 0 ){
                p.fotos = dadosFoto
            }else{
                p.fotos = []
            }
        }

        if(response.length > 0  ){
            setDados(response)
        }
    }

    async function filterAll(){
        const response:any = await useQueryProdutos.selectAllLimit(25);
        for( let p of response ){
            let dadosFoto:any = await useQueryFotos.selectByCode(p.codigo)   
            if(dadosFoto?.length > 0 ){
                p.fotos = dadosFoto
            }
        }
        if(response.length > 0  ){
            setDados(response)
        }
        console.log('  filterAll carregando produtos ....');
    }


///////
   useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
       if( pesquisa !== null || pesquisa !== '' ){
         filterByDescription()
       }else{
         filterAll()
       }

        filterAll()

    });

    return unsubscribe;
  }, [navigation]);

///////

useEffect(()=>{
    filterByDescription()
},[  pesquisa])

        type prop =  {  produto: produto }  

        function handleSelect(item:produto){
            navigation.navigate('cadastro_produto',{
                codigo_produto:item.codigo
            })
        }

     
     
     return  (

      <View style={{ flex:1, backgroundColor:'#EAF4FE', width:"100%" }}>
          <CustomHeader
              title="Produtos"
              onBack={() => navigation.goBack()}
              showSearch
              searchValue={pesquisa}
              onSearchChange={(v) => setPesquisa(v)}
          />
             


    {   
     loadingItens ? (
        <ActivityIndicator size={40} color={defaultColors.darkBlue}  />
     ):  
  
              <FlatList
                  data={dados || []}
                  renderItem={( {item} )=> < RenderItem  item={item}  handleSelect={handleSelect} /> }
                  keyExtractor={(i)=> i.codigo.toString()}
                  ListEmptyComponent={() => <EmptyState icon="inventory-2" message="Nenhum produto encontrado" />}
              /> 
     }

            <Fab onPress={() => navigation.navigate('cadastro_produto')} />


      </View> )   

      
     
}
 