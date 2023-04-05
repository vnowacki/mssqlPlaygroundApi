const sql = require("mssql")

const config = {
    user: 'sa',
    password: 'Pa55w.rd',
    server: 'localhost',
    database: 'test',
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }
}

const connection = async () => {
    return sql.connect(config).then(pool => {      
        return pool.request()
    })
}

module.exports = connection