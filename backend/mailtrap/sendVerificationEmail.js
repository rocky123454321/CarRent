import { mailtrapClient, sender } from "./mailtrap.js";
import {PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,} from './emailTemplates.js'


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
export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};