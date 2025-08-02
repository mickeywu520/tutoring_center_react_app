// 密碼加密工具

// 哈希密碼
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// 驗證密碼
export async function verifyPassword(password, hash) {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}
