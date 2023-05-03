const toSqlDate = (date) => {
    date = date.split('/')
    return `${date[2]}-${date[1]}-${date[0]}`
}

module.exports = { toSqlDate }