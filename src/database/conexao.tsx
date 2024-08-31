import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { Suspense, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export async function construtor(db: SQLiteDatabase) {
    
    await db.execAsync(`
  PRAGMA journal_mode = 'wal';
   --  DROP TABLE produtos;
   --  DROP TABLE IF EXISTS clientes;
   --  DROP TABLE IF EXISTS forma_pagamento;
    --  DROP TABLE IF EXISTS pedidos;
    --   DROP TABLE IF EXISTS produtos_pedido ;
    --   DROP TABLE IF EXISTS parcelas ;




     CREATE TABLE IF NOT EXISTS produtos (codigo INTEGER PRIMARY KEY NOT NULL, estoque REAL DEFAULT 0 , preco REAL DEFAULT 0, grupo INTEGER DEFAULT 0, origem TEXT,   descricao TEXT NOT NULL,  num_fabricante, num_original TEXT, sku TEXT, marca INTEGER DEFAULT 0, ativo TEXT DEFAULT 'S', class_fiscal TEXT , cst TEXT DEFAULT '00', observacoes1 BLOB, observacoes2 BLOB, observacoes3 BLOB, tipo TEXT);
    
     -- Create the customers table
    CREATE TABLE IF NOT EXISTS clientes (
      codigo INTEGER PRIMARY KEY NOT NULL,
      celular TEXT,
      nome TEXT NOT NULL,
      cep TEXT NOT NULL DEFAULT '00000-000',
      endereco TEXT,
      ie TEXT,
      numero TEXT,
      cnpj TEXT,
      cidade TEXT
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

       -- Create the orders table
    CREATE TABLE IF NOT EXISTS pedidos (
      codigo INTEGER PRIMARY KEY AUTOINCREMENT,  
      situacao TEXT NOT NULL DEFAULT 'EA',
      descontos REAL DEFAULT 0.00,
      forma_pagamento INTEGER DEFAULT 0,
      observacoes BLOB,
      quantidade_parcelas INTEGER DEFAULT 0,
      total_geral REAL DEFAULT 0.00,
      total_produtos REAL DEFAULT 0.00,
      cliente INTEGER NOT NULL DEFAULT 0,
      data_cadastro TEXT NOT NULL 
    );

    -- Create the order items table
    CREATE TABLE IF NOT EXISTS produtos_pedido (
      pedido INTEGER NOT NULL,
      codigo INTEGER NOT NULL,
      desconto REAL DEFAULT 0.00,
      quantidade REAL DEFAULT 0.00,
      preco REAL DEFAULT 0.00,
      total REAL DEFAULT 0.00,
      FOREIGN KEY (pedido) REFERENCES pedidos(codigo) -- Add a foreign key constraint
    );

    CREATE TABLE IF NOT EXISTS parcelas (
      pedido INTEGER NOT NULL,
      parcela INTEGER NOT NULL,
      valor REAL NOT NULL DEFAULT 0.00,
      vencimento TEXT NOT NULL DEFAULT '0000-00-00',
       FOREIGN KEY (pedido) REFERENCES pedidos(codigo)
    );

 
     `);

  console.log('banco carregado com sucesso !');
  
  }