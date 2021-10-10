const fs = require("fs");
const path = require('path');
const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const {
    load
} = require("mime");

const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://markguti97:markguti977@cluster0.wmnc7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

function dbAction(dbName, collectionName, handler) {

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    client.connect(err => {
        const dbo = client.db(dbName);
        const collection = dbo.collection(collectionName)

        handler(client, dbo, collection)
    })
};

const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {                                                    //foglalóoldal betöltése

    var indexPath = path.join(__dirname, "public",'index_fodrasz.html');

    fs.readFile(indexPath, (err, file) => {

        res.write(file);
        res.end()
    })
});

app.get("/fodraszat", (req, res) => {                                           // fodrászok nevének elküldése
    dbAction("Prooktatas", "fodraszat", (cli, dbo, coll) => {
        coll.find().toArray((err, resp) => {
            res.json(resp);
            cli.close();
        })
    })
});

app.get("/idopontok", (req, res) => {                                           // szabad időpontok betöltése
    
    dbAction("Prooktatas", "fodraszat", (cli, dbo, coll) => {
        coll.find().toArray((err, resp) => {
            res.json(resp);
            cli.close();
        })
    })
});

app.use(express.json())                                                             
app.post("/newreservation", (req, res) => {                                       // kiválasztott időpont lefoglalása

    var newReserv = Object.keys(req.body).filter(key =>
        key !== 'fodrasz').reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
    }, {});

    console.log(newReserv);

    dbAction("Prooktatas", "fodraszat", (cli, dbo, coll) => {

        coll.updateOne({
            neve: req.body.fodrasz
        }, {
            $push: {
                idopontfoglalas: newReserv
            }
        }, (err, resp) => {
            res.json({
                message: "Update OK",
            })
            cli.close();
        })
    })
});
app.post("/delreservation", (req, res) => {                                         // lefoglalt időpont törlése

    var delId = req.body;
    console.log(delId);

    dbAction("Prooktatas", "fodraszat", (cli, dbo, coll) => {

        coll.updateOne({
            neve: delId.fodrasz
        }, {
            "$pull": {
                "idopontfoglalas": {
                    "id": delId.id
                }
            }
        }, (err, resp) => {
            res.json({
                message: "OK",
            })
            cli.close();
        })

    })
});

app.post("/savereservation", (req, res) => {                                        // időpontmódosítások mentése

    var editedReserv = Object.keys(req.body).filter(key =>
        key !== 'fodrasz').reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
    }, {});

    console.log(editedReserv);

    dbAction("Prooktatas", "fodraszat", (cli, dbo, coll) => {

        coll.updateOne({
            neve: req.body.fodrasz
        }, {
            "$pull": {
                "idopontfoglalas": {
                    "id": editedReserv.id
                }
            }
        });
        coll.updateOne({
                neve: req.body.fodrasz
            }, {
                "$push": {
                    "idopontfoglalas": editedReserv
                }
            },
            (err, resp) => {
                res.json({
                    message: "Updated OK",
                    id: req.body.id
                })
                cli.close();
            })
    })
});

app.get("/login", (req, res) => {                                                   // bejelentkeztetés
    dbAction("Prooktatas", "fodraszat", (cli, dbo, coll) => {
        coll.find().toArray((err, resp) => {
            res.json(resp);
            cli.close();
        })
    })

});

app.listen("2200");