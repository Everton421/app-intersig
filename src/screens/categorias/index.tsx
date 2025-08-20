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
  const [ categoriaSelecionada , setCategoriaSelecionada ] = useState<category>();
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
      
      <View style={{ backgroundColor: "#185FED" }}>
        <View
          style={{padding: 15,backgroundColor: "#185FED",alignItems: "center",flexDirection: "row",justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ margin: 5 }}
          >
            <Ionicons name="arrow-back" size={25} color="#FFF" />
          </TouchableOpacity>

          <View
            style={{ flexDirection: "row", marginLeft: 10, gap: 2, width: "100%", alignItems: "center"  }}
          >
            <TextInput
              style={{  width: "70%",fontWeight: "bold",padding: 5,margin: 5,textAlign: "center",borderRadius: 5,elevation: 5,backgroundColor: "#FFF"  }}
              onChangeText={(value) => setPesquisa(value)}
              placeholder="pesquisar"
            />

            <TouchableOpacity //onPress={()=> setShowPesquisa(true)}
            >
              <AntDesign name="filter" size={35} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
            style={{ left: 5,bottom: 5,color: "#FFF",fontWeight: "bold",fontSize: 20 }}
          >
            {" "}
            Categorias{" "}
          </Text>
        </View>
      </View>
 
  {/*          */}
      <Modal transparent={true} visible={visible && visible}>
        <View style={{ width: '100%', height: '100%', alignItems: "center", justifyContent: "center", backgroundColor: 'rgba(50,50,50, 0.5)' }} >
          <View style={{ width: '96%', height: '97%', backgroundColor: '#FFF', borderRadius: 10 }} >
            <View style={{ margin: 8 }}>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{ margin: 10, backgroundColor: "#185FED", padding: 7, borderRadius: 7, width: "20%", elevation: 5, }}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  voltar
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ margin: 10, gap: 15, flexDirection: "row" }}>
              <Image
                style={{ width: 70, height: 70 }}
                source={{
                  uri: 'https://reactnative.dev/img/tiny_logo.png'
                }}
              />
              <View style={{ backgroundColor: '#fff', borderRadius: 5, height: 25, flexDirection: "row", elevation: 5 }}>
                <Text style={{}}> Codigo: </Text>
                <Text style={{ fontWeight: "bold" }}> {  categoriaSelecionada?.codigo  } </Text>

              </View>
            </View>

            <View style={{ margin: 7, backgroundColor: '#FFF', borderRadius: 5, padding: 5 }}>
              <Text style={{}} >Descrição: </Text>
              <TextInput
                style={{ backgroundColor: '#fff', elevation: 3, width: '100%', borderRadius: 5, alignContent: "flex-start", }}
                defaultValue={ categoriaSelecionada ? categoriaSelecionada?.descricao : '' }
               onChangeText={ (v)=> setCategoriaSelecionada((prev:any) => { return { ...prev, descricao: v }} ) }
               />
            </View>

            <View style={{ flexDirection: "row", marginTop: 50, width: '100%', alignItems: "center", justifyContent: "center" }} >
              <TouchableOpacity
                style={{ backgroundColor: '#185FED', width: '80%', alignItems: "center", justifyContent: "center", borderRadius: 10, padding: 5 }}
               onPress={()=>gravar()}
              >
                <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>gravar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
       </Modal>
 
      {/**  */}
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={dados}
           // renderItem={(i ) => RenderItemsCategory(   i, handleSelect   ) }
          renderItem={( {item} ) => ( <RenderItemsCategory  handleSelect={handleSelect} item={item} />) }

          keyExtractor={(i) => i.codigo.toString()}
        />
      </View>
      {/**  */}
      <TouchableOpacity
        style={{backgroundColor: "#185FED",width: 50,height: 50,borderRadius: 25,position: "absolute",bottom: 150,right: 30,elevation: 10,alignItems: "center",justifyContent: "center",zIndex: 999, // Garante que o botão fique sobre os outros itens
        }}
        onPress={() => {
          navigation.navigate("cadastro_categorias");
        }}
      >
        <MaterialIcons name="add-circle" size={45} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};
