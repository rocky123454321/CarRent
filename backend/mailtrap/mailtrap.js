
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv"

dotenv.config()


// Validate env vars early
if (!process.env.MAIL_TRAP_TOKEN) {
  console.warn('⚠️  MAIL_TRAP_TOKEN missing in .env - emails will fail!');
}
if (!process.env.MAIL_TRAP_ENDPOINT) {
  console.warn('⚠️  MAIL_TRAP_ENDPOINT missing in .env - emails will fail!');
}

export const mailtrapClient = new MailtrapClient({ 
  token: process.env.MAIL_TRAP_TOKEN, 
  endpoint: process.env.MAIL_TRAP_ENDPOINT 
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Supernova",
};


