const express = require('express')
const router = express.Router()
const { app } = require('../db')
const { getBlobData } = require('../blob')
const { authenticateToken } = require('../authToken')
const sql = require("mssql")
const multer = require('multer')
const upload = multer()

router.get('/', authenticateToken, (req, res) => {
    app().then(conn => conn
        .query(`
            SELECT 
                u.id,
                u.name,
                u.surname, 
                u.username,
                u.picture,
                ISNULL(FORMAT (u.last_logged, 'dd/MM/yyyy hh:mm:ss'), 'nigdy') date_logged,
                FORMAT (u.account_created, 'dd/MM/yyyy') date_created,
                IIF(l.level = 'admin', 1, 0) admin
            FROM app.users u
            INNER JOIN app.perms p ON u.id = p.user_id
            INNER JOIN app.levels l ON p.level_id = l.id
        `)
        .then(response => {
            response.recordset.forEach(record => {
                if(record.picture) record.picture = getBlobData(record.picture)
            })
            res.send(response.recordset)
        })
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
                picture,
                ISNULL(FORMAT (last_logged, 'dd.MM.yyyy hh:mm:ss'), 'brak') date_logged
            FROM app.user_data
            WHERE id = @id
        `)
        .then(response => {
            const data = response.recordset[0]
            if(data.picture) data.picture = getBlobData(data.picture)
            res.send(data)
        })
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
        .input('permLevel', sql.VarChar(10), user.permLevel)
        .output('status', sql.VarChar(sql.MAX))
        .output('uuid', sql.UniqueIdentifier)
        .execute('dbo.insertUser')
        .then(response => res.send(response.output))
        .catch(err => console.log(err))
    )
})
router.patch('/:id', authenticateToken, (req, res) => {
    const { id } = req.params
    const user = {...req.body}
    if(id !== req.loggedUser.uuid)
        app().then(conn => conn
            .input('id', sql.UniqueIdentifier, id)
            .input('executor', sql.UniqueIdentifier, req.loggedUser.uuid)
            .input('username', sql.VarChar(30), user.username)
            .input('password', sql.VarChar(100), user.password)
            .input('name', sql.NVarChar(30), user.name)
            .input('surname', sql.NVarChar(30), user.surname)
            .input('permLevel', sql.VarChar(10), user.permLevel)
            .output('status', sql.VarChar(sql.MAX))
            .execute('dbo.alterUser')
            .then(response => res.send(response.output))
            .catch(err => console.log(err))
        )
    else res.send({ response: 'loggedUserPermRevoke' })
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
router.put('/:id/picture', authenticateToken, upload.fields([{ name: "picture", maxCount: 1 }]), (req, res) => {
    const { id } = req.params
    if (req.files && req.files.picture && req.files.picture.length) {
        const picture = req.files.picture[0];
        app().then(conn => conn
            .input('id', sql.UniqueIdentifier, id)
            .input('picture', sql.VarBinary(sql.MAX), picture.buffer)
            .query(`
                UPDATE app.users
                SET picture = @picture
                WHERE id = @id
            `)
            .then(data => res.send({ response: data }))
            .catch(err => console.log(err))
        )
    }
    else res.send({ response: 'noFile' })
})
router.delete('/:id/picture', authenticateToken, (req, res) => {
    const { id } = req.params
    app().then(conn => conn
        .input('id', sql.UniqueIdentifier, id)
        .query(`
            UPDATE app.users
            SET picture = NULL
            WHERE id = @id
        `)
        .then(data => res.send({ response: data }))
        .catch(err => console.log(err))
    )
})
module.exports = router;