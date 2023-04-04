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

const makeStandardRequest = async (query) => {
    return sql.connect(config).then(pool => {      
        return pool.request().query(query)
    })
}

const runProcedure = async (procedureName, input, output) => {
    return sql.connect(config).then(pool => {
        return pool.request()
            .input('input_parameter', input.type, input.value)
            .output('output_parameter', output.type)
            .execute(procedureName)
    })
}

module.exports = { makeStandardRequest, runProcedure }