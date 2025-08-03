import { createJWT, verifyJWT } from './src/auth.js';

async function testJWT() {
  const secret = 'tutor_jwt_secret_key';
  const payload = { id: 'test-user', role: 'admin' };
  
  console.log('Creating JWT token...');
  const token = await createJWT(payload, secret);
  console.log('Token created:', token);
  
  console.log('Verifying JWT token...');
  try {
    const verifiedPayload = await verifyJWT(token, secret);
    console.log('Token verified successfully!');
    console.log('Verified payload:', verifiedPayload);
  } catch (error) {
    console.error('Token verification failed:', error.message);
  }
}

testJWT().catch(console.error);
