import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { to, subject, html } = req.body;

    try {
      // Create a transporter using your email provider's SMTP service
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',  // e.g., 'smtp.gmail.com'
        port: 587,  // SMTP port
        secure: false, // Use TLS
        auth: {
          user: process.env.EMAIL_USERNAME,  // Your email address
          pass: process.env.EMAIL_PASSWORD,  // Your email password or app-specific password
        },
      });

      // Define email options
      const mailOptions = {
        from: '"Big Sam Dev" <conqueststat@gmail.com>', // Sender address
        to, // Receiver address
        subject, // Email subject
        html, // Email content (HTML format)
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);

      // Respond to the request
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
