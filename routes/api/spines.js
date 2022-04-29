const express = require('express');
const spines = express.Router();
const fns = require("date-fns-tz");

const conn = require('../../db/db');

spines.use((req, res, next) => {
    if(!req.get("origin") || !req.get("origin").match(/shinycolors\.moe/) || !req.get("user-agent")) {
        req.socket.end();
    }
    else {
        next();
    }
});

// /spines/idolList
spines.get("/idolList", (req, res, next) => {
    console.log(req.get("x-forwarded-for"));
    let data = new Array();
    conn.query("SELECT `IdolID`, `NickName`, `IdolName` FROM `SCDB_Idols`", (err, result) => {
        result.forEach(element => {
            data.push({ IdolID: element.IdolID, Directory: element.NickName, IdolName: element.IdolName });
        });
        res.send(data);
    });
});
// /spines/dressList/{IdolID}
spines.get("/dressList/:IdolID", (req, res, next) => {
    conn.query("SELECT * FROM `SCDB_IdolDress` WHERE `IdolID` = ? ORDER BY FIELD (`DressType`, \"P_SSR\", \"P_SR\", \"Anniversary\", \"Mizugi\", \"Special\", \"FesReward\", \"FesTour\", \"Other\"), `DressOrder`", [req.params.IdolID], (err, result) => {
        res.send(result);
    });
});
// /spines/updateLog
spines.get("/updateLog", (req, res, next) => {
    conn.query("SELECT `Date`, `Content` FROM `SCDB_SpineLog` ORDER BY `LogIndex` DESC LIMIT 5", (err, result) => {
        result.forEach(element => {
            element.Content = element.Content.replace(/\r/g, "").split("\n");
        });
        res.send(result);
    });
});

spines.get("/version", (req, res, next) => {
    conn.query()
});

module.exports = spines;
