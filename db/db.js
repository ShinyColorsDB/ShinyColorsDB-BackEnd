const mysql2 = require('mysql2');
const config = require('../config.json');

let conn;

function handleDisconnect() {
    conn = mysql2.createConnection(config);

    conn.connect((err) => {
        console.log("error connecting to db: ", err);
        setTimeout(handleDisconnect, 2000);
    });

    conn.on("error", (err) => {
        console.log("db error: ", err);
        if(err.code == 'PROTOCOL_UNEXPECTED_PACKET' || err.code == 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        }
        else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = conn;