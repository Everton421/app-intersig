
import { useSQLiteContext } from "expo-sqlite";

export const restartDatabaseService = ()=>{


    const db = useSQLiteContext();

    async function restart(){

        await  db.execAsync(` 
      
      DROP TABLE IF EXISTS produtos;
      DROP TABLE IF EXISTS clientes;
      DROP TABLE IF EXISTS forma_pagamento;
      DROP TABLE IF EXISTS usuarios ;
      DROP TABLE IF EXISTS servicos ;
      DROP TABLE IF EXISTS tipos_os;
      DROP TABLE IF EXISTS veiculos;
      DROP TABLE IF EXISTS pedidos;
      DROP TABLE IF EXISTS produtos_pedido ;
      DROP TABLE IF EXISTS servicos_pedido ;
      DROP TABLE IF EXISTS parcelas ;
      DROP TABLE IF EXISTS empresas;
      DROP TABLE IF EXISTS marcas;
      DROP TABLE IF EXISTS categorias;


  CREATE TABLE IF NOT EXISTS usuarios (
      codigo INTEGER  NOT NULL, 
      nome TEXT NOT NULL,
      senha TEXT NOT NULL, 
      email TEXT NOT NULL,
      cnpj TEXT ,
      lembrar TEXT DEFAULT 'N'
    ); 


     CREATE TABLE IF NOT EXISTS produtos (
      codigo          INTEGER PRIMARY KEY NOT NULL,
      estoque         REAL DEFAULT 0,
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
        data_cadastro TEXT NOT NULL,
      data_recadastro TEXT NOT NULL,
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
         data_cadastro TEXT NOT NULL,
        data_recadastro TEXT NOT NULL,
        recebimento INTEGER DEFAULT 0  
      );
   
       -- Create the orders table 
    CREATE TABLE IF NOT EXISTS pedidos (
      codigo INTEGER PRIMARY KEY ,
      vendedor INTEGER NOT NULL DEFAULT 0,   
      situacao TEXT NOT NULL DEFAULT 'EA',
      contato TEXT ,
      descontos REAL DEFAULT 0.00,
      forma_pagamento INTEGER DEFAULT 0,
      observacoes BLOB,
      quantidade_parcelas INTEGER DEFAULT 0,
      total_geral REAL DEFAULT 0.00,
      total_produtos REAL DEFAULT 0.00,
      total_servicos REAL DEFAULT 0.00,
      cliente INTEGER NOT NULL DEFAULT 0,
      veiculo INTEGER NOT NULL DEFAULT 0,
      data_cadastro TEXT NOT NULL,
      data_recadastro TEXT NOT NULL,
      tipo_os INTEGER DEFAULT 0, 
      enviado TEXT NOT NULL DEFAULT 'N',
      tipo INTEGER NOT NULL DEFAULT 1   --1 = Orçamento (gerado no sistema); 2 = Orçamento (gerado fora do sistema); 3 = Ordem de Serviço; 4 = Contrato de Prestação de Serviços; 5 = Devolução
    ); 
  
    -- Create the order items table
    CREATE TABLE IF NOT EXISTS produtos_pedido (
      pedido INTEGER NOT NULL,
      codigo INTEGER NOT NULL,
      desconto REAL DEFAULT 0.00,
      quantidade REAL DEFAULT 0.00,
      preco REAL DEFAULT 0.00,
      total REAL DEFAULT 0.00 
     -- FOREIGN KEY (pedido) REFERENCES pedidos(codigo) -- Add a foreign key constraint
    );
       
     
    CREATE TABLE IF NOT EXISTS servicos_pedido (
      pedido INTEGER NOT NULL,
      codigo INTEGER NOT NULL,
      desconto REAL DEFAULT 0.00,
      quantidade REAL DEFAULT 0.00,
      valor REAL DEFAULT 0.00 ,
      total REAL DEFAULT 0.00  
    -- FOREIGN KEY (pedido) REFERENCES pedidos(codigo) -- Add a foreign key constraint
    );


    CREATE TABLE IF NOT EXISTS parcelas (
      pedido INTEGER NOT NULL,
      parcela INTEGER NOT NULL,
      valor REAL NOT NULL DEFAULT 0.00,
      vencimento TEXT NOT NULL DEFAULT '0000-00-00' 
     -- FOREIGN KEY (pedido) REFERENCES pedidos(codigo)
    );

    
      CREATE TABLE IF NOT EXISTS tipos_os (
       codigo INTEGER PRIMARY KEY NOT NULL,
       descricao TEXT NOT NULL,
       data_cadastro TEXT NOT NULL,
       data_recadastro TEXT NOT NULL 
      );

      CREATE TABLE IF NOT EXISTS veiculos (
       codigo INTEGER PRIMARY KEY NOT NULL,
       cliente INTEGER  NOT NULL DEFAULT 0,
       placa TEXT NOT NULL,
       marca INTEGER  NOT NULL DEFAULT 0,
       modelo INTEGER  NOT NULL DEFAULT 0,
       ano TEXT NOT NULL,
       cor INTEGER  NOT NULL DEFAULT 0,
        data_cadastro TEXT NOT NULL,
       data_recadastro TEXT NOT NULL ,
       combustivel TEXT NOT NULL 
      );
 
      CREATE TABLE IF NOT EXISTS api_config (
       codigo INTEGER PRIMARY KEY NOT NULL,
       url TEXT NOT NULL,
       porta INTEGER  NOT NULL DEFAULT 3000,
       token TEXT NOT NULL 
      );
    CREATE TABLE IF NOT EXISTS empresas (
       codigo INTEGER PRIMARY KEY NOT NULL,
       cnpj TEXT NOT NULL,
       email TEXT NOT NULL,
       responsavel  INTEGER  NOT NULL DEFAULT 0,
       nome TEXT NOT NULL 
      );
      CREATE TABLE IF NOT EXISTS categorias (
       codigo INTEGER PRIMARY KEY NOT NULL,
       id TEXT NOT NULL DEFAULT 0,
       descricao TEXT NOT NULL,
       data_cadastro TEXT NOT NULL,
       data_recadastro TEXT NOT NULL 
      );

  CREATE TABLE IF NOT EXISTS marcas (
       codigo INTEGER PRIMARY KEY NOT NULL,
       id TEXT NOT NULL DEFAULT 0,
       descricao TEXT NOT NULL,
       data_cadastro TEXT NOT NULL,
       data_recadastro TEXT NOT NULL 
      );


 
   `)
   console.log('restart database')
    }
return { restart }
}