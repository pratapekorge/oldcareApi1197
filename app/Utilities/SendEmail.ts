var nodemailer = require('nodemailer');
import config from "../config";

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",  // SMTP server for Office 365
    port: 587,                   // Port for TLS/STARTTLS
    auth: {
        user: config.smtp.email, // Your Microsoft email address
        pass: config.smtp.password,             // Your Microsoft email password or app password
    },
    secure: false,               // true for 465, false for other ports (587 recommended)
    tls: {
        ciphers: 'SSLv3'
    }
});



async function sendEmail(to: string, subject: string,  html: any) {
    try {
        let info = await transporter.sendMail({
            from: config.smtp.email, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            // text: text, // plain text body
             html: html
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}


export default sendEmail;
