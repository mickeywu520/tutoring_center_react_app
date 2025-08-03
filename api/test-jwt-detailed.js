import { createSignature, base64UrlEncode, base64UrlDecode } from './src/auth.js';

async function testSignature() {
  console.log('Testing signature creation and verification...');
  
  const secret = 'tutor_jwt_secret_key';
  const data = 'test-data';
  
  console.log('Creating signature...');
  const signature = await createSignature(data, secret);
  console.log('Signature type:', typeof signature);
  console.log('Signature constructor:', signature.constructor.name);
  console.log('Signature:', signature);
  
  console.log('Encoding signature...');
  const encodedSignature = base64UrlEncode(signature);
  console.log('Encoded signature:', encodedSignature);
  
  console.log('Decoding signature...');
  const decodedSignature = base64UrlDecode(encodedSignature);
  console.log('Decoded signature type:', typeof decodedSignature);
  console.log('Decoded signature:', decodedSignature);
  
  console.log('Creating expected signature...');
  const expectedSignature = await createSignature(data, secret);
  console.log('Expected signature type:', typeof expectedSignature);
  console.log('Expected signature constructor:', expectedSignature.constructor.name);
  console.log('Expected signature:', expectedSignature);
  
  console.log('Comparing signatures...');
  if (typeof crypto.subtle === 'undefined' || typeof crypto.subtle.timingSafeEqual === 'undefined') {
    console.log('Using Node.js comparison');
    const result = Buffer.compare(Buffer.from(decodedSignature), Buffer.from(expectedSignature)) === 0;
    console.log('Signatures match:', result);
  } else {
    console.log('Using Cloudflare Workers comparison');
    try {
      const result = crypto.subtle.timingSafeEqual(decodedSignature, expectedSignature);
      console.log('Signatures match:', result);
    } catch (error) {
      console.error('Error comparing signatures:', error.message);
    }
  }
}

testSignature().catch(console.error);
