const express = require('express')
const router = express.Router()
const { makeStandardRequest } = require('../db')

router.get('/', (req, res) => {
    makeStandardRequest(`SELECT * FROM app.users`)
        .then(response => {res.send(response.recordset)})
        .catch(err => console.log(err))
})
router.get('/:id', (req, res) => {
    const { id } = req.params
    makeStandardRequest(`SELECT * FROM app.users WHERE id = ${id}`)
        .then(response => res.send(response.recordset))
        .catch(err => console.log(err))
})

module.exports = router;