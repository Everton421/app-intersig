import { Text, TouchableOpacity } from "react-native";

type category = {
   codigo: number;
   descricao: string;
 };
 
type props = {
   item: category,
   handleSelect: (item:any)=> void
}
export function RenderItemsCategory({item, handleSelect}:props){
              return(
                  <TouchableOpacity 
                     onPress={ ()=> handleSelect(item) }
                      style={{ backgroundColor:'#FFF', elevation:2, padding:3, margin:5, borderRadius:5,  width:'95%' }}
                   >
                     <Text style={{ fontWeight:"bold"}}>
                        Codigo: {item.codigo}
                     </Text>
                     <Text>
                       {item.descricao}
                     </Text>
                   
                  </TouchableOpacity>
              )
          }