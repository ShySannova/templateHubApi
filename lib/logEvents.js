const { format } = require("date-fns");
const crypto = require('crypto');
const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path")


const logEvents = async (message, logName) => {
    const id = crypto.randomUUID()
    const date = `${format(new Date(), "dd-MM-yyyy")}`
    const dateTime = `${format(new Date(), "dd-MM-yyyy\tHH:mm:ss")}`
    const logItem = `${dateTime}\t${id}\t${message}\n`
    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromise.mkdir(path.join(__dirname, "..", "logs"))
        }
        await fsPromise.appendFile(path.join(__dirname, "..", "logs", `${logName}-${date}.txt`), logItem)
    } catch (error) {
        console.error(err.message)
    }
}


module.exports = logEvents;