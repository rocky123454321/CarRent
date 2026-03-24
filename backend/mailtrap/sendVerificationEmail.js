import { mailtrapClient, sender } from "./mailtrap.js";
import {VERIFICATION_EMAIL_TEMPLATE} from './emailTemplates.js'

export const sendVerificationEmail = async ({ email, verificationToken }) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    return response;
  } catch (error) {
    console.error('Detailed email send error:', error);
    throw new Error(`Error sending verify email: ${error.message}`);
  }
};

