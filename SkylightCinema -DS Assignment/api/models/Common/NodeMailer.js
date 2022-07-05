const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const sendReservationMail = async (strSendEMail, strReservationNo) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'hotelbluedragon@gmail.com',
        pass: 'mad@2019'
        }
    });

    const img = await new Promise(function (myRes, myRej) {
        QRCode.toDataURL(strReservationNo, function (err, url) {
            if(err) { return myRej(false) }
            else return myRes(url) 
        })
    });

    const mailOptions = {
        from: '"Cinema Skylight" <cinemaskylight@gmail.com>',
        to: `${strSendEMail}`,
        subject: 'Cinema Skylight - Order Successfully Placed!',
        text: `Your order has been successfully placed. ( Reservation Code: ${strReservationNo} )`,
        html: `
            <b>Welcome to Cinema Skylight!</b><br /><br /><br />
            <h5>Your order has been successfully placed. ( Reservation Code: ${strReservationNo} )</h5>
            <br /><br />
        `,
        attachments: [
            {   
                path: img
            }
        ]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Err: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendReservationMail;