require('dotenv').config()
const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if(err) return res.sendStatus(403)
        req.loggedUser = user
        next()
    })
}

const generateAccessToken = (user, expires) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: expires })
}

module.exports = { authenticateToken, generateAccessToken };