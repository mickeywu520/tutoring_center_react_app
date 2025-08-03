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
  
  // 在Node.js環境中使用Buffer.compare進行安全比較
  if (typeof crypto.subtle === 'undefined' || typeof crypto.subtle.timingSafeEqual === 'undefined') {
    if (Buffer.compare(Buffer.from(signature), Buffer.from(expectedSignature)) !== 0) {
      throw new Error('Invalid signature');
    }
  } else {
    // 在Cloudflare Workers環境中使用crypto.subtle.timingSafeEqual
    if (!crypto.subtle.timingSafeEqual(signature, expectedSignature)) {
      throw new Error('Invalid signature');
    }
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  
  if (payload.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }

  return payload;
}

// 創建簽名
export async function createSignature(data, secret) {
  const encoder = new TextEncoder();
  
  // 在Node.js環境中使用crypto模塊
  if (typeof crypto.subtle === 'undefined' || typeof crypto.subtle.importKey === 'undefined') {
    const crypto = await import('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    const digest = hmac.digest();
    // 確保返回Buffer對象
    return Buffer.isBuffer(digest) ? digest : Buffer.from(digest);
  } else {
    // 在Cloudflare Workers環境中使用crypto.subtle
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    // 確保返回ArrayBuffer對象
    return signature instanceof ArrayBuffer ? signature : signature.buffer;
  }
}

// Base64 URL 編碼
export function base64UrlEncode(data) {
  let base64;
  
  if (data instanceof ArrayBuffer) {
    // 處理ArrayBuffer對象
    base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
  } else if (Buffer.isBuffer(data)) {
    // 處理Node.js Buffer對象
    base64 = data.toString('base64');
  } else {
    // 處理字符串
    base64 = btoa(data);
  }
  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Base64 URL 解碼
export function base64UrlDecode(str) {
  // 補齊等號
  const padding = '='.repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // 在Node.js環境中返回Buffer對象
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64');
  }
  
  // 在瀏覽器環境中返回ArrayBuffer對象
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
