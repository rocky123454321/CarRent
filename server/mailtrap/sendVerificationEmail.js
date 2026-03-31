import { Resend } from 'resend';
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE
} from './emailTemplates.js';

const resend = new Resend('re_RZZKwQtQ_2JV5dzX9k7jompgpJs3Qp64K'); // ✅ use env variable

const sender = 'onboarding@resend.dev';

// ✅ Send verification email
export const sendVerificationEmail = async ({ email, verificationToken }) => {
  try {
    const response = await resend.emails.send({
      from: sender,
      to: email,           // ✅ resend uses string, not array
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
    });
    console.log('Verification email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error(`Error sending verify email: ${error.message}`);
  }
};

// ✅ Send welcome email
export const sendWelcomeEmail = async ({ email, name }) => {
  try {
    const response = await resend.emails.send({
      from: sender,
      to: email,
      subject: 'Welcome!',
      html: WELCOME_EMAIL_TEMPLATE.replace('{name}' , name),
    });
    
    return response;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

// ✅ Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await resend.emails.send({
      from: sender,
      to: email,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
    });
    console.log('Password reset email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

// ✅ Send reset success email
export const sendResetSuccessEmail = async ({ email }) => {
  try {
    const response = await resend.emails.send({
      from: sender,
      to: email,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log('Reset success email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending reset success email:', error);
    throw new Error(`Error sending reset success email: ${error.message}`);
  }
};