import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// export const client = new MailtrapClient({
//   token: process.env.MAILTRAP_API_TOKEN!,
// });

// export const sender = {
//   email: "mailtrap@demomailtrap.com",
//   name: "Rishi MernStack",
// };
const TOKEN = process.env.MAILTRAP_API_TOKEN!;

export const client = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};

// export const recipients = [
//   {
//     email: "hereticgod1@gmail.com",
//   },
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
