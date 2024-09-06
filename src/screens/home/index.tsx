import React, { useEffect, useContext } from "react";
import { View, FlatList, Text, Alert, BackHandler, TouchableOpacity, StatusBar, Image } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { EnviaProduto } from "../enviaProdutos";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
export const Home = ({navigation}:any) => {
  const { setLogado , setUsuario}: any = useContext(AuthContext);

  

  const data = [
    { "nome":"vendas",
      "icon":<MaterialCommunityIcons name="cart-variant" size={30} color="#009de2" />
      },
    { "nome": "Acerto",
    "icon":<MaterialCommunityIcons name="barcode-scan" size={30} color="#009de2" />
     },
     { "nome": "acertoProduto",
     "icon":<AntDesign name="calculator" size={30} color="#009de2" />
      },

      { "nome":"Produtos",
      "icon": <Foundation name="book" size={30} color="#009de2" />
      },
      { "nome":"configurações",
      "icon":<Feather name="settings" size={30} color="#009de2" />
      }, 
      { "nome":"ItemSQLITE",
        "icon":<Feather name="settings" size={30} color="#009de2" />
        }, 
      
      
     
    ];

  const Item = ({ value }: any) => {
    return (
<View style={{alignItems:"center"  , margin:5, backgroundColor:'#F5F6F8', elevation:5, borderRadius:5, padding:3}}>
      <TouchableOpacity onPress={ ()=> navigation.navigate(value.nome) }
        style={{
          backgroundColor: "#FFF",
          margin: 15,
          borderRadius: 100,
          width: 65,
          height: 65,
          alignItems: "center",
          justifyContent: "center",
          elevation:7
        }}
      >
        {value.icon}
      </TouchableOpacity>
        <Text style={{fontSize:13, fontWeight:"bold"}}> {value.nome}</Text>
        </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <StatusBar backgroundColor={'#333'}/>
      <View style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor:'#333', elevation:7, padding:5 ,   }}>
        <Image
                style={{ width:55, height:55, resizeMode: 'stretch',}}
                 source={ 
                  require('../../imgs/intersig120x120.png')
                 }
                />

       <TouchableOpacity onPress={()=> setLogado(false)}>
         <MaterialCommunityIcons name="logout" size={24} color="white" />
       </TouchableOpacity>

        </View>
      <View style={{margin:20,}}>
      <FlatList
        horizontal={true}
        data={data}
        renderItem={({ item }) => <Item value={item} />}
        showsHorizontalScrollIndicator={false}
      />
      </View>
    </View>
  );
};
