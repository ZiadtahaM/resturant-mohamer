// Nodemailer
import nodemailer from "nodemailer";
const sendEmail = async (options) => {
  //1) create tramnporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT), // if secure false port = 587, if true port =465
    secure: process.env.EMAIL_SECURE  ,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2) Define email options(like from ,to ,subject ,email conection )
  const mailOptions = {
    from: "Restaurant App <restaurant_app@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3) Send email
  await transporter.sendMail(mailOptions);
};

export { sendEmail };
