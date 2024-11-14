import { TextInput,Text, Button, TouchableOpacity, View, Image } from "react-native";
 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
 

export const Teste = ({navigation})=>{
    return (
        <View style={{ flex: 1, backgroundColor: "#EAF4FE"  }}>
                      
                        <TouchableOpacity onPress={()=> navigation.goBack()} style={{   margin:10}}>
                            <Ionicons name="arrow-back" size={30} color="#185FED" />
                        </TouchableOpacity>

            <View style={{ width:'100%', alignItems:"center"  }}> 
                   
             <Image
                    style={{ width:145, height:145, resizeMode: 'stretch',}}
                    source={ {
                     uri: 'https://i.ibb.co/HXzm2Xf/Screenshot-1.png', } 
                    }
                   />
           </View>
  
     
      </View>
    )
}