const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const contactUsEmail = (email, subject, text) => {
    sgMail.send({
        to: 'ingeniums@esi-sba.dz',
        from: email,
        subject,
        text
    })
}

module.exports = contactUsEmail