const logEvents = require("../lib/logEvents")

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, "errLog")
    res.status(500).json({ message: err.message })
}

module.exports = errorHandler;