const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

const generateVerificationCode = (length = 6) => {
    const characters = '0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
};




module.exports = { isObjectEmpty, generateVerificationCode }