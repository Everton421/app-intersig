import { Alert, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useCategoria } from "../../database/queryCategorias/queryCategorias";
import { FlatList } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { RenderItemsCategory } from "./renderItensCategory/RenderItensCategory";
import { LodingComponent } from "../../components/loading";
import { configMoment } from "../../services/moment";
import useApi from "../../services/api";
import { CustomHeader } from "../../components/custom-header";
import { EmptyState } from "../../components/empty-state";
import { Fab } from "../../components/fab";

type category = {
  codigo: number;
  descricao: string;
  data_cadastro:string 
  data_recadastro:string 
 id:string
};

export const Categoria = ({ navigation }: any) => {
  const [dados, setDados] = useState<category[]>([]);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [ categoriaSelecionada , setCategoriaSelecionada ] = useState<any>();
  const [ loading , setLoading ] = useState(false);

 const [ visible, setVisible ] = useState(false); 
  const useQueryCategoria = useCategoria();
         const dateService = configMoment();
         const api = useApi();

  useFocusEffect(() => {
    async function busca() {
      let data: any = await useQueryCategoria.selectAll();
      if (data?.length > 0) {
        setDados(data);
      }
    }
    if (pesquisa === "" || pesquisa === undefined) {
      busca();
    }
  });

  useEffect(() => {
    async function busca() {
      let data: any = await useQueryCategoria.selectByDescription(pesquisa);
      if (data?.length > 0) {
        setDados(data);
      }
    }

    if (pesquisa !== "" || pesquisa !== undefined) {
      busca();
    }
  }, [pesquisa]);


async function gravar(){
  if( !categoriaSelecionada?.descricao ) return Alert.alert("Erro!", "É necessario informar a descrição para poder gravar!") 
    try{
        
        setLoading(true);
        let objCategoria:any= {
                    "codigo": categoriaSelecionada && categoriaSelecionada.codigo,
                    "descricao": categoriaSelecionada && categoriaSelecionada.descricao,
                    "data_cadastro": categoriaSelecionada && categoriaSelecionada.data_cadastro,
                    "data_recadastro": dateService.dataHoraAtual(),
                    "id": categoriaSelecionada && categoriaSelecionada.id
                    }
        let result = await api.put('/marca', objCategoria);
        
        if(result.status === 200 ){
            try{
              let resultDb = await useQueryCategoria.update(objCategoria, objCategoria.codigo);
                }catch(e){
            return Alert.alert('Erro!', 'Erro ao Tentar Atualizar Categoria no banco local!');
            }
            setVisible(false)
            return Alert.alert('', ` Categoria: ${categoriaSelecionada?.descricao} Alterado Com Sucesso! ` );
        }


    }catch(e:any){
        if(e.status === 400 ){
            return Alert.alert('Erro!', e.response.data.msg);
        } else{
            console.log(e)
            return Alert.alert('Erro!', 'Erro desconhecido!');

        }  
    }finally{
        setLoading(false);
    }
}

  function handleSelect(item:category){
      setVisible(true);
      setCategoriaSelecionada(item)
      console.log(item)
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#EAF4FE" }}>
                         <LodingComponent isLoading={loading} />
      
      <CustomHeader
        title="Categorias"
        onBack={() => navigation.goBack()}
        showSearch
        searchValue={pesquisa}
        onSearchChange={(v) => setPesquisa(v)}
        showFilter
      />
 
      <Modal transparent={true} visible={visible} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '85%', backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', elevation: 10 }}>
            <View style={{ backgroundColor: '#185FED', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Editar Categoria</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 14, color: '#757575', marginBottom: 4 }}>Código</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>
                {categoriaSelecionada?.codigo}
              </Text>

              <Text style={{ fontSize: 14, color: '#757575', marginBottom: 4 }}>Descrição</Text>
              <TextInput
                style={{ backgroundColor: '#F5F7FA', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, height: 47, fontSize: 15, color: '#333' }}
                defaultValue={categoriaSelecionada?.descricao}
                onChangeText={(v) => setCategoriaSelecionada((prev: any) => ({ ...prev, descricao: v }))}
              />

              <TouchableOpacity
                style={{ backgroundColor: '#185FED', borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 25, elevation: 3 }}
                onPress={() => gravar()}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Gravar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
 
      {/**  */}
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={dados}
          renderItem={( {item} ) => ( <RenderItemsCategory  handleSelect={handleSelect} item={item} />) }
          keyExtractor={(i) => i.codigo.toString()}
          ListEmptyComponent={() => <EmptyState icon="category" message="Nenhuma categoria encontrada" />}
        />
      </View>
      {/**  */}
      <Fab onPress={() => navigation.navigate('cadastro_categorias')} />
    </View>
  );
};
