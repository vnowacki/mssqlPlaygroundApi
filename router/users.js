const express = require('express')
const router = express.Router()
const { app } = require('../db')
const { authenticateToken } = require('../authToken')
const sql = require("mssql")

router.get('/', authenticateToken, (req, res) => {
    app().then(conn => conn
        .query(`
            SELECT 
                id,
                name,
                surname, 
                username,
                ISNULL(FORMAT (last_logged, 'dd/MM/yyyy'), 'brak') as date_logged,
                FORMAT (account_created, 'dd/MM/yyyy') as date_created
            FROM app.users
        `)
        .then(response => {res.send(response.recordset)})
        .catch(err => console.log(err))
    )
})
router.get('/info', authenticateToken, (req, res) => {
    app().then(conn => conn
        .input('id', sql.UniqueIdentifier, req.loggedUser.uuid)
        .query(`
            SELECT 
                id,
                name,
                surname,
                ISNULL(FORMAT (last_logged, 'dd/MM/yyyy'), 'brak') as date_logged
            FROM app.user_data
            WHERE id = @id
        `)
        .then(response => res.send(response.recordset[0]))
        .catch(err => console.log(err))
    )
})
router.post('/', authenticateToken, (req, res) => {
    const user = { ...req.body }
    app().then(conn => conn
        .input('executor', sql.UniqueIdentifier, req.loggedUser.uuid)
        .input('username', sql.VarChar(30), user.username)
        .input('password', sql.VarChar(100), user.password)
        .input('name', sql.NVarChar(30), user.name)
        .input('surname', sql.NVarChar(30), user.surname)
        .input('lastLogged', sql.DateTime, user.lastLogged)
        .output('response', sql.VarChar(sql.MAX))
        .execute('dbo.insertUser')
        .then(response => res.send(response.output))
        .catch(err => console.log(err))
    )
})
router.patch('/:id', authenticateToken, (req, res) => {
    const { id } = req.params
    const user = {...req.body}
    app().then(conn => conn
        .input('id', sql.UniqueIdentifier, id)
        .input('executor', sql.UniqueIdentifier, req.loggedUser.uuid)
        .input('username', sql.VarChar(30), user.username)
        .input('password', sql.VarChar(100), user.password)
        .input('name', sql.NVarChar(30), user.name)
        .input('surname', sql.NVarChar(30), user.surname)
        .output('response', sql.VarChar(sql.MAX))
        .execute('dbo.alterUser')
        .then(response => res.send(response.output))
        .catch(err => console.log(err))
    )
})
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params
    if(id !== req.loggedUser.uuid)
        app().then(conn => conn
            .input('id', sql.UniqueIdentifier, id)
            .input('executor', sql.UniqueIdentifier, req.loggedUser.uuid)
            .output('response', sql.VarChar(sql.MAX))
            .execute('dbo.deleteUser')
            .then(response => res.send(response.output))
            .catch(err => console.log(err))
        )
    else res.send({ response: 'loggedUserDeletion' })
})

module.exports = router;