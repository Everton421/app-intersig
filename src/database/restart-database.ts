
import { useSQLiteContext } from "expo-sqlite";
import { restartDatabaseSchema } from "./database-schema";

export const restartDatabaseService = ()=>{


    const db = useSQLiteContext();

    async function restart(){

        await  db.execAsync( restartDatabaseSchema)
   console.log('restart database')
    }
return { restart }
}