const express = require('express');
const spine = express.Router();
const mysql2 = require('mysql2');
const config = require('../config.json');
const conn = mysql2.createConnection(config);

spine.get("/idolList.json", (req, res, next) => {
    let data = new Array();
    conn.query("SELECT `IdolID`, `NickName`, `IdolName` FROM `1-Idols`", (err, result) => {
        result.forEach(element => {
            data.push({ IdolID: element.IdolID, Directory: element.NickName, IdolName: element.IdolName });
        });
        res.send(data);
    });
});

spine.get("/", (req, res, next) => {
    res.send("test");
});

module.exports = spine;
