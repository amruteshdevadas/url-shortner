
require('dotenv').config()

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// These id's and secrets should come from .env file.
const CLIENT_ID = `${process.env.CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.CLIENT_SECRET}`;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = `${process.env.REFRESH_TOKEN}`;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN});

const sendEmail = async (email, subject, text) => {
try {
  const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: `${process.env.HOST}`,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN ,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `${process.env.HOST}`,
      to: email,
      subject: subject,
      text: text,
    };

    transport.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error.message);
          } else {
            console.log('Email sent: ' + info.response);
          }
        })

      } catch (error) {
        console.log(error)
        
      }
   
}
module.exports = sendEmail;
