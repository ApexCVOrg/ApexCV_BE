import nodemailer from 'nodemailer';

const GMAIL_USER = 'apexcvorg@gmail.com';
const GMAIL_PASS = 'ajnw xlgp weul ekew';

// Enhanced debug logs
console.log('Gmail credentials check:');
console.log('GMAIL_USER:', GMAIL_USER);
console.log('GMAIL_PASS:', GMAIL_PASS ? 'SET (length: ' + GMAIL_PASS.length + ')' : 'NOT SET');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// Verify transporter configuration with better error handling
const verifyTransporter = async (): Promise<boolean> => {
  try {
    const verification = await transporter.verify();
    console.log('✅ SMTP Server is ready to take our messages');
    return verification;
  } catch (error) {
    console.error('❌ SMTP Configuration Error:', error);
    
    // Provide specific troubleshooting guidance
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        console.error('🔧 Troubleshooting: Check if you\'re using an App Password instead of your regular Gmail password');
      } else if (error.message.includes('Missing credentials')) {
        console.error('🔧 Troubleshooting: Verify Gmail credentials are set correctly');
      }
    }
    
    throw error;
  }
};

// Initialize verification
verifyTransporter().catch(console.error);

export const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  try {
    // Validate inputs
    if (!email || !code) {
      throw new Error('Email and verification code are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const mailOptions = {
      from: `"ApexCV" <${GMAIL_USER}>`,
      to: email,
      subject: 'ApexCV - Email Verification Code',
      text: `Your ApexCV verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">ApexCV</h1>
            <p style="color: #64748b; margin: 5px 0;">Professional CV Builder</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <h2 style="color: white; margin: 0 0 15px 0;">Email Verification</h2>
            <p style="color: #e2e8f0; margin: 0;">Enter this code to verify your email address:</p>
          </div>
          
          <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #1e293b; letter-spacing: 4px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-weight: 500;">⏰ This code will expire in 10 minutes</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              If you didn't request this verification code, please ignore this email.
            </p>
            <p style="color: #64748b; font-size: 12px; margin: 10px 0 0 0;">
              © 2025 ApexCV. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    console.log(`📧 Attempting to send verification email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📊 Response:', info.response);
    
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    
    // Provide specific error context
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        console.error('🔧 Hint: Make sure you\'re using a Gmail App Password, not your regular password');
      } else if (error.message.includes('Authentication failed')) {
        console.error('🔧 Hint: Check your Gmail credentials and ensure 2FA is enabled with App Password');
      }
    }
    
    throw new Error(`Email delivery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};