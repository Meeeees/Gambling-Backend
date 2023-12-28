// Authentication routes
const express = require('express');
const router = express.Router();
const Authentication = require('../helpers/authentication');

router.post('/signup', (req, res) => {
    Authentication.createUser(req.body.username, req.body.email, req.body.password).then((result) => {
        if (result.status == 409) {
            res.status(409).send(result)
        } else if (!result.success) {
            res.status(500).send(result)
        } else {
            res.send(result)
        }
    })
})

router.post('/signin', (req, res) => {
    Authentication.AuthenticateUser(req.body.email, req.body.password).then((result) => {
        console.log(result)
        if (result.status === 200) {
            res.status(200).send({ 'token': result.token })
        } else {
            res.status(result.status).send(result)
        }
    })
})

router.post('/verify', async (req, res) => {
    let data = await Authentication.ValidateToken(req.body.token)
    console.log(data)
    res.send(data)
})

module.exports = router