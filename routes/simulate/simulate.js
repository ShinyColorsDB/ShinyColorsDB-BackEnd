const express = require('express');
const simulate = express.Router();
const date = require("date-fns");

const conn = require('../../db/db.js');

simulate.get("/produceSimulator", async (request, response) => {

    const [ListByGroup, List] = await DBGetIdolList();

    response.render('simulator/ProduceSimulator', {
        IdolList: ListByGroup
    });
});

module.exports = simulate;

function DBGetIdolList() {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.`IdolID`, a.`IdolName`, a.`UnitID`, a.`NickName`, a.`Color1`, b.`UnitHiragana`, b.`Color1` FROM `1-Idols` AS a, `2-Units` AS b WHERE a.`UnitID` != 8 AND a.`UnitID` = b.`UnitID`", [], (err, result) => {
            if (err) throw err;
            const ListByGroup = new Array(), List = new Array();
            result.forEach(element => {
                if (!ListByGroup[element.UnitID - 1]) {
                    ListByGroup[element.UnitID - 1] = {
                        UnitColor: element.Color1,
                        UnitName: element.UnitHiragana,
                        Idols: new Array()
                    }
                }
                ListByGroup[element.UnitID - 1].Idols.push({ IdolName: element.IdolName, IdolID: element.IdolID });
                List.push({ IdolName: element.IdolName, IdolID: element.IdolID, IdolNick: element.NickName, IdolColor: element.Color1 });
            });
            res([ListByGroup, List]);
        });
    });
}