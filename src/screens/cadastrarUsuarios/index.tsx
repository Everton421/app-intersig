import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import useApi from "../../services/api";
import { LodingComponent } from "../../components/loading";
import { CustomHeader } from "../../components/custom-header";

export const CadastroUsuario = ({navigation}:any) => {


    const [nomeUsuario, setNomeUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [ loading, setLoading ] = useState(false);
    const api = useApi();

   const showAlert = (message: any) => {
        Alert.alert('Alerta', message, [{ text: 'OK' }]);
    };




    async function gravar() {
        if (!nomeUsuario) return showAlert('É necessário informar o responsável da empresa');
        if (!email) return showAlert('É necessário informar o email do responsável da empresa');
        if (!senha) return showAlert('É necessário informar a senha do responsável da empresa');
        //if (!cnpj) return showAlert('É necessário informar o cnpj da empresa');

        let user = {
            "email": email,
            "senha": senha,
             "nome": nomeUsuario
        }

        try {
            setLoading(true)
            let response = await api.post('/usuarios', user);

            if (response.status === 200 ) {
                showAlert("Usuário Registrado com Sucesso!");
                 
                navigation.navigate('usuarios')
            } 

        } catch (e) {
            console.log(e)
        }finally{
            setLoading(false)
        }

    }


    return (
        <View style={{ flex: 1, backgroundColor: '#F0F4F8' }}>
          <LodingComponent isLoading={loading} />
          <CustomHeader
            title="Novo Usuário"
            showSearch={false}
            onBack={() => navigation.goBack()}
          />
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
              <View style={{ backgroundColor: "#FFF", borderRadius: 60, height: 110, width: 110, alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5, marginBottom: 20 }}>
                <FontAwesome6 name="user-tie" size={55} color="#185FED" />
              </View>
              <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 20, width: '100%', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: '#185FED', fontSize: 16, fontWeight: '600', marginBottom: 6 }}>Usuário</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#F9F9F9' }}>
                    <TextInput
                      style={{ flex: 1, paddingVertical: 10, fontSize: 16, color: '#333' }}
                      placeholder="Nome do usuário"
                      placeholderTextColor="#999"
                      onChangeText={(v) => setNomeUsuario(v)}
                    />
                    <FontAwesome name="user" size={20} color="#185FED" />
                  </View>
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: '#185FED', fontSize: 16, fontWeight: '600', marginBottom: 6 }}>Email</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#F9F9F9' }}>
                    <TextInput
                      style={{ flex: 1, paddingVertical: 10, fontSize: 16, color: '#333' }}
                      placeholder="example@example.com"
                      placeholderTextColor="#999"
                      onChangeText={(v) => setEmail(v)}
                    />
                    <MaterialIcons name="email" size={20} color="#185FED" />
                  </View>
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: '#185FED', fontSize: 16, fontWeight: '600', marginBottom: 6 }}>Senha</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#F9F9F9' }}>
                    <TextInput
                      style={{ flex: 1, paddingVertical: 10, fontSize: 16, color: '#333' }}
                      placeholder="Senha"
                      placeholderTextColor="#999"
                      secureTextEntry
                      onChangeText={(v) => setSenha(v)}
                    />
                    <MaterialIcons name="password" size={20} color="#185FED" />
                  </View>
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: '#185FED', borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#185FED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 }}
                  onPress={() => gravar()}
                >
                  <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Registrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
    )
} 