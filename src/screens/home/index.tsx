import React, { useEffect, useContext } from "react";
import { View, FlatList, Text, Alert, BackHandler, TouchableOpacity, StatusBar, Image } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { EnviaProduto } from "../enviaProdutos";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { Grafico } from "../../components/grafico";


export const Home = ({navigation}:any) => {
  const { setLogado , setUsuario}: any = useContext(AuthContext);

  

  const data = [
      { "nome":"vendas",
       "icon":<MaterialCommunityIcons name="cart-variant" size={30} color="#009de2" />
       },
       { "nome":"OS",
         "icon": <FontAwesome5 name="tools" size={24} color="#009de2" />
         },
 
     // { "nome": "Acerto",
     // "icon":<MaterialCommunityIcons name="barcode-scan" size={30} color="#009de2" />
     // },
     // { "nome": "acertoProduto",
     // "icon":<AntDesign name="calculator" size={30} color="#009de2" />
     //  },

       
        { "nome":"produtos",
        "icon": <Foundation name="book" size={30} color="#009de2" />
        }, 
        { "nome":"serviços",
          "icon":<FontAwesome5 name="tools" size={24} color="#009de2" />
        },
        { "nome": "clientes",
          "icon":  <Feather name="users" size={30} color="#009de2" />
           },
       { "nome":"settings",
       "icon":<Feather name="settings" size={30} color="#009de2" />
       }, 

     
    ];

  const Item = ({ value }: any) => {
    return (
      <TouchableOpacity style={{  margin: 5    }}    onPress={ ()=> navigation.navigate(value.nome) }    >
          <View
            style={{   backgroundColor: "#FFF", margin: 10, borderRadius: 100, width: 65, height: 65, alignItems: "center", justifyContent: "center",  elevation:5  }} >
            

              {value.icon}

          </View>
          <Text style={{fontSize:15, fontWeight:"bold", textAlign:"center"}}> {value.nome}</Text>
 

      </TouchableOpacity>
      
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
      <View style={{margin:30,}}>
      <FlatList
        horizontal={true}
        data={data}
        renderItem={({ item }) => <Item value={item} />}
        showsHorizontalScrollIndicator={false}
      />
      </View>

      <Grafico/>

    </View>
  );
};
