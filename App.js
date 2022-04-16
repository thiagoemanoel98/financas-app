import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from './src/services/firebaseConnection';
import AuthProvider from './src/contexts/auth';
import Routes from './src/routes';

LogBox.ignoreAllLogs();

export default function App() {
  return (

    <NavigationContainer>
      <AuthProvider>
        <StatusBar style='light' translucent = {false}/>
        <Routes/>
      </AuthProvider>
    </NavigationContainer>
  );
}

