
import { Text, TouchableOpacity } from "react-native"
import { client } from ".."

interface props   {
  item:client 
  handleSelect:(item:client)=>void
}

export function RenderItensClients( { item , handleSelect }:props ){
                return(
                    <TouchableOpacity 
                        onPress={ ()=> handleSelect(item) }
                        style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%'}}
                     >
                       <Text style={{ fontWeight:"bold"}}>
                          Codigo: {item.codigo}
                       </Text>
                       <Text>
                         {item.nome}
                       </Text>
                       <Text style={{ fontWeight:"bold" }}>
                           CNPJ:  {item.cnpj}
                       </Text>
                    </TouchableOpacity>
                )
            
            
              }
