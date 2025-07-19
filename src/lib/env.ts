import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),

  // NextAuth.js
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),

  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  APPLE_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().optional(),

  // Redis
  REDIS_URL: z.string().url().optional(),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // Stripe
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url(),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;