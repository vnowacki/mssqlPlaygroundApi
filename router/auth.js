const express = require('express')
const router = express.Router()
const { app } = require('../db')
const { generateAccessToken } = require('../authToken')
const sql = require("mssql")
const jwt = require('jsonwebtoken')

const TOKEN_EXPIRY = '10m'
let refreshTokens = []

router.post('/', (req, res) => {
    const user = {...req.body}
    app().then(conn => conn
        .input('username', sql.VarChar(30), user.username)
        .input('password', sql.VarChar(100), user.password)
        .output('status', sql.VarChar(sql.MAX))
        .output('uuid', sql.UniqueIdentifier)
        .execute('dbo.loginUser')
        .then(response => {
            if(response.output.status == 'loginSuccessfull') {
                user.uuid = response.output.uuid
                const accessToken = generateAccessToken(user, TOKEN_EXPIRY)
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
                refreshTokens.push(refreshToken)
                res.send({ status: response.output.status, accessToken: accessToken, refreshToken: refreshToken })
            }
            else {
                res.send(response.output)
            }
        })
        .catch(err => console.log(err))
    )
})
router.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if(!refreshToken) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if(err) return res.sendStatus(403)
        delete user.iat
        const accessToken = generateAccessToken(user, TOKEN_EXPIRY)
        res.send({ accessToken: accessToken })
    })
})
router.delete('/', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

module.exports = router;