const makeRequest = require('./db')

const router = (app) => {
    app.route('/users')
        .get((req, res) => {
            makeRequest(`SELECT * FROM users`)
                .then(response => res.send(response))
        })
    app.route('/users/:id')
        .get((req, res) => {
            const { id } = req.params
            makeRequest(`SELECT * FROM users WHERE id = ${id}`)
                .then(response => res.send(response))
        })
    /*
    app.route('/test/:id')
        .get((req, res) => {
            const { id } = req.params
            const { something } = req.body

            if(!something)
                res.status(418).send({ message: 'no data received from app' })

            res.send( { json: 'some json response' })
        })
        .post((res, req) => {
            //post request on test/:id endpoint
        })
    */
}

module.exports = router