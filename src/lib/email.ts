import nodemailer from 'nodemailer'
import { env } from './env'

export const emailTransporter = nodemailer.createTransport({
  host: env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendVerificationRequest({
  identifier: email,
  url,
  provider,
}: {
  identifier: string
  url: string
  provider: any
}): Promise<void> {
  const { host } = new URL(url)
  
  await emailTransporter.sendMail({
    to: email,
    from: env.EMAIL_FROM || 'noreply@parentwise.com',
    subject: `Sign in to ParentWise`,
    text: `Sign in to ParentWise\n\nClick here to sign in: ${url}\n\nIf you did not request this email, you can safely ignore it.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ParentWise</h1>
          <p style="color: white; margin: 10px 0 0 0;">AI-Powered Parenting Platform</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Sign in to your account</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Click the button below to sign in to your ParentWise account. This link will expire in 24 hours.
          </p>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${url}" style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              display: inline-block;
              font-size: 16px;
            ">Sign in to ParentWise</a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.5;">
            If you did not request this email, you can safely ignore it. This sign-in link was requested from <strong>${host}</strong>.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} ParentWise. All rights reserved.
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  return emailTransporter.sendMail({
    to: email,
    from: env.EMAIL_FROM || 'noreply@parentwise.com',
    subject: 'Welcome to ParentWise! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to ParentWise!</h1>
          <p style="color: white; margin: 10px 0 0 0;">Your AI-Powered Parenting Journey Begins</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Hi ${name || 'there'}! 👋</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            We're thrilled to have you join the ParentWise family! You've taken the first step toward empowering your parenting journey with AI-driven insights and personalized guidance.
          </p>
          
          <h3 style="color: #333; margin-top: 30px;">What's next?</h3>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h4 style="color: #667eea; margin-top: 0;">🎯 Complete Your Profile</h4>
            <p style="color: #666; margin-bottom: 0;">Add your children's information to get personalized recommendations</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h4 style="color: #667eea; margin-top: 0;">📱 Explore Activities</h4>
            <p style="color: #666; margin-bottom: 0;">Discover age-appropriate activities tailored to your child's development</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h4 style="color: #667eea; margin-top: 0;">🤖 Create Your First Parenting Plan</h4>
            <p style="color: #666; margin-bottom: 0;">Let our AI create a personalized plan for your family's goals</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.APP_URL}/dashboard" style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              display: inline-block;
              font-size: 16px;
            ">Get Started</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px;">
            Questions? Reply to this email or visit our <a href="${env.APP_URL}/help" style="color: #667eea;">Help Center</a>.
          </p>
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} ParentWise. All rights reserved.
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendFamilyInviteEmail(
  email: string,
  inviterName: string,
  familyName: string,
  familyCode: string
) {
  return emailTransporter.sendMail({
    to: email,
    from: env.EMAIL_FROM || 'noreply@parentwise.com',
    subject: `${inviterName} invited you to join ${familyName} on ParentWise`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ParentWise</h1>
          <p style="color: white; margin: 10px 0 0 0;">Family Invitation</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">You're invited to join a family! 👨‍👩‍👧‍👦</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            <strong>${inviterName}</strong> has invited you to join <strong>${familyName}</strong> on ParentWise.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <h3 style="color: #333; margin-top: 0;">Family Code</h3>
            <div style="
              background: #f0f4ff;
              border: 2px solid #667eea;
              padding: 15px;
              border-radius: 10px;
              font-size: 24px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 2px;
            ">${familyCode}</div>
          </div>
          
          <h3 style="color: #333;">How to join:</h3>
          <ol style="color: #666; font-size: 16px; line-height: 1.8;">
            <li>Sign up for ParentWise (it's free!)</li>
            <li>Enter the family code above</li>
            <li>Start collaborating on your family's parenting journey</li>
          </ol>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.APP_URL}/auth/signup?familyCode=${familyCode}" style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              display: inline-block;
              font-size: 16px;
            ">Join ${familyName}</a>
          </div>
          
          <p style="color: #999; font-size: 14px;">
            This invitation was sent by ${inviterName}. If you don't want to join this family, you can safely ignore this email.
          </p>
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} ParentWise. All rights reserved.
          </p>
        </div>
      </div>
    `,
  })
}