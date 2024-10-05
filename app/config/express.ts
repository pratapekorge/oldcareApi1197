import express from "express";
import * as bodyParser from 'body-parser';
const morgan = require('morgan');
import cors from 'cors';
import Authenticate from "../Middlewares/Authenticate";
import joiErrorHandler from "../Middlewares/joiErrorHandler";

import indexRoutes from '../Routes/index'
import application from "../Constants/application";

const app = express()
app.options('*', cors()) // include before other routes
app.use(function(req, res, next) {
    console.log("in request")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token_access, user_id, User-agent");
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

//  require('dotenv').config();
app.use(bodyParser.json());
 app.use(Authenticate)

app.use(morgan('dev'))
console.log("application.url.base", application.url.base)
app.use(application.url.base, indexRoutes)
app.use(joiErrorHandler)

export default app


























