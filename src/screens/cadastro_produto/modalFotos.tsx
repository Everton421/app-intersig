import { cloneElement, useState } from "react"
import { Image, Modal, requireNativeComponent, Text, TouchableOpacity, View } from "react-native"
import { FlatList, TextInput } from "react-native-gesture-handler";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';


export const Modal_fotos = ({img, codigo_produto , setImgs}:any)=>{
    const [ visible, setVisible ] = useState<Boolean>(false);
    const [ link, setLink ] = useState(''); 

    function renderImgs({item}){
        return(
            <View style={{ margin:5,  borderRadius:10}}>
                <View >
                    <Image
                    source={{ uri: `${item.link}` }}
                    // style={styles.galleryImage}
                    style={{ width: 100 , height: 100, borderRadius:5   }}
                    resizeMode="contain"
                    />
                </View>

            </View>
        )
    }

    function gravarImgs(  ){
        let tam = img.length
        let ultimoItem = img.find( (i)=> tam === i.sequencia   )
        let sequencia = ultimoItem.sequencia + 1; 

      let json =  {"data_cadastro": "0000-00-00", "data_recadastro": "0000-00-00 00:00:00", "descricao": link, "foto": link, "link": link, codigo_produto: 1, "sequencia": sequencia}
      console.log(json)
      img.push(json);
      setImgs(img)
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
                                    img  !== null  ?
                                    (
                                        <Image
                                        source={{ uri: `${img[0].link}` }}
                                        // style={styles.galleryImage}
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

                       <View style={{ alignItems:"center"}}>
                                <FlatList
                                         data={img}
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

                                    <TouchableOpacity  style={{ alignItems:"center"}} onPress={()=>gravarImgs()}> 
                                          <Entypo name="save" size={30} color="#185FED" />
                                          <Text style={{color:'#185FED', fontWeight:"bold"}}> salvar </Text>
                                     </TouchableOpacity> 
                                </View>
                       
                  </View>
                </View>

            </Modal>
      </View>
    )
}