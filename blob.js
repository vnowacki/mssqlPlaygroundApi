const getBlobData = (file) => {
    return `data:image/jpeg;base64,${Buffer.from(file).toString('base64')}`
}

module.exports = { getBlobData }