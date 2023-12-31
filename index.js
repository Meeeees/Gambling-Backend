const express = require('express');
require('dotenv').config();
const cors = require('cors');
const AuthRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/auth', AuthRoutes)
app.use('/games', gameRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(process.env.PORT || 8080, () => console.log('server running'))