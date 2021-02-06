import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyB90DQNOgPy92Lq3BiPCIEgoAFPxWrrKp0",
    authDomain: "ts-to-67d90.firebaseapp.com",
    databaseURL: "https://ts-to-67d90.firebaseio.com",
    projectId: "ts-to-67d90",
    storageBucket: "ts-to-67d90.appspot.com",
    messagingSenderId: "499474585474",
    appId: "1:499474585474:web:3a5bf7a10fef400095619b",
    measurementId: "G-1LXEPTR38R"
  };


firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
window.firestore = db;
 
export const firestore = firebase.firestore();

export default firebase;
