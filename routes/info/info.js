const express = require('express');
const cache = require("node-cache");
const info = express.Router();
const cvCache = new cache();

const conn = require('../../db/db.js');

info.get("/IdolInfo", async (req, res, next) => {
    if (!req.query.IdolID) res.redirect("./IdolInfo?IdolID=1");

    const [ListByGroup, List] = await DBGetIdolList();
    const IdolInfo = await DBGetIdolInfo(req.query.IdolID);

    const CardList = await DBGetCardList(req.query.IdolID);

    res.render('IdolInfo', {
        IdolList: ListByGroup,
        Img: GenerateImgObj(List[req.query.IdolID - 1].IdolNick),
        IdolInfo: IdolInfo,
        CardList: CardList
    });
});

info.get("/PCardInfo", async (req, res, next) => {
    if (!req.query.UUID) res.redirect("./IdolInfo?IdolID=1");

    const [ListByGroup, List] = await DBGetIdolList();    
    const [Panel, IdolID] = await DBGetPCardPanel(req.query.UUID);
    const IdolInfo = await DBGetIdolInfo(IdolID);
    const CardInfo = await DBGetPCardInfo(req.query.UUID);
    console.log(CardInfo);
    //console.log(Panel);


    res.render('PCardViewer', {
        IdolList: ListByGroup,
        SkillPanel: Panel,
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

function DBGetPCardPanel(CardUUID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.CardName, a.IdolID, b.* FROM `3-IdolCards` AS a, `10-CardSkillPanel` AS b WHERE a.CardUUID = ? AND a.CardID = b.CardID ORDER BY b.SkillSlot", 
        [CardUUID], 
        (err, result) => {
            res([result, result[0].IdolID]);
        });
    });
}

function DBGetPCardInfo(CardUUID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.*, b.DressUUID FROM `3-IdolCards` AS a, `20-IdolDresses` AS b WHERE a.CardUUID = ? AND a.DressIndex = b.DressIndex;", 
        [CardUUID], 
        (err, result) => {
            res(result[0]);
        });
    });
}
//14618ede-7ed7-41c9-adec-1b60d1830582