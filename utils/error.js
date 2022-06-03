const err = (message, code) => {
    let e = new Error(message)

    if (code) {
        e.statusCode = code
    }
    //ddsaf
    return e
}

module.exports = err