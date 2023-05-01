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
                o.id,
                o.quantity,
                FORMAT (o.orderDate, 'dd/MM/yyyy') order_date,
                o.status,
                p.name,
                p.price,
                u.name,
                u.surname,
                (o.quantity * p.price) order_value
            FROM app.orders o
            INNER JOIN app.products p ON p.productID = o.productID
            INNER JOIN app.users u ON u.id = o.userID
            ORDER BY o.orderDate DESC
        `)
        .then(response => res.send(response.recordset))
        .catch(err => console.log(err))
    )
})
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params
    app().then(conn => conn
        .input('id', sql.Int, id)
        .query(`
            SELECT
                o.quantity,
                FORMAT (o.orderDate, 'dd/MM/yyyy') order_date,
                o.status,
                p.name,
                p.price,
                u.name,
                u.surname,
                (o.quantity * p.price) order_value
            FROM app.orders o
            INNER JOIN app.products p ON p.productID = o.productID
            INNER JOIN app.users u ON u.id = o.userID
            WHERE id = @id
        `)
        .then(response => res.send(response.recordset[0]))
        .catch(err => console.log(err))
    )
})
router.put('/', authenticateToken, (req, res) => {
    const order = { ...req.body }
    app().then(conn => conn
        .input('productID', sql.UniqueIdentifier, order.productID)
        .input('userID', sql.UniqueIdentifier, order.userID)
        .input('quantity', sql.SmallInt, order.quantity)
        .output('response', sql.VarChar(sql.MAX))
        .execute('dbo.insertOrder')
        .then(response => res.send(response.output))
        .catch(err => console.log(err))
    )
})
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params
    app().then(conn => conn
        .input('id', sql.Int, id)
        .input('executor', sql.UniqueIdentifier, req.loggedUser.uuid)
        .output('response', sql.VarChar(sql.MAX))
        .execute('dbo.deleteOrder')
        .then(response => res.send(response.output))
        .catch(err => console.log(err))
    )
})
router.patch('/:id/status', authenticateToken, (req, res) => {
    const { id } = req.params
    const order = { ...req.body }
    app().then(conn => conn
        .input('id', sql.Int, id)
        .input('status', sql.VarChar(10), order.status)
        .query(`
            UPDATE app.orders
            SET status = @status
            WHERE id = @id
        `)
        .then(data => res.send({ response: data }))
        .catch(err => console.log(err))
    )
})
module.exports = router;