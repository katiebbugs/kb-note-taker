const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3001;

const db = require("./db/db");

// HTML Routes
    // Welcome Page
        app.get("/", function (req, res) {
            res.sendFile(path.join(__dirname, "/public/index.html"));
        });
    // Notes Page
        app.get("/notes", function (req, res) {
            res.sendFile(path.join(__dirname, "/public/notes.html"));
        });
// API Routes
    // GET
        app.get("/api/notes", function (req, res) {
            res.json(db);
        });
    // create function + POST
        app.post("/api/notes", function (req, res) {
            req.body.id = db.length.toString();

            db.push(req.body)

            fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(db), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("SAVED");
            });

            res.json(req.body);
        });
        
    // DELETE
        app.delete("/api/notes/:id", function (req, res) {
            for (let i = 0; i < db.length; i++) {

                if (db[i].id == req.params.id) {
                    db.splice(i, 1);
                    break;
                }
            }

            fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(db), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("DELETED");
            });

            res.json(db);
        });
// APP LISTEN
    app.listen(PORT, () => {
        console.log(`API server now on port ${PORT}`);
    });