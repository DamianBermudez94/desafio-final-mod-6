import * as admin from "firebase-admin";

const serviceAccount = require("./key.json");
console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://dwf-m6-desafio-final-b6b81-default-rtdb.firebaseio.com/"
});

const firestore = admin.firestore();

const realDataBase = admin.database();

export{firestore,realDataBase};