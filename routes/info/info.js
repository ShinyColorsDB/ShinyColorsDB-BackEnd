const express = require('express');
const cache = require("node-cache");
const info = express.Router();
const date = require("date-fns");
//const cvCache = new cache();

const conn = require('../../db/db.js');

info.get("/IdolInfo", async (req, res, next) => {
    if (!req.query.IdolID) res.redirect("./IdolInfo?IdolID=1");

    const [ListByGroup, List] = await DBGetIdolList();
    const IdolInfo = await DBGetIdolInfo(req.query.IdolID);

    const CardList = await DBGetCardList(req.query.IdolID);

    res.render('info/IdolInfo', {
        IdolList: ListByGroup,
        Img: GenerateImgObj(List[req.query.IdolID - 1].IdolNick),
        IdolInfo: IdolInfo,
        CardList: CardList
    });
});



// random name 

info.get("/PCardInfo", async (req, res, next) => {
    //res.redirect("./IdolInfo?IdolID=1");
    //return;
    if (!req.query.UUID) res.redirect("./IdolInfo?IdolID=1");

    const [ListByGroup, List] = await DBGetIdolList();
    const [Panel, IdolID] = await DBGetCardPanel(req.query.UUID);
    Panel.forEach(e => {
        e.SkillDesc = e.SkillDesc.replace(/\n/g, "<br>");
    });
    const IdolInfo = await DBGetIdolInfo(IdolID);
    const CardInfo = await DBGetCardInfo(req.query.UUID);
    CardInfo.GetMethod = convertGetMethod(CardInfo.GetMethod);
    //console.log(CardInfo);
    //console.log(Panel);
    const CardMemoryAppeal = await DBGetCardMemoryAppeal(req.query.UUID);
    const [CardIdolEvents, TrueEnd] = await DBGetCardIdolEvents(req.query.UUID);

    res.render('info/PCardViewer', {
        IdolList: ListByGroup,
        SkillPanel: Panel,
        IdolInfo: IdolInfo,
        CardInfo: CardInfo,
        CardMemoryAppeal: CardMemoryAppeal,
        CardIdolEvents: CardIdolEvents,
        TrueEnd: TrueEnd
    });

});

info.get("/SCardInfo", async (req, res) => {
    if (!req.query.UUID) res.redirect("./IdolInfo?IdolID=1");

    const [ListByGroup, List] = await DBGetIdolList();
    const [Panel, IdolID] = await DBGetCardPanel(req.query.UUID);
    if (!IdolID) {
        res.sendStatus(404);
        return;
    }
    Panel.forEach(e => {
        e.SkillDesc = e.SkillDesc.replace(/\n/g, "<br>");
    });
    const IdolInfo = await DBGetIdolInfo(IdolID);
    switch (IdolInfo.Hirameki) {
        case "Vo":
            IdolInfo.HiraName = "vocal";
            break;
        case "Da":
            IdolInfo.HiraName = "dance";
            break;
        case "Vi":
            IdolInfo.HiraName = "visual"
            break;
        case "Me":
            IdolInfo.HiraName = "mental"
            break;
    }
    const CardInfo = await DBGetCardInfo(req.query.UUID);
    CardInfo.GetMethod = convertGetMethod(CardInfo.GetMethod);
    
    const [SupportSkills0, SupportSkills1, SupportSkills2, SupportSkills3, SupportSkills4] = await DBGetSupportSkills(req.query.UUID);
    const SupportEvents = await DBGetSupportEvents(req.query.UUID);
    const IdeaMark = await DBGetIdeaMark(req.query.UUID);
    switch (IdeaMark.IdeaMark) {
        case "skill_point":
            IdeaMark.IdeaName = "アピール";
            break;
        case "mental":
            IdeaMark.IdeaName = "トーク";
            break;
        case "visual":
            IdeaMark.IdeaName = "ビジュアル";
            break;
        case "dance":
            IdeaMark.IdeaName = "ダンス";
            break;
        case "vocal":
            IdeaMark.IdeaName = "ボーカル";
            break;
    }
    const Proficiency = await DBGetProficiency(req.query.UUID);
    Proficiency.forEach(element => {
        switch (element.Proficiency) {
            case "sing_ability":
                element.ProfName = "歌唱力";
                break;
            case "feel_stable":
                element.ProfName = "安定感";
                break;
            case "teamwork":
                element.ProfName = "團結力";
                break;
            case "concentration":
                element.ProfName = "集中力";
                break;
            case "expressive_power":
                element.ProfName = "表現力";
                break;
        }
    });

    res.render('info/SCardViewer', {
        IdolList: ListByGroup,
        SkillPanel: Panel,
        IdolInfo: IdolInfo,
        CardInfo: CardInfo,
        SupportSkills0: SupportSkills0,
        SupportSkills1: SupportSkills1,
        SupportSkills2: SupportSkills2,
        SupportSkills3: SupportSkills3,
        SupportSkills4: SupportSkills4,
        SupportEvents: SupportEvents,
        IdeaMark: IdeaMark,
        Proficiency: Proficiency
    });
});

module.exports = info;

function convertGetMethod(method) {
    switch (method) {
        case "Events":
            return "活動報酬";
        case "LimitedGasha":
            return "限定卡池";
        case "GeneralGasha":
            return "常駐卡池";
        case "FesReward":
            return "天梯兌換";
        case "LiveReward":
            return "演唱會報酬";
        case "IdolRoad":
            return "偶像之路";
        default:
            return "";
    }
}

