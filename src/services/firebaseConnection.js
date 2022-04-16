import firebase from "firebase/app";
import 'firebase/database';
import 'firebase/auth';
import {API_KEY} from "@env";

let firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "financasapp-b9781.firebaseapp.com",
    databaseURL: "https://financasapp-b9781-default-rtdb.firebaseio.com",
    projectId: "financasapp-b9781",
    storageBucket: "financasapp-b9781.appspot.com",
    messagingSenderId: "639419643454",
    appId: "1:639419643454:web:0b7894e2a74606b655436f"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;