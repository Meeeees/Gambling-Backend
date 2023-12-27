const express = require('express');
const database = require('./helpers/database.js');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || 8080, () => console.log('server running'))