#!/usr/bin/env node

/**
 * Script to verify and inject environment variables before build
 * Creates .env.production dynamically from Cloudflare environment variables or .env.local
 */

const fs = require('fs');
const path = require('path');

// Load .env.local if it exists (for local development)
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  envLocalContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#') && !process.env[key.trim()]) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

console.log('=== Environment Variables Check ===');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_CHIPI_API_KEY:', process.env.NEXT_PUBLIC_CHIPI_API_KEY ? '✓ Set' : '✗ Missing');
console.log('===================================\n');

// Generate .env.production from environment variables
const envContent = `# Auto-generated from Cloudflare Pages environment variables
NEXT_PUBLIC_FIREBASE_API_KEY=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ''}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ''}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ''}
NEXT_PUBLIC_FIREBASE_APP_ID=${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''}
NEXT_PUBLIC_CHIPI_API_KEY=${process.env.NEXT_PUBLIC_CHIPI_API_KEY || ''}
`;

const envPath = path.join(process.cwd(), '.env.production');
fs.writeFileSync(envPath, envContent);
console.log('✓ Generated .env.production file\n');

// Exit with error if critical variables are missing
const criticalVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_CHIPI_API_KEY'
];

const missingVars = criticalVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('ERROR: Missing critical environment variables:', missingVars.join(', '));
  console.error('Build will continue but the application may not work correctly.');
  console.error('Please configure these variables in Cloudflare Pages Settings > Environment variables\n');
}
