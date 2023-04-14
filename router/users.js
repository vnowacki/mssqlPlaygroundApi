const express = require('express')
const router = express.Router()
const { test } = require('../db')
const { authenticateToken } = require('../authToken')
const sql = require("mssql")

router.get('/', authenticateToken, (req, res) => {
    test().then(conn => conn
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
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params
    test().then(conn => conn
        .input('id', sql.UniqueIdentifier, id)
        .query(`
            SELECT 
                name,
                surname, 
                username,
                ISNULL(FORMAT (last_logged, 'dd/MM/yyyy'), 'brak') as date_logged,
                FORMAT (account_created, 'dd/MM/yyyy') as date_created
            FROM app.users
            WHERE id = @id
        `)
        .then(response => res.send(response.recordset))
        .catch(err => console.log(err))
    )
})
router.post('/', authenticateToken, (req, res) => {
    const user = {...req.body}
    test().then(conn => conn
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
    test().then(conn => conn
        .input('id', sql.UniqueIdentifier, id)
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
    const user = req.user
    if(id !== user.uuid)
        test().then(conn => conn
            .input('id', sql.UniqueIdentifier, id)
            .query(`DELETE FROM app.users WHERE id = @id`)
            .then(response => res.send({ deleted: parseInt(response.rowsAffected[0]) }))
            .catch(err => console.log(err))
        )
    else res.send({ error: 'loggedUserDeletion' })
})

module.exports = router;