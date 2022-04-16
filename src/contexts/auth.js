import React, { createContext, useState, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Context: Compartilhar dados entre telas
export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(false);

    // Hook - Ciclo de vida
    useEffect(() =>{
        // Verificar se já tem um usuário logado
        async function loadStorage(){
            const storageUser = await AsyncStorage.getItem('Auth_user');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        }

        loadStorage();

    }, []);

    // Função para logar o usuário
    async function signIn(email, pass){
        
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email, pass)
        .then(async (value) => {
            let uid = value.user.uid;
            await firebase.database().ref('users').child(uid).once('value')
            .then((snapshot) =>{
                let data = { 
                    uid: uid,
                    nome: snapshot.val().nome,
                    email: value.user.email
                };
                setUser(data);
                console.log(data);
                storageUser(data);
                setLoadingAuth(false);
            } );
        })
        .catch((error) => {
            alert(error.code);
            setLoadingAuth(false);
        })
    }

    // Cadastrar usuário
    async function signUp(email, pass, name){
        await firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(async (value) => {
            let uid = value.user.uid;
            console.log(uid);
            await firebase.database().ref('users').child(uid).set({
                saldo: 0,
                nome: name
            })
            .then( () =>{
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                };
                setUser(data);
                storageUser(data);
                
            })
            .catch((error) => {
                alert(error.code);
            })
        }).catch((error) => {
            alert(error.code);
        });
    }

    // Salva localmente as informações do usuário
    async function storageUser(data){
        await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
    }

    async function signOut(){
        await firebase.auth().signOut();
        await AsyncStorage.clear()
        .then(() => {
            setUser(null);
        }) 

    }

    return(
        // !! ->Existe usuario? - exporta/compartilha esses valores
        <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn, signOut, loading, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;