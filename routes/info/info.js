const express = require('express');
const cache = require("node-cache");
const info = express.Router();
const cvCache = new cache();

const conn = require('../../db/db.js');

info.get("/IdolInfo", async (req, res, next) => {
    if (!req.query.IdolID) res.redirect("./idolInfo?IdolID=1");

    const [ListByGroup, List] = await DBGetIdolList();
    const IdolInfo = await DBGetIdolInfo(req.query.IdolID);

    const CardInfo = await DBGetCardList(req.query.IdolID);

    res.render('IdolInfo', {
        IdolList: ListByGroup,
        Img: GenerateImgObj(List[req.query.IdolID - 1].IdolNick),
        IdolInfo: IdolInfo,
        CardInfo: CardInfo
    });
});



module.exports = info;

function DBGetIdolList() {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.`IdolID`, a.`IdolName`, a.`UnitID`, a.`NickName`, b.`UnitHiragana` FROM `1-Idols` AS a, `2-Units` AS b WHERE a.`UnitID` != 8 AND a.`UnitID` = b.`UnitID`", [], (err, result) => {
            if (err) throw err;
            const ListByGroup = new Array(), List = new Array();
            result.forEach(element => {
                if (!ListByGroup[element.UnitID - 1]) {
                    ListByGroup[element.UnitID - 1] = {
                        UnitName: element.UnitHiragana,
                        Idols: new Array()
                    }
                }
                ListByGroup[element.UnitID - 1].Idols.push({ IdolName: element.IdolName, IdolID: element.IdolID });
                List.push({ IdolName: element.IdolName, IdolID: element.IdolID, IdolNick: element.NickName });
            });
            res([ListByGroup, List]);
        });
    });
}

function DBGetIdolInfo(IdolID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.*, b.UnitName, b.UnitHiragana FROM `1-Idols` AS a, `2-Units` AS b WHERE a.`IdolID` = ? AND a.`UnitID` = b.`UnitID` LIMIT 1", [IdolID], (err, result) => {
            if (err) throw err;
            res(result[0]);
        });
    });
}

function DBGetCardList(IdolID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT * FROM `3-IdolCards` WHERE `IdolID` = ? ORDER BY FIELD (`CardType`, \"P_SSR\", \"P_SR\", \"P_R\", \"S_SSR\", \"S_SR\", \"S_R\", \"S_N\"), `CardID`", [IdolID], (err, result) => {
            if (err) throw err;
            const CardList = {
                PSSR: [],
                PSR: [],
                PR: [],
                SSSR: [],
                SSR: [],
                SR: [],
                SN: []
            };
            result.forEach(element => {
                switch (element.CardType) {
                    case "P_SSR":
                        CardList.PSSR.push(element);
                        break;
                    case "P_SR":
                        CardList.PSR.push(element);
                        break;
                    case "P_R":
                        CardList.PR.push(element);
                        break;
                    case "S_SSR":
                        CardList.SSSR.push(element);
                        break;
                    case "S_SR":
                        CardList.SSR.push(element);
                        break;
                    case "S_R":
                        CardList.SR.push(element);
                        break;
                    case "S_N":
                        CardList.SN.push(element);
                        break;
                }
            });
            res(CardList);
        });
    });
}


function GenerateImgObj(str) {
    return {
        ImgPrivate: `https://static.shinycolors.moe/pictures/tachie/private/${str}.png`,
        ImgTsubasa: `https://static.shinycolors.moe/pictures/tachie/tsubasa/${str}.png`,
        ImgLive: `https://static.shinycolors.moe/pictures/tachie/live/${str}.png`
    }
}