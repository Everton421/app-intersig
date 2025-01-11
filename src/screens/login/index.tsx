import {
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
  Animated,
  ScrollView,
} from "react-native";
import useApi from "../../services/api";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { useUsuario } from "../../database/queryUsuario/queryUsuario";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { restartDatabaseService } from "../../services/restartDatabase";
import { queryEmpresas } from "../../database/queryEmpresas/queryEmpresas";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export const Login = ({ navigation }) => {
  const useQueryEmpresa = queryEmpresas();
  const api = useApi();

  const { logado, setLogado, usuario, setUsuario }: any =
    useContext(AuthContext);
  const useQueryUsuario = useUsuario();
  const useRestart = restartDatabaseService();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState<Boolean>(false);

  useEffect(() => {
    async function buscaUser() {
      let users: any = await useQueryUsuario.selectRemember();
      if (users?.length > 0) {
        setUsuario(users[0]);
        console.log(users);
        //   setLogado(true)
        //    navigation.navigate('home')
        setEmail(users[0].email);
        setSenha(users[0].senha);

        if (users[0].lembrar === "S") {
          setLembrar(true);
        }
      }
    }
    buscaUser();
  }, []);

  async function logar() {
    if (!email) return Alert.alert("é necessario informar o email!");
    if (!senha) return Alert.alert("é necessario informar a senha!");

    let user = { email: email, senha: senha };

    let userRemember: any = await useQueryUsuario.selectRemember();

    if (userRemember.length > 0 && userRemember[0].email === user.email) {
      if (lembrar === false) {
        await useQueryUsuario.updateRemember();
      }
      console.log("usuario encontrado", userRemember[0].nome);
      setUsuario(userRemember[0]);
      setLogado(true);
      return;
    } else {
      let response: any = await api.post("/login", user);

      if (response.status === 200) {
        if (response.data.ok === true) {
          console.log(response.data);

          let lembrarUsuario = lembrar ? "S" : "N";
          let userMobile = {
            email: response.data.email,
            senha: response.data.senha,
            cnpj: response.data.empresa,
            codigo: response.data.codigo,
            nome: response.data.nome,
            lembrar: lembrarUsuario,
          };

          await useRestart.restart();
          setUsuario(userMobile);
          setLogado(true);

          let codeUser = await useQueryUsuario.createUser(userMobile);
          let validEmpresa = await api.post("/empresa/validacao", {
            cnpj: response.data.empresa,
          });
          if (validEmpresa.data.cadastrada) {
            let objEmpr = {
              codigo_empresa: validEmpresa.data.codigo,
              nome: validEmpresa.data.nome,
              cnpj: validEmpresa.data.cnpj,
              email: validEmpresa.data.email_empresa,
              responsavel: validEmpresa.data.responsavel,
            };
            let aux = await useQueryEmpresa.createByCode(objEmpr);
          }

          setTimeout(() => {}, 2000);
        } else {
          return Alert.alert(response.data.msg);
        }
      } else {
        throw new Error(
          response.data.message || "Erro desconhecido ao logar na empresa."
        );
      }
      if(response.status === 400){
        Alert.alert('ocorreu um erro ao tentar se comunicar com a api!')
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#EAF4FE" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#EAF4FE" }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 5, marginTop: 25 }}
        >
          <Ionicons name="arrow-back" size={30} color="#185FED" />
        </TouchableOpacity>

        <View style={{ width: "100%", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 60,
              height: 120,
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              elevation: 3,
            }}
          >
            <FontAwesome6 name="user-tie" size={60} color="#185FED" />
          </View>

          <View
            style={{
              top: 10,
              backgroundColor: "#FFF",
              width: "90%",
              padding: 15,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: "#185FED",
                fontSize: 25,
                fontWeight: "bold",
                width: "100%",
                textAlign: "center",
              }}
            >
              {" "}
              Login{" "}
            </Text>

            <View style={{ width: "100%" }}>
              <Text style={{ color: "#185FED" }}> EMAIL </Text>
              <TextInput
                style={{ borderBottomWidth: 1, width: "90%" }}
                placeholder="example@example.com"
                onChangeText={(t) => setEmail(t)}
                value={email}
              />
            </View>

            <View style={{ width: "100%", marginTop: 50 }}>
              <Text style={{ color: "#185FED" }}> SENHA </Text>
              <TextInput
                style={{ borderBottomWidth: 1, width: "90%" }}
                secureTextEntry
                onChangeText={(v) => setSenha(v)}
                value={senha}
              />

              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 20,
                    backgroundColor: "#185FED",
                  }}
                  onPress={() => logar()}
                >
                  <Text
                    style={{
                      color: "#FFF",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    LOGIN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={{ margin: 5, alignItems: "center" }}
              onPress={() => {
                lembrar ? setLembrar(false) : setLembrar(true);
              }}
            >
              <View style={[{ padding: 8, borderWidth: 2, borderRadius: 2 }]}>
                {lembrar ? (
                  <View style={{ position: "absolute", left: -2, top: -9 }}>
                    <FontAwesome name="check" size={26} color="#185FED" />
                  </View>
                ) : null}
              </View>
              <Text style={{ width: "100%", textAlign: "center" }}>
                {" "}
                lembrar
              </Text>
            </TouchableOpacity>

        <TouchableOpacity style={{ margin:6}} onPress={()=> navigation.navigate('enviar_codigo')}>
                <Text style={{ color:'#185FED', fontWeight:"bold"}} > esqueci minha senha</Text>
        </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
};
