// server/mailtest.ts
import dotenv from "dotenv";
import { client, sender, recipients } from "./mailtrap/mailtrap.ts";

dotenv.config();

(async () => {
  try {
    const res = await client.send({
      from: sender,
      to: recipients, // your real email to receive test
      subject: "Test Email",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mailtrap Test</title>
  <style>
    body {
      font-family: 'Comic Sans MS', cursive, sans-serif;
      background-color: #fdf6e3;
      color: #333;
      text-align: center;
      padding: 50px;
    }
    h1 {
      color: #ff4500;
      animation: wobble 1s infinite alternate;
    }
    p {
      font-size: 18px;
      margin-top: 20px;
    }
    @keyframes wobble {
      0% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
      100% { transform: rotate(-5deg); }
    }
    .emoji {
      font-size: 50px;
    }
  </style>
</head>
<body>
  <h1>Hello from Mailtrap! 📬</h1>
  <p>We promise this email isn’t spam… maybe just a little bit 😎</p>
  <div class="emoji">🎉🚀🍕</div>
</body>
</html>
`,
    });
    console.log("Email sent:", res);
  } catch (err) {
    console.error("Error sending test email:", err);
  }
})();
