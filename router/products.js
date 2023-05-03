const express = require('express')
const router = express.Router()
const { app } = require('../db')
const { getBlobData } = require('../blob')
const { authenticateToken } = require('../authToken')
const sql = require("mssql")
const multer = require('multer')
const upload = multer()
const moment = require('moment')()
const { toSqlDate } = require('../time')

router.get('/categories', authenticateToken, (req, res) => {
    app().then(conn => conn
        .query(`
            SELECT
                id,
                name
            FROM app.categories
            ORDER BY name
        `)
        .then(response => res.send(response.recordset))
        .catch(err => console.log(err))
    )
})
router.get('/', authenticateToken, (req, res) => {
    app().then(conn => conn
        .query(`
            SELECT 
                p.productID id,
                p.name,
                p.description,
                p.quantity,
                p.price,
                p.weight,
                FORMAT (p.sellStartDate, 'dd/MM/yyyy') sell_start,
                FORMAT (p.sellEndDate, 'dd/MM/yyyy') sell_end,
                c.name category
            FROM app.products p
            INNER JOIN app.categories c ON p.category = c.id
            ORDER BY c.name, p.name
        `)
        .then(response => res.send(response.recordset))
        .catch(err => console.log(err))
    )
})
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params
    app().then(conn => conn
        .input('id', sql.UniqueIdentifier, id)
        .query(`
            SELECT
                p.productID id,
                p.name,
                p.description,
                p.quantity,
                p.price,
                p.weight,
                FORMAT (p.sellStartDate, 'dd/MM/yyyy') sell_start,
                FORMAT (p.sellEndDate, 'dd/MM/yyyy') sell_end,
                c.name category
            FROM app.products p
            INNER JOIN app.categories c ON p.category = c.id
            WHERE p.productID = @id
        `)
        .then(response => res.send(response.recordset[0]))
        .catch(err => console.log(err))
    )
})
router.post('/', authenticateToken, (req, res) => {
    const product = { ...req.body }
    app().then(conn => conn
        .input('executor', sql.UniqueIdentifier, req.loggedUser.uuid)
        .input('name', sql.NVarChar(100), product.name)
        .input('description', sql.NVarChar(400), product.description)
        .input('quantity', sql.SmallInt, product.quantity)
        .input('price', sql.Money, product.price)
        .input('weight', sql.Decimal(8,2), product.weight)
        .input('sellStartDate', sql.DateTime, (product.sellStartDate) ? product.sellStartDate : moment.format('YYYY-MM-DD HH:mm:ss'))
        .input('category', sql.Int, product.category)
        .output('status', sql.VarChar(sql.MAX))
        .execute('dbo.insertProduct')
        .then(response => res.send(response.output))
        .catch(err => console.log(err))
    )
})
router.patch('/:id', authenticateToken, (req, res) => {
    const product = { ...req.body }
    const { id } = req.params
    app().then(conn => conn
        .input('id', sql.UniqueIdentifier, id)
        .input('executor', sql.UniqueIdentifier, req.loggedUser.uuid)
        .input('name', sql.NVarChar(100), product.name)
        .input('description', sql.NVarChar(400), product.description)
        .input('quantity', sql.SmallInt, product.quantity)
        .input('price', sql.Money, product.price)
        .input('weight', sql.Decimal(8,2), product.weight)
        .input('sellEndDate', sql.DateTime, (product.sell_end) ? toSqlDate(product.sell_end) : sql.NULL)
        .input('category', sql.NVarChar(100), product.category)
        .output('status', sql.VarChar(sql.MAX))
        .execute('dbo.alterProduct')
        .then(response => res.send(response.output))
        .catch(err => console.log(err))
    )
})
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params
    app().then(conn => conn
        .input('id', sql.UniqueIdentifier, id)
        .input('executor', sql.UniqueIdentifier, req.loggedUser.uuid)
        .output('status', sql.VarChar(sql.MAX))
        .execute('dbo.deleteProduct')
        .then(response => res.send(response.output))
        .catch(err => console.log(err))
    )
})
router.put('/:id/picture', authenticateToken, upload.fields([{ name: "picture", maxCount: 1 }]), (req, res) => {
    const { id } = req.params
    if (req.files && req.files.picture && req.files.picture.length) {
        const picture = req.files.picture[0];
        app().then(conn => conn
            .input('id', sql.UniqueIdentifier, id)
            .input('filename', sql.NVarChar(100), picture.filename)
            .input('picture', sql.VarBinary(sql.MAX), picture.buffer)
            .query(`
                INSERT INTO app.pictures (productID, fileneme, picture)
                VALUES (@id, @filename, @picture)
            `)
            .then(data => res.send({ response: data }))
            .catch(err => console.log(err))
        )
    }
    else res.send({ response: 'noFile' })
})
router.delete('/:id/picture/:pic', authenticateToken, (req, res) => {
    const { id, pic } = req.params
    app().then(conn => conn
        .input('id', sql.UniqueIdentifier, id)
        .input('pic', sql.Int, pic)
        .query(`
            DELETE FROM app.pictures
            WHERE productID = @id AND id = @pic
        `)
        .then(data => res.send({ response: data }))
        .catch(err => console.log(err))
    )
})
router.delete('/:id/picture', authenticateToken, (req, res) => {
    const { id } = req.params
    app().then(conn => conn
        .input('id', sql.UniqueIdentifier, id)
        .query(`
            DELETE FROM app.pictures
            WHERE productID = @id
        `)
        .then(data => res.send({ response: data }))
        .catch(err => console.log(err))
    )
})
module.exports = router;