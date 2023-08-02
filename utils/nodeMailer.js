const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: `sandbox.smtp.mailtrap.io`,
      service: `Gmail`,
      port: `587`,
      secure: true,
      auth: {
        user: "jobmatchv01@gmail.com",
        pass: process.env.PASS,
      },
    });
    // console.log(tr);
    const data = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("email sent successfully");
  } catch (error) {
    console.log("emailnot sented");
    console.log(error);
  }
};
