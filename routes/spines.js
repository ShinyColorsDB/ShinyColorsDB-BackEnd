const express = require('express');
const spines = express.Router();
const mysql2 = require('mysql2');
const config = require('../config.json');
const conn = mysql2.createConnection(config);

spines.get("/idolList", (req, res, next) => {
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

module.exports = spines;