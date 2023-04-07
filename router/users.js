const express = require('express')
const router = express.Router()
const { test } = require('../db')
const sql = require("mssql")

router.get('/', (req, res) => {
    test().then(conn => conn
        .query(`
            SELECT 
                name,
                surname, 
                FORMAT (account_created, 'dd/MM/yyyy') as date_created
            FROM app.users
        `)
        .then(response => {res.send(response.recordset)})
        .catch(err => console.log(err))
    )
})
router.get('/:id', (req, res) => {
    const { id } = req.params
    if(!isNaN(id))
        test().then(conn => conn
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    name,
                    surname, 
                    FORMAT (account_created, 'dd/MM/yyyy') as date_created
                FROM app.users
                WHERE id = @id
            `)
            .then(response => res.send(response.recordset))
            .catch(err => console.log(err))
        )
})
router.post('/', (req, res) => {
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
router.patch('/:id', (req, res) => {
    const { id } = req.params
    const user = {...req.body}
    test().then(conn => conn
        .input('id', sql.Int, id)
        .input('username', sql.VarChar(30), user.username)
        .input('password', sql.VarChar(100), user.password)
        .input('name', sql.NVarChar(30), user.name)
        .input('surname', sql.NVarChar(30), user.surname)
        .input('lastLogged', sql.DateTime, user.lastLogged)
        .output('response', sql.VarChar(sql.MAX))
        .execute('dbo.alterUser')
        .then(response => res.send(response.output))
        .catch(err => console.log(err))
    )
})
router.delete('/:id', (req, res) => {
    const { id } = req.params
    if(!isNaN(id))
        test().then(conn => conn
            .input('id', sql.Int, id)
            .query(`DELETE FROM app.users WHERE id = @id`)
            .then(response => res.send(response.rowsAffected))
            .catch(err => console.log(err))
        )
})

module.exports = router;