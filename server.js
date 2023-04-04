const express = require('express')
const usersRouter = require('./router/users')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 4000


app.use(express.json())
app.use(cors())
app.use('/users', usersRouter)
app.listen(port, () => console.log(`started on http://localhost:${port}`))