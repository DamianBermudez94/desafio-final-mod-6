import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "22CMvmfOEuA39maHhJP0Xpn1PWAjm8YEEUpQLSFi",
  authDomain: "dwf-m6-desafio-final-b6b81.firebaseapp.com",
  databaseURL: "https://dwf-m6-desafio-final-b6b81-default-rtdb.firebaseio.com/",
});

const rtdb = firebase.database();

export { rtdb };