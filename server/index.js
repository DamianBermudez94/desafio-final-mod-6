"use strict";
exports.__esModule = true;
var db_1 = require("./db");
var express = require("express");
var nanoid_1 = require("nanoid");
var cors = require("cors");
var app = express();
app.use(express.json());
app.use(cors());
var port = process.env.PORT || 3003;
app.use(express.static("dist"));
var userCollection = db_1.firestore.collection("users");
var gameRoomsCollection = db_1.firestore.collection("gamerooms");
console.log("Holaaaaaaa!!", gameRoomsCollection);
app.listen(port, function () {
    console.log("iniciado en http://localhost:" + port);
});
//Agrega el user si no existe, sino solo devuelve el id
app.post("/signup", function (req, res) {
    var name = req.body.name;
    userCollection
        .where("name", "==", name)
        .get()
        .then(function (searchRes) {
        if (searchRes.empty) {
            userCollection
                .add({
                name: name
            })
                .then(function (newUserRef) {
                res.json({ id: newUserRef.id, "new": true });
            });
        }
        else {
            res.json({ id: searchRes.docs[0].id, "new": false });
        }
    });
});
//Crea un room
app.post("/gamerooms", function (req, res) {
    var _a = req.body, userId = _a.userId, name = _a.name;
    console.log("Holaaaa", userId + name);
    userCollection
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        var _a;
        if (doc.exists) {
            var roomRef_1 = db_1.realDataBase.ref("gamerooms/" + (0, nanoid_1.nanoid)());
            roomRef_1
                .set({
                currentGame: (_a = {},
                    _a[userId] = {
                        name: name,
                        choice: "",
                        online: true,
                        start: false
                    },
                    _a)
            })
                .then(function () {
                var roomLongId = roomRef_1.key;
                var gameuserId = 1000 + Math.floor(Math.random() * 999);
                gameRoomsCollection
                    .doc(gameuserId.toString())
                    .set({
                    rtdbRoomId: roomLongId
                })
                    .then(function () {
                    res.json({
                        id: gameuserId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "no existis"
            });
        }
    });
});
//Devuelve el id de la rtdb
//Si ya son dos jugadores o tu nombre no coincide con algun jugador devuelve un error
app.get("/gamerooms/:gameuserId", function (req, res) {
    var userId = req.query.userId;
    var gameuserId = req.params.gameuserId;
    console.log("Soy el gameroomId", gameuserId);
    userCollection
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            var room = gameRoomsCollection.doc(gameuserId.toString()).get();
            room.then(function (snap) {
                var data = snap.data();
                var rtdbId = data.rtdbRoomId;
                var roomRef = db_1.realDataBase.ref("gamerooms/" + rtdbId + "/currentGame/");
                roomRef.once("value", function (snap) {
                    var players = snap.val();
                    if (Object.keys(players).length == 2 &&
                        !players[userId.toString()]) {
                        res.json({ message: "error" });
                    }
                    else {
                        res.json(data);
                    }
                });
            });
        }
        else {
            res.status(401).json({
                message: "no existis"
            });
        }
    });
});
//Agrega un participante al room
app.post("/gamerooms/participants", function (req, res) {
    var _a = req.body, userId = _a.userId, name = _a.name, gameroomsId = _a.gameroomsId, rtdbId = _a.rtdbId;
    var roomRef = db_1.realDataBase.ref("gamerooms/" + rtdbId + "/currentGame/");
    gameRoomsCollection
        .doc(gameroomsId.toString())
        .get()
        .then(function (snap) {
        var _a;
        roomRef
            .update((_a = {},
            _a[userId] = { name: name, choice: "", online: true, start: false },
            _a))
            .then(function () {
            res.json(snap.data().history || "");
        });
    });
});
//Actualiza datos del room en rtdb y el history de jugadas en firestore
app.put("/gamerooms/:rtdbId", function (req, res) {
    var _a = req.body, userId = _a.userId, gameroomsId = _a.gameroomsId, history = _a.history;
    var game = req.body.currentGame;
    var rtdbId = req.params.rtdbId;
    gameRoomsCollection.doc(gameroomsId.toString()).update({
        history: history
    });
    var roomRef = db_1.realDataBase.ref("gamerooms/" + rtdbId + "/currentGame/" + userId);
    roomRef
        .update({
        choice: game.choice,
        online: game.online,
        start: game.start
    })
        .then(function () {
        res.json({ update: true });
    });
});
