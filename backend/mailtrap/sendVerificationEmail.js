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

export const sendWelcomeEmail = async ({ email, name }) => {
  if (!email || !name) {
    console.warn('sendWelcomeEmail called with missing email or name:', { email, name });
    return;
  }
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "16319e81-2ea7-48c7-9d8f-e95f07a12b51",
      template_variables: {
        "name": name,
      },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error('Detailed email send error:', error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
}
