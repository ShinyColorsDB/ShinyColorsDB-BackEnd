const express = require('express');
const cache = require("node-cache");
const info = express.Router();
const date = require("date-fns");
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
    res.redirect("./IdolInfo?IdolID=1");
    return;
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

info.get("/SCardInfo", async (req, res) => {
    if (!req.query.UUID) res.redirect("./IdolInfo?IdolID=1");

    const [ListByGroup, List] = await DBGetIdolList();    
    const [Panel, IdolID] = await DBGetSCardPanel(req.query.UUID);
    if (!IdolID) { 
        res.sendStatus(404);
        return;
    }
    Panel.forEach(e => {
        e.PanelDesc = e.PanelDesc.replace(/\n/g, "<br>");
    });
    const IdolInfo = await DBGetIdolInfo(IdolID);
    const CardInfo = await DBGetSCardInfo(req.query.UUID);
    switch(CardInfo.GetMethod) {
        case "Events": 
            CardInfo.GetMethod = "活動報酬";
            break;
        case "LimitedGasha":
            CardInfo.GetMethod = "限定卡池";
            break;
        case "GeneralGasha": 
            CardInfo.GetMethod = "常駐卡池";
            break;
        default:
            break;
    }
    const SupportSkills = await DBGetSupportSkills(req.query.UUID);
    const SupportEvents = await DBGetSupportEvents(req.query.UUID);
    const IdeaMark = await DBGetIdeaMark(req.query.UUID);
    switch(IdeaMark.IdeaMark) {
        case "skill_point":
            IdeaMark.IdeaMark = "アピール";
            break;
        case "mental":
            IdeaMark.IdeaMark = "トーク";
            break;
        case "visual":
            IdeaMark.IdeaMark = "ビジュアル";
            break;
        case "dance":
            IdeaMark.IdeaMark = "ダンス";
            break;
        case "vocal":
            IdeaMark.IdeaMark = "ボーカル";
            break;
    }
    const Proficiency = await DBGetProficiency(req.query.UUID);
    Proficiency.forEach(element => {
        switch(element.Proficiency) {
            case "sing_ability": 
                element.Proficiency = "歌唱力";
                break;
            case "feel_stable":
                element.Proficiency = "安定感";
                break;
            case "teamwork":
                element.Proficiency = "團結力";
                break;
            case "concentration":
                element.Proficiency = "集中力";
                break;
            case "expressive_power":
                element.Proficiency = "表現力";
                break;
        }
    });
    
    res.render('SCardViewer', {
        IdolList: ListByGroup,
        SkillPanel: Panel,
        IdolInfo: IdolInfo,
        CardInfo: CardInfo,
        SupportSkills: SupportSkills,
        SupportEvents: SupportEvents,
        IdeaMark: IdeaMark,
        Proficiency: Proficiency
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
        conn.execute("SELECT a.CardName, a.IdolID, b.* FROM `3-IdolCards` AS a, `10-CardSkillPanel` AS b WHERE a.CardUUID = ? AND a.CardIndex = b.CardIndex ORDER BY b.SkillSlot", 
        [CardUUID], 
        (err, result) => {
            res([result, result[0].IdolID]);
        });
    });
}

function DBGetSCardPanel(CardUUID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.CardName, a.IdolID, b.* FROM `3-IdolCards` AS a, `14-CardSkillPanels` AS b WHERE a.CardUUID = ? AND a.CardIndex = b.CardIndex ORDER BY b.PanelSlot", 
        [CardUUID], 
        (err, result) => {
            if (!result[0]?.IdolID) {
                res([result, 0]);
            }
            else {
                res([result, result[0].IdolID]);
            }
        });
    });
}

function DBGetPCardInfo(CardUUID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.*, b.DressUUID, b.Exist AS `DressExist` FROM `3-IdolCards` AS a, `20-IdolDresses` AS b WHERE a.CardUUID = ? AND a.DressIndex = b.DressIndex;", 
        [CardUUID], 
        (err, result) => {
            res(result[0]);
        });
    });
}

function DBGetSCardInfo(CardUUID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.* FROM `3-IdolCards` AS a WHERE a.CardUUID = ? ;", 
        [CardUUID], 
        (err, result) => {
            result[0].ReleaseDate = date.format(new Date(result[0].ReleaseDate), 'MM/dd/yyyy');
            res(result[0]);
        });
    });
}

function DBGetProperty(CardUUID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.")
    });
}

function DBGetSupportSkills(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `16-CardSupportSkills` AS a, `3-IdolCards` AS b WHERE b.CardUUID = ? AND a.CardIndex = b.CardIndex", 
        [CardUUID],
        (err, result) => {
            let tmp = new Map();
            result.forEach(element => {
                if (tmp.has(element.SkillName) && tmp.get(element.SkillName).SkillLevel < element.SkillLevel) {
                    tmp.set(element.SkillName, element);
                }
                else if (!tmp.has(element.SkillName)) {
                    tmp.set(element.SkillName, element);
                }
            });
            const ls = Array.from(tmp, ([key, value]) => value);
            res(ls);
        })
    });
}

function DBGetSupportEvents(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `19-CardSupportEvents` a, `3-IdolCards` b WHERE a.CardIndex = b.CardIndex AND b.CardUUID = ? ORDER BY `EventID`",
        [CardUUID], 
        (err, result) => {
            res(result);
        });
    }); 
}

function DBGetProficiency(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `18-CardProficiencies` a, `3-IdolCards` b WHERE a.CardIndex = b.CardIndex AND b.CardUUID = ?",
        [CardUUID], 
        (err, result) => {
            res(result);
        });
    }); 
}

function DBGetIdeaMark(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `17-CardIdeaMark` a, `3-IdolCards` b WHERE a.CardIndex = b.CardIndex AND b.CardUUID = ?",
        [CardUUID], 
        (err, result) => {
            res(result[0]);
        });
    }); 
}
//14618ede-7ed7-41c9-adec-1b60d1830582