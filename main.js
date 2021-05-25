const express = require('express');;
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.get("/spine/:Idol/:Dress/:Type", (req, res, next) => {

})