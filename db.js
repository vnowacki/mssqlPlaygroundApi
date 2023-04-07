const sql = require("mssql")

const options = {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true
}

const config = {
    test: {
        server: 'localhost',
        user: 'sa',
        password: 'Pa55w.rd',
        database: 'test',
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

const test = async () => {
    return sql.connect(config.test).then(pool => {      
        return pool.request()
    })
}

const advWorks = async () => {
    return sql.connect(config.advWorks).then(pool => {      
        return pool.request()
    })
}

module.exports = { test, advWorks }