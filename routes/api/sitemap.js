const express = require('express');
const sitemap = express.Router();

const conn = require('../../db/db.js');

sitemap.get("/", async (_, res) => {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const idolSiteMap = await getIdolSiteMap(), 
        cardSiteMap = await getCardSiteMap();
    sitemap = sitemap.concat(idolSiteMap, cardSiteMap, `</urlset>`);
    res.send(sitemap);
});

module.exports = sitemap;

function getCardSiteMap() {
    return new Promise((res, _) => {
        let temp = new String();
        conn.query("SELECT a.CardUUID, a.CardType FROM `SCDB_CardList` a WHERE a.CardID != 0", [], (err, result) => {
            result.forEach(e => {
                temp = temp.concat(`<url>\n`);
                if(e.CardType.match(/P_/)) {
                    temp = temp.concat(`<loc>https://shinycolors.moe/info/PCardInfo?UUID=${e.CardUUID}</loc>\n`);
                }
                else {
                    temp = temp.concat(`<loc>https://shinycolors.moe/info/SCardInfo?UUID=${e.CardUUID}</loc>\n`);
                }
                temp = temp.concat(`</url>\n`);
            }); 
            res(temp);
        });
    });
}

function getIdolSiteMap() {
    return new Promise((res, _) => {
        let temp = new String();
        conn.query("SELECT * FROM `SCDB_Idols` WHERE `IdolID` NOT IN (0,26)", [],  (err, result) => {
            result.forEach(e => {
                temp = temp.concat(`<url>\n`);
                temp = temp.concat(`<loc>https://shinycolors.moe/info/IdolInfo?IdolID=${e.IdolID}</loc>\n`);
                temp = temp.concat(`</url>\n`);
            }); 
            res(temp);
        });
    });
}