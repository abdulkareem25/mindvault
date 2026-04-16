import nodeMailer from 'nodemailer';

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email service:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});


export const sendEmail = async (to, subject, html) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};
