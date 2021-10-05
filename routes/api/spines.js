const express = require('express');
const spines = express.Router();
const fns = require("date-fns-tz");

const conn = require('../../db/db');

spines.use((req, res, next) => {
    console.log(req.get("host"), req.get("origin"));
    if(req.get("origin").match(/spine\.shinycolors\.moe/)) {
        next();
    }
    else {
        res.sendStatus(403);
    }
});

// /spines/idolList
spines.get("/idolList", (req, res, next) => {
    console.log(req.get("x-forwarded-for"));
    let data = new Array();
    conn.query("SELECT `IdolID`, `NickName`, `IdolName` FROM `1-Idols`", (err, result) => {
        result.forEach(element => {
            data.push({ IdolID: element.IdolID, Directory: element.NickName, IdolName: element.IdolName });
        });
        res.send(data);
    });
});
// /spines/dressList/{IdolID}
spines.get("/dressList/:IdolID", (req, res, next) => {
    conn.query("SELECT * FROM `20-IdolDresses` WHERE `IdolID` = ? ORDER BY FIELD (`DressType`, \"P_SSR\", \"P_SR\", \"Anniversary\", \"Mizugi\", \"Special\", \"FesReward\", \"Other\"), `DressOrder`", [req.params.IdolID], (err, result) => {
        res.send(result);
    });
});
// /spines/updateLog
spines.get("/updateLog", (req, res, next) => {
    conn.query("SELECT `Date`, `Content` FROM `21-SpineLog` ORDER BY `LogIndex` DESC LIMIT 5", (err, result) => {
        result.forEach(element => {
            element.Content = element.Content.replace(/\r/g, "").split("\n");
        });
        res.send(result);
    });
});

module.exports = spines;
