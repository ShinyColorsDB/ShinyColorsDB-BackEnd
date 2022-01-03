const express = require('express');
const general = express.Router();

const conn = require('../../db/db.js');

general.get("/getIdolUnitList", async(req, res) => {
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

general.get("/getIdolInfo/:IdolID", async (req, res) => {
    const IdolInfo = await DBGetIdolInfo(req.params.IdolID);

    const CardInfo = await DBGetCardList(req.params.IdolID);

    IdolInfo.CardInfo = CardInfo;
    res.send(IdolInfo);
});

general.get("/getCardList", async (request, response) => {
    console.log(request.url);
    const CardList = await DBGetAllCardList();

    response.send(CardList);
});

general.get("/getPCardInfo", async (req, res) => {
    res.send(req.query.cardUUID);
});


module.exports = general;

function DBGetIdolList() {
    return new Promise((res, _) => {
        conn.execute("SELECT a.`IdolID`, a.`IdolName`, a.`UnitID`, b.`UnitHiragana` FROM `SCDB_Idols` AS a, `SCDB_Units` AS b WHERE a.`UnitID` != 8 AND a.`UnitID` = b.`UnitID`",[] , (err, result) => {
            if (err) throw err;
            res(result);
        });
    });
}

function DBGetIdolInfo(IdolID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.*, b.UnitName, b.UnitHiragana FROM `SCDB_Idols` AS a, `SCDB_Units` AS b WHERE a.`IdolID` = ? AND a.`UnitID` = b.`UnitID` LIMIT 1", [IdolID], (err, result) => {
            if (err) throw err;
            res(result[0]);
        });
    });
}

function DBGetCardList(IdolID) {
    return new Promise((res, _) => {
        conn.execute("SELECT * FROM `SCDB_CardList` WHERE `IdolID` = ? ORDER BY FIELD (`CardType`, \"P_SSR\", \"P_SR\", \"P_R\", \"S_SSR\", \"S_SR\", \"S_R\", \"S_N\"), `CardID`", [IdolID], (err, result) => {
            if (err) throw err;
            res(result);
        });
    });
}

function DBGetAllCardList() {
    return new Promise((resolve, reject) => {
        conn.execute("SELECT a.CardName, a.CardUUID, a.BigPic2, a.SmallPic, a.CardType FROM `SCDB_CardList` a ORDER BY FIELD (`CardType`, \"P_SSR\", \"P_SR\", \"P_R\", \"S_SSR\", \"S_SR\", \"S_R\", \"S_N\"), `IdolID`", [], (err, result) => {
            if (err) throw err;
            resolve(result);
        });
    });
}