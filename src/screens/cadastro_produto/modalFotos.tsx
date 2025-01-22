import { cloneElement, useEffect, useState } from "react"
import { Image, Modal, requireNativeComponent, Text, TouchableOpacity, View } from "react-native"
import { FlatList, TextInput } from "react-native-gesture-handler";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { typeFotoProduto } from "./types/fotos";

type props = 
{
    imgs: typeFotoProduto,
    codigo_produto:number,
    setImgs:any
}
export const Modal_fotos = ({imgs , codigo_produto , setImgs} :any)=>{
    const [ visible, setVisible ] = useState<Boolean>(false);
    const [ link, setLink ] = useState(''); 
    const [ fotos, setFotos ] = useState<typeFotoProduto[]>([])


 

    function deleteItemListImgs(item){
        setImgs ((prev:any) => {
                    let aux =  prev.filter( (i) => i.sequencia !==  item.sequencia )
                    return aux
           });

 }

    function renderImgs({item}){
        return(
            <View style={{ margin:5,padding:4, borderRadius:10, backgroundColor:'#FFF', elevation:3}}>
                   <TouchableOpacity
                     onPress={()=> deleteItemListImgs(item)} 
                     >
                        <AntDesign name="closecircle" size={24} color="red" />
                    </TouchableOpacity>
                    <Image
                    source={{ uri: `${item.link}` }}
                    // style={styles.galleryImage}
                    style={{ width: 120 , height: 120, borderRadius:5   }}
                    resizeMode="contain"
                    />
            </View>
        )
    }

    function gravarImgs(  ){
        if( link === '')  return
        let tam = imgs.length
        let ultimoItem = imgs.find( (i)=> tam === i.sequencia   )
        let sequencia = ultimoItem.sequencia + 1; 

      let json =  {"produto": codigo_produto, "data_cadastro": "0000-00-00", "data_recadastro": "0000-00-00 00:00:00", "descricao": link, "foto": link, "link": link, codigo_produto: 1, "sequencia": sequencia}
        
      setImgs((prev)=> ({
        ...prev,
         json
    }))

      setLink('')
    }

    return(
        <View style={{ flex:1}}>

            <TouchableOpacity
                onPress={()=>{setVisible(true)}}
            >
                         <View
                            style={{ margin:2 }}  >
                                {
                                        imgs !== null ?
                                    (
                                        <Image
                                        source={{ uri: `${ imgs[0].link}` }}
                                        style={{ width: 100 , height: 100, borderRadius:5   }}
                                        resizeMode="contain"
                                        />
                                   
                                    ):(
                                          <Image
                                                style={{ width: 100, height: 100 }}
                                                source={{
                                                    uri: 'https://reactnative.dev/img/tiny_logo.png'
                                                }}
                                            />
                                    ) 
                                }
                           </View>
            </TouchableOpacity>

            <Modal visible={visible } transparent={true}>
              <View style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", flex: 1 }} >
                <View style={{ backgroundColor: "#FFF", flex: 1 , margin:15, borderRadius:15, height:'80%'}} >
                          <View style={{    backgroundColor:'#FFF'}}>

                                <TouchableOpacity
                                    onPress={()=>{   setVisible(false) }}
                                    style={{  margin: 15, backgroundColor: "#185FED",  padding: 7, borderRadius: 7 ,width: "20%", elevation: 5  }}>
                                            <Text  style={{ color: "#FFF", fontWeight: "bold" }} >  voltar   </Text>
                                    </TouchableOpacity>
                         </View>

                       <View style={{ alignItems:"center" }}>
                                <FlatList
                                         data={imgs}
                                         keyExtractor={(item)=>item.sequencia}
                                         renderItem={(item)=> renderImgs(item)}
                                         horizontal={true}
                                        />
                       
                       </View>
                                <View style={{ alignItems:"center",}}>


                                    {
                                        link !== '' ? (
                                            <View style={{margin:10}}>
                                                    <Image
                                                      style={{ width: 100, height: 100 }}
                                                      source={{
                                                          uri:  `${link}`
                                                      }}
                                                  />
                                            </View>
                                        ):(
                                            <View style={{margin:10}}>
                                               <Entypo name="image" size={54} color="#185FED" />
                                            </View>

                                        )
                                    }
                                        <TextInput
                                            style={{borderWidth:1, width:'90%', padding:10, borderRadius:5}}
                                            placeholder="https://reactnative.dev/img/tiny_logo.png"
                                        onChangeText={(v)=>{setLink(v)}}
                                        value={link}
                                    />

                                    <TouchableOpacity  style={{padding:5, alignItems:"center"}} onPress={()=>gravarImgs()}> 
                                          <Entypo name="arrow-with-circle-up" size={35} color="#185FED" />
                                          <Text style={{color:'#185FED', fontWeight:"bold"}}> salvar </Text>
                                     </TouchableOpacity> 

                                     <TouchableOpacity  style={{padding:5, alignItems:"center"}} onPress={()=> console.log(imgs)}> 
                                          <Entypo name="arrow-with-circle-up" size={35} color="#185FED" />
                                          <Text style={{color:'#185FED', fontWeight:"bold"}}> mostrar </Text>
                                     </TouchableOpacity> 
                                </View>
                       
                  </View>
                </View>

            </Modal>
      </View>
    )
}