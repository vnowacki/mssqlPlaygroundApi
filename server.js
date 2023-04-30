const express = require('express')
const authRouter = require('./router/auth')
const usersRouter = require('./router/users')
const productsRouter = require('./router/products')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.listen(port, () => console.log(`started on http://localhost:${port}`))