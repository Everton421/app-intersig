
import { useSQLiteContext } from "expo-sqlite";

export const restartDatabaseService = ()=>{


    const db = useSQLiteContext();

    async function restart(){

        await  db.execAsync(`
      DROP TABLE IF EXISTS produtos;
      DROP TABLE IF EXISTS clientes;
      DROP TABLE IF EXISTS forma_pagamento;
   -- DROP TABLE IF EXISTS usuarios ;
      DROP TABLE IF EXISTS servicos ;
      DROP TABLE IF EXISTS tipos_os;
      DROP TABLE IF EXISTS veiculos;



      CREATE TABLE IF NOT EXISTS produtos (
      codigo          INTEGER PRIMARY KEY NOT NULL,
      estoque         REAL DEFAULT 0 ,
      preco           REAL DEFAULT 0,
      grupo           INTEGER DEFAULT 0,
      origem          TEXT,   
      descricao       TEXT NOT NULL,
      num_fabricante  TEXT,
      num_original    TEXT,
      sku             TEXT,
      marca           INTEGER DEFAULT 0,
      ativo           TEXT DEFAULT 'S',
      class_fiscal    TEXT ,
      cst             TEXT DEFAULT '00',
      data_cadastro   TEXT NOT NULL,
      data_recadastro TEXT NOT NULL, 
      observacoes1    BLOB,
      observacoes2    BLOB,
      observacoes3    BLOB,
      tipo TEXT
      );
      

      CREATE TABLE IF NOT EXISTS servicos ( 
      codigo INTEGER PRIMARY KEY NOT NULL,
      valor REAL DEFAULT 0,
      aplicacao TEXT NOT NULL,
      tipo_serv INTEGER DEFAULT 0 
       );
    

    CREATE TABLE IF NOT EXISTS clientes (
      codigo INTEGER PRIMARY KEY NOT NULL,
      celular TEXT,
      nome TEXT NOT NULL,
      cep TEXT NOT NULL DEFAULT '00000-000',
      endereco TEXT,
      ie TEXT,
      numero TEXT,
      cnpj TEXT,
      cidade TEXT,
      data_cadastro TEXT NOT NULL,
      data_recadastro TEXT NOT NULL,
      vendedor INTEGER NOT NULL DEFAULT 0
     );
      --
      CREATE TABLE IF NOT EXISTS forma_pagamento (
        codigo INTEGER PRIMARY KEY NOT NULL ,
        descricao TEXT NOT NULL, 
        desc_maximo INTEGER DEFAULT 0,  
        parcelas INTEGER DEFAULT 0,  
        intervalo INTEGER DEFAULT 0,  
        recebimento INTEGER DEFAULT 0  
      );
  
  

    CREATE TABLE IF NOT EXISTS usuarios (
      codigo INTEGER PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL,
      senha TEXT NOT NULL 
    );

      CREATE TABLE IF NOT EXISTS tipos_os (
       codigo INTEGER PRIMARY KEY NOT NULL,
       descricao TEXT NOT NULL 
      );

      CREATE TABLE IF NOT EXISTS veiculos (
       codigo INTEGER PRIMARY KEY NOT NULL,
       cliente INTEGER  NOT NULL DEFAULT 0,
       placa TEXT NOT NULL,
       marca INTEGER  NOT NULL DEFAULT 0,
       modelo INTEGER  NOT NULL DEFAULT 0,
       ano TEXT NOT NULL,
       cor INTEGER  NOT NULL DEFAULT 0,
       combustivel TEXT NOT NULL 
      );
 

   `)
    }
return { restart }
}