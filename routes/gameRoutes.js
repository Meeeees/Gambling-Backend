const express = require('express')
const router = express.Router()
const game = require('../helpers/game')
router.post('/dice', async (req, res) => {
    let data = await game.diceRoll(req.body)
    res.status(data.status).send(data.load)
})

module.exports = router