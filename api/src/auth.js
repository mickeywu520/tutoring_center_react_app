// JWT 認證工具

// 創建 JWT Token
export async function createJWT(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24小時過期
  }));

  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await createSignature(data, secret);
  const encodedSignature = base64UrlEncode(signature);

  return `${data}.${encodedSignature}`;
}

// 驗證 JWT Token
export async function verifyJWT(token, secret) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = base64UrlDecode(encodedSignature);

  const expectedSignature = await createSignature(data, secret);
  
  if (!crypto.subtle.timingSafeEqual(signature, expectedSignature)) {
    throw new Error('Invalid signature');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  
  if (payload.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }

  return payload;
}

// 創建簽名
async function createSignature(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  return await crypto.subtle.sign('HMAC', key, encoder.encode(data));
}

// Base64 URL 編碼
function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Base64 URL 解碼
function base64UrlDecode(str) {
  // 補齊等號
  const padding = '='.repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  return atob(base64);
}
