/**
 * Created by Labtec on 25.06.2017.
 */
import express from 'express';
import path from 'path';
import cls from 'cli-color';
import { createServer } from 'http';

const config = require('../config');

const app = express();
const server = createServer(app);

app.use(express.static(path.join(__dirname, '../dist')));

server.listen('8080', function () {
    console.info(cls.green('======================================================================='));
    console.info(cls.cyan(`Express server listening on port 8080, in ${config.env} mode.`));
    console.info(cls.cyan(`Open up `) + cls.white(`http://localhost:8080/`) + cls.cyan(' in your browser.'));
    console.info(cls.green('======================================================================='));
});
