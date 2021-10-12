
import { firestore, realDataBase } from "./db";
import * as express from "express";
import { nanoid } from "nanoid";

import * as cors from "cors";



const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3003;

app.use(express.static("client"));

const userCollection = firestore.collection("users");
const gameRoomsCollection = firestore.collection("gamerooms");
console.log("Holaaaaaaa!!",gameRoomsCollection);

app.listen(port,()=>{
  console.log(`iniciado en http://localhost:${port}`);
})

//Agrega el user si no existe, sino solo devuelve el id
app.post("/signup", (req, res) => {
  const name = req.body.name;
  userCollection
    .where("name", "==", name)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        userCollection
          .add({
            name,
          })
          .then((newUserRef) => {
            res.json({ id: newUserRef.id, new: true });
          });
      } else {
        res.json({ id: searchRes.docs[0].id, new: false });
      }
    });
});

//Crea un room
app.post("/gamerooms", (req, res) => {
  const { userId, name } = req.body;
  console.log("Holaaaa",userId+name);
  
  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = realDataBase.ref(`gamerooms/${nanoid()}`);
        roomRef
          .set({
            currentGame: {
              [userId]: {
                name,
                choice: "",
                online: true,
                start: false,
              },
            },
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const gameuserId = 1000 + Math.floor(Math.random() * 999);

            gameRoomsCollection
              .doc(gameuserId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({
                  id: gameuserId.toString(),
                  
                  
                });
                
                
              });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    })
});

//Devuelve el id de la rtdb
//Si ya son dos jugadores o tu nombre no coincide con algun jugador devuelve un error
app.get("/gamerooms/:gameuserId", (req, res) => {
  const { userId } = req.query;
  const { gameuserId } = req.params;
  console.log("Soy el gameroomId",gameuserId );
  
  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const room = gameRoomsCollection.doc(gameuserId.toString()).get();
        room.then((snap) => {
          const data = snap.data();
          const rtdbId = data.rtdbRoomId;
          const roomRef = realDataBase.ref(`gamerooms/${rtdbId}/currentGame/`);
          roomRef.once("value", (snap) => {
            const players = snap.val();
            if (
              Object.keys(players).length == 2 &&
              !players[userId.toString()]
            ) {
              res.json({ message: "error" });
            } else {
              res.json(data);
            }
          });
        });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

//Agrega un participante al room
app.post("/gamerooms/participants", (req, res) => {
  const { userId, name, gameroomsId, rtdbId } = req.body;

  const roomRef = realDataBase.ref(`gamerooms/${rtdbId}/currentGame/`);

  gameRoomsCollection
    .doc(gameroomsId.toString())
    .get()
    .then((snap) => {
      roomRef
        .update({
          [userId]: { name, choice: "", online: true, start: false },
        })
        .then(() => {
          res.json(snap.data().history || "");
        });
    });
});

//Actualiza datos del room en rtdb y el history de jugadas en firestore
app.put("/gamerooms/:rtdbId", (req, res) => {
  const { userId, gameroomsId, history } = req.body;
  const game = req.body.currentGame;
  const { rtdbId } = req.params;

  gameRoomsCollection.doc(gameroomsId.toString()).update({
    history: history,
  });

  const roomRef = realDataBase.ref(`gamerooms/${rtdbId}/currentGame/${userId}`);
  roomRef
    .update({
      choice: game.choice,
      online: game.online,
      start: game.start,
    })
    .then(() => {
      res.json({ update: true });
    });
});

