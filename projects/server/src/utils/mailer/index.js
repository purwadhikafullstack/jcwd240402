const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: ({ recipient_email, link, subject, receiver, message }) => {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });

      const mail_configs = {
        from: process.env.MY_EMAIL,
        to: recipient_email,
        subject: `${subject}`,
        html: `
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>FORGOT PASSWORD</title>
</head>
<body>
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #02cc35;text-decoration:none;font-weight:600">Warehouse</a>
    </div>
    <p style="font-size:1.1em">Hi, ${receiver}</p>
    <p>${message}</p>
    <a href=${link} style="background: #02cc35;margin: 0 auto;width: max-content;padding: 5px 10px;color: #fff;border-radius: 4px;text-decoration:none;">verify your account</a>
    <p style="font-size:0.9em;">Regards,<br />WAREHOUSE</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Warehouse</p>
      <p>MSIG TOWER</p>
      <p>JC Web Development</p>
    </div>
  </div>
</div>
  
</body>
</html>`,
      };
      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          console.log(error);
          return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
      });
    });
  },
};
