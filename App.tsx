import 'react-native-gesture-handler';
import { registerRootComponent } from "expo";
import { NavigationContainer } from '@react-navigation/native';
import AuthProvider from './src/contexts/auth';
import { Routes } from './src/routes';
import { construtor } from './src/database/conexao';  
import { useContext, useEffect } from 'react';
import * as SQLite  from 'expo-sqlite';
import ConnectedProvider, { ConnectedContext } from './src/contexts/conectedContext';
import NetInfo from '@react-native-community/netinfo';
// Only import react-native-gesture-handler on native platforms
import 'react-native-gesture-handler';
import { StatusBar } from 'react-native';

export default function App() {

  return (
    <ConnectedProvider>
          <AuthProvider>
              <SQLite.SQLiteProvider databaseName="test.db" onInit={construtor }>
            <StatusBar backgroundColor={'#185FED'  }     />
                
                <Routes/>
            </SQLite.SQLiteProvider>
          </AuthProvider>
    </ConnectedProvider>
 
  );
}

 