const express = require('express')
const router = express.Router()
const { test } = require('../db')
const sql = require("mssql")
const jwt = require('jsonwebtoken')

router.post('/', (req, res) => {
    const user = {...req.body}
    test().then(conn => conn
        .input('username', sql.VarChar(30), user.username)
        .input('password', sql.VarChar(100), user.password)
        .output('response', sql.VarChar(sql.MAX))
        .execute('dbo.loginUser')
        .then(response => {
            if(response.output.response == 'success') {
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN)
                res.send(accessToken)
            }
            else {
                res.send(response.output)
            }
        })
        .catch(err => console.log(err))
    )
})

module.exports = router;