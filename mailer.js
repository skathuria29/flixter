
const nodemailer = require('nodemailer');
// const xoauth2 = require('xoauth2');
const { USERNAME , PASSWORD} = require('./config/settings');

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: USERNAME,
        pass: PASSWORD
    }
})

module.exports = function sendEmail(to, subject, message) {
    const mailOptions = {
        from: USERNAME,
        to,
        subject,
        html: message,
    };
    transport.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
};