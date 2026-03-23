
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv"

dotenv.config()


export const mailtrapClient = new MailtrapClient({ token: process.env.MAIL_TRAP_TOKEN, endpoint: process.env.MAIL_TRAP_ENDPOINT });

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Ducusin",
};

