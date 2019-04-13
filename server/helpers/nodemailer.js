const nodemailer = require('nodemailer')

module.exports = {
    Mailer: (email, message) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Week information`,
            text: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}