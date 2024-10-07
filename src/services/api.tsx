
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


     //  url api servidor VPN 
          export const api = axios.create({
              baseURL:"http://100.108.116.119:3000/v1",
              headers:{
                  "authorization": "token h43895jt9858094bun6098grubn48u59dsgfg234543tf",
              }
          })

   ///  url api servidor local 
   ///  export const api = axios.create({
   ///      baseURL:"http://192.168.100.15:3000",
   ///      headers:{
   ///          "authorization": "token h43895jt9858094bun6098grubn48u59dsgfg234543tf",
   ///      }
   ///  })


  
   ///  url api servidor linux 
     //    export const api = axios.create({
     //       baseURL:"http://100.74.166.88:3000/v1",
     //      headers:{
     //         "authorization": "token h43895jt9858094bun6098grubn48u59dsgfg234543tf",
     //    }
     //    })