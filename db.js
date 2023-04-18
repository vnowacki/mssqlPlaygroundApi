const sql = require("mssql")

const options = {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true
}

const config = {
    app: {
        server: 'localhost',
        user: 'sa',
        password: 'Pa55w.rd',
        database: 'app',
        options: options
    },
    advWorks: {
        server: 'localhost',
        user: 'sa',
        password: 'Pa55w.rd',
        database: 'AdventureWorks',
        options: options
    }
}

const app = async () => {
    return sql.connect(config.app).then(pool => {      
        return pool.request()
    })
}

const advWorks = async () => {
    return sql.connect(config.advWorks).then(pool => {      
        return pool.request()
    })
}

module.exports = { app, advWorks }