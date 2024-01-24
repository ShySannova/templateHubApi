const emailjs = require('@emailjs/nodejs');
const { EmailJSResponseStatus } = require('@emailjs/nodejs')



const sendResetPasswordMail = async (body) => {
    const { user_name, user_email, admin_message, subject, from_name } = body;
    try {
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            { user_name, user_email, admin_message, subject, from_name },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY, // optional, highly recommended for security reasons
            },
        );
        return true
    } catch (err) {
        if (err instanceof EmailJSResponseStatus) {
            console.log('EMAILJS FAILED...', err);
            return false;
        }

        console.log('ERROR', err);
        return false
    }
}

module.exports = { sendResetPasswordMail }
