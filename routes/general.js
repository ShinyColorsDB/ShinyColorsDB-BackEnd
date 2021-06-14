const express = require('express');
const general = express.Router();
const mysql2 = require('mysql2');
const config = require('../config.json');
const conn = mysql2.createConnection(config);

general.get("/getIdolUnitList", async(req, res, next) => {
    console.log(req.get("x-forwarded-for"));

    const IdolList = await DBGetIdolList();

    let Obj = new Object();
    Obj.UnitCount = 0;

    IdolList.forEach(element => {
        Obj.UnitCount = element.UnitID > Obj.UnitCount ? element.UnitID : Obj.UnitCount;
        Obj[element.UnitID] = {
            UnitName: element.UnitHiragana,
            UnitIdols: []
        }
    });

    IdolList.forEach(element => {
        Obj[element.UnitID].UnitIdols.push({
            IdolID: element.IdolID,
            IdolName: element.IdolName
        });
    });

    res.send(Obj);
});

module.exports = general;

function DBGetIdolList() {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.`IdolID`, a.`IdolName`, a.`UnitID`, b.`UnitHiragana` FROM `1-Idols` AS a, `2-Units` AS b WHERE a.`UnitID` != 8 AND a.`UnitID` = b.`UnitID`", (err, result) => {
            if (err) throw err;
            res(result);
        });
    });
}