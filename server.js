
const express = require("express");
const bodyParser = require('body-parser');
const mongo = require("mongojs");
const cors = require('cors');
const db = require('./config/database').url;
const app = express();
const auth=require('./config/auth')
const mongoose = require('mongoose');
const api = require('./routes/api/routes')
const port = 3300

mongoose.Promise=global.Promise;
mongoose.connect(db,{ useNewUrlParser: true })

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(auth.init());
app.use('/api', api)

app.listen(port, () => console.log('server started at port no-' + port))



