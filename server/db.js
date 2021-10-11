"use strict";
exports.__esModule = true;
exports.realDataBase = exports.firestore = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
console.log(serviceAccount);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dwf-m6-desafio-final-b6b81-default-rtdb.firebaseio.com/"
});
var firestore = admin.firestore();
exports.firestore = firestore;
var realDataBase = admin.database();
exports.realDataBase = realDataBase;
