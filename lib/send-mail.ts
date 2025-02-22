import nodemailer from "nodemailer";
import { UrlObject } from "url";

const transporter: nodemailer.Transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.GMAIL_EMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface ResetEMailParams {
  email: string;
  resetLink: string;
}

export async function sendPasswordResetEmail({ email, resetLink }: ResetEMailParams) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.GMAIL_EMAIL_ADDRESS,
    to: email,
    subject: `Reset your Auth Master password.`,

    html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>
    a#cnfLinkButton { display: inline-block; margin: 20px 0px; padding: 10px 20px; color: #ffffff; background-color: #007bff; border-radius: 3px;text-decoration: none; } a#cnfLinkButton:hover { background-color: #0056b3; }
    </style></head>
    <body>
    <p>Hi [User Name],</p>
    <p>We received a request to reset your password for your Auth Master account associated with ${email}. <br/>
    Click the link below to reset your password. This link will be remain active for 24 hours.</p>
    <a href="${resetLink}" id="cnfLinkButton">RESET PASSWORD BUTTON RESET</a> <br/>
    <p>If the button above doesn't work, you can click or just copy and paste the following link into your browser:</p>
    <a href="${resetLink}">${resetLink}</a> <br/><br/>
    <p>If you did not request a password reset or if you'd no longer like to create a new password, you can safely ignore this email.</br> Have question? You can reach out to us via support@bits_development.com</p>
    <p>Best regards,<br>
    The Auth Master Team</p>
    </body></html>
    `,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    return new Response(response, { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}

interface VerificationEmailParams {
  email: string;
  confirmationLink: string;
}

export async function sendVerificationEmail({ email, confirmationLink }: VerificationEmailParams) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.GMAIL_EMAIL_ADDRESS, // Sender mail address
    to: email, // List of receivers mail address
    subject: `Confirmation of registration | Auth Master`, // Subject line for mail

    // HTML body of the mail
    html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>
    a#cnfLinkButton { display: inline-block; margin: 10px 0px; padding: 10px 20px; color: #ffffff; background-color: #007bff; border-radius: 3px;text-decoration: none; } a#cnfLinkButton:hover { background-color: #0056b3; }
    </style></head>
    <body>
    <p>Hello [User Name],</p>
    <p>Welcome to Auth Master!</p>
    <p>We're thrilled to have you on board. To complete your registration and get started with Auth Master, please verify your email address by clicking the button below:</p>
    <a href="${confirmationLink}" id="cnfLinkButton">ACCOUNT VERIFICATION BUTTON</a> <br/>
    <p>If the button above doesn't work, you can click or just copy and paste the following link into your browser:</p> 
    <a href="${confirmationLink}" >${confirmationLink}</a>  <br/><br/>
    <p>If you did not create an account with Auth Master, please ignore this email.<br/>For any questions or assistance, feel free to contact our support team at <a href="mailto:support@bits_dev.com">support@bits_dev.com</a> or call us at +91-(620)-455-0159.</p>
    <p>Thank you for choosing Auth Master. We look forward to helping you achieve great things!</p>
    <p>Best regards,<br>
    The Auth Master Team</p>
    </body></html>
    `,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    return new Response(response, { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}

interface TwoFactorAuthEmailParams {
  email: string;
  twoFactorOtp: string;
}

export async function sendTwoFactorAuthenticationEmail({ email, twoFactorOtp }: TwoFactorAuthEmailParams) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.GMAIL_EMAIL_ADDRESS,
    to: email,
    subject: `Your One-Time Password (OTP) for 2FA | Auth Master`,
    html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>
      .token { display: block; font-size: 2.5em; font-weight: bold; letter-spacing: 10px}
    </style></head>
    <body>
    <p>Hello [User's Name],</p>
    <p>We are delighted to inform you that you have successfully initiated the setup for Two-Factor Authentication(2FA) on your account. <br/>To complete the setup and fortify your account's security, please enter the following authentication token in the designated field on our platform:</p>
    <div class="token">${twoFactorOtp}</div>
    <p>This token is valid only for 15 minutes. If you did not initiate this setup or believe this to be a mistake, please contact our support team immediately.</p>
    <p>To use this token:</p>
    <ol>
        <li>Open the 2FA setup page on our platform.</li>
        <li>Enter the above authentication token in the required field.</li>
        <li>Click on 'Verify' to complete the setup process.</li>
    </ol>
    <p>For any questions or assistance, feel free to contact our support team at <a href="mailto:support@bits_dev.com">support@bits_dev.com</a> or call us at +91-(620)-455-0159.</p>
    <p>Thank you for taking this extra step to secure your account.</p>
    <p>Best regards,<br>
    The Auth Master Team</p>
    </body></html>
    `,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    return new Response(response, { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