function DBGetIdolList() {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.`IdolID`, a.`IdolName`, a.`UnitID`, a.`NickName`, a.`Color1`, b.`UnitHiragana`, b.`Color1` FROM `SCDB_Idols` AS a, `SCDB_Units` AS b WHERE a.`UnitID` != 8 AND a.`UnitID` = b.`UnitID`", [], (err, result) => {
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

function DBGetIdolInfo(IdolID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.*, b.UnitName, b.UnitHiragana FROM `SCDB_Idols` AS a, `SCDB_Units` AS b WHERE a.`IdolID` = ? AND a.`UnitID` = b.`UnitID` LIMIT 1", [IdolID], (err, result) => {
            if (err) throw err;
            res(result[0]);
        });
    });
}

function DBGetCardList(IdolID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT * FROM `SCDB_CardList` WHERE `IdolID` = ? ORDER BY FIELD (`CardType`, \"P_SSR\", \"P_SR\", \"P_R\", \"S_SSR\", \"S_SR\", \"S_R\", \"S_N\"), `CardIndex`", [IdolID], (err, result) => {
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

function DBGetCardPanel(CardUUID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.CardName, a.IdolID, b.* FROM `SCDB_CardList` AS a, `SCDB_CardPanel` AS b WHERE a.CardUUID = ? AND a.CardIndex = b.CardIndex ORDER BY b.PanelSlot",
            [CardUUID],
            (err, result) => {
                if(err) throw err;

                if (!result[0]?.IdolID) {
                    res([result, 0]);
                }
                else {
                    res([result, result[0].IdolID]);
                }
            });
    });
}

function DBGetCardInfo(CardUUID) {
    return new Promise((res, rej) => {
        conn.execute("SELECT a.* FROM `SCDB_CardList` AS a WHERE a.CardUUID = ? ;",
            [CardUUID],
            (err, result) => {
                if(err) throw err;

                result[0].ReleaseDate = date.format(new Date(result[0].ReleaseDate), 'MM/dd/yyyy');
                res(result[0]);
            });
    });
}

function DBGetSupportSkills(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `SCDB_CardSupportSkill` AS a, `SCDB_CardList` AS b WHERE b.CardUUID = ? AND a.CardIndex = b.CardIndex",
            [CardUUID],
            (err, result) => {
                if(err) throw err;

                let tmp0 = new Map(),
                    tmp1 = new Map(),
                    tmp2 = new Map(),
                    tmp3 = new Map(),
                    tmp4 = new Map();
                result.forEach(element => {
                    if (element.GainedAt <= 60) {
                        setMap(element, tmp0);
                    }
                    if (element.GainedAt <= 65) {
                        setMap(element, tmp1);
                    }
                    if (element.GainedAt <= 70) {
                        setMap(element, tmp2);
                    }
                    if (element.GainedAt <= 75) {
                        setMap(element, tmp3);
                    }
                    if (element.GainedAt <= 80) {
                        setMap(element, tmp4);
                    }
                });
                const sm0 = Array.from(tmp0, ([key, value]) => value),
                    sm1 = Array.from(tmp1, ([key, value]) => value),
                    sm2 = Array.from(tmp2, ([key, value]) => value),
                    sm3 = Array.from(tmp3, ([key, value]) => value),
                    sm4 = Array.from(tmp4, ([key, value]) => value);
                res([sm0, sm1, sm2, sm3, sm4]);
            });
    });
}

function setMap(e, map) {
    if ((map.has(e.SkillName) && map.get(e.SkillName).SkillLevel < e.SkillLevel)
        || !map.has(e.SkillName)) {
        map.set(e.SkillName, e);
    }
}

function DBGetSupportEvents(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `SCDB_CardSupportEvent` a, `SCDB_CardList` b WHERE a.CardIndex = b.CardIndex AND b.CardUUID = ? ORDER BY `EventID`",
            [CardUUID],
            (err, result) => {
                if(err) throw err;

                res(result);
            });
    });
}

function DBGetProficiency(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `SCDB_CardProficiency` a, `SCDB_CardList` b WHERE a.CardIndex = b.CardIndex AND b.CardUUID = ?",
            [CardUUID],
            (err, result) => {
                if(err) throw err;

                res(result);
            });
    });
}

function DBGetIdeaMark(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `SCDB_CardIdeaMark` a, `SCDB_CardList` b WHERE a.CardIndex = b.CardIndex AND b.CardUUID = ?",
            [CardUUID],
            (err, result) => {
                if(err) throw err;

                res(result[0]);
            });
    });
}

function DBGetCardMemoryAppeal(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `SCDB_CardMemoryAppeal` a, `SCDB_CardList` b WHERE a.CardIndex = b.CardIndex AND b.CardUUID = ? AND a.MemoryTitle != '思い出アピール未習得'",
            [CardUUID],
            (err, result) => {
                if(err) throw err;

                res(result);
            })
    });
}

function DBGetCardIdolEvents(CardUUID) {
    return new Promise((res, _) => {
        conn.execute("SELECT a.* FROM `SCDB_CardIdolEvent` a, `SCDB_CardList` b WHERE a.CardIndex = b.CardIndex AND b.CardUUID = ? ORDER BY `EventID`",
            [CardUUID],
            (err, result) => {
                if (err) throw err;

                let iEvent = new Array(), tEvent = undefined;
                result.forEach(e => {
                    if (e.EventCategory == "アイドルイベント") {
                        iEvent.push(e);
                    }
                    else {
                        tEvent = e;
                    }
                });
                res([iEvent, tEvent]);
            });
    });
}
//14618ede-7ed7-41c9-adec-1b60d1830582