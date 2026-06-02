const nodemailer = require('nodemailer');

const sendEmail = async ({to, subject, html}) => {
    //1. create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.password
        }
    })
    //2.send email using transporter
    try {
        const email = await transporter.sendMail({
            from: 'M store ',
            to,
            subject,
            html
        });

        console.log('email sent ', email.messageId)
    } catch (error) {
        console.log("failed to send email ",error.message);
    }

};
module.exports={sendEmail};