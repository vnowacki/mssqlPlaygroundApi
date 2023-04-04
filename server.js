const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const usersRouter = require('./router/users')

app.use(express.json())
app.use('/users', usersRouter)
app.listen(port, () => console.log(`started on http://localhost:${port}`))