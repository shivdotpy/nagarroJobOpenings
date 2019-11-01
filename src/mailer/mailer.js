const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nagarroreferral@gmail.com",
    pass: "Hello@123"
  }
});

module.exports.mail = (to, message, subject = `Your referal status`) => {
  const mailOptions = {
    from: "nagarroreferral@gmail.com",
    to: to,
    subject: subject,
    html: message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
