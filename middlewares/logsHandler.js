const logEvents = require("../lib/logEvents");

const logsHandler = (req, res, next) => {
    logEvents(`${req.ip}\t\t${req.method}\t${req.headers.origin}\tstatus:${res.statusCode}\t${req.url}\t\t${req.get('User-Agent')}`, "reqLog")
    next()
}

module.exports = logsHandler;