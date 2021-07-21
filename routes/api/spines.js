const express = require('express');
const spines = express.Router();

let conn = require('../../db/db');

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

spines.get("/dressList/:IdolID", (req, res, next) => {
    conn.query("SELECT * FROM `20-IdolDresses` WHERE `IdolID` = ? ORDER BY FIELD (`DressType`, \"P_SSR\", \"P_SR\", \"Anniversary\", \"Special\"), `DressIndex`", [req.params.IdolID], (err, result) => {
        res.send(result);
    });
});

spines.get("/updateLog", (req, res, next) => {
    conn.query("SELECT `Date`, `Content` FROM `21-SpineLog` ORDER BY `LogIndex` DESC LIMIT 5", (err, result) => {
        res.send(result);
    });
});

module.exports = spines;
