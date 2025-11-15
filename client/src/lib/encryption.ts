// Simple encryption/decryption for API keys
// Note: This is basic obfuscation, not cryptographic security
// For production, use proper encryption libraries

const SECRET_KEY = "prompt-engineer-2024";

function xorEncrypt(text: string, key: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(result); // Base64 encode
}

function xorDecrypt(encrypted: string, key: string): string {
  try {
    const decoded = atob(encrypted); // Base64 decode
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  } catch {
    return "";
  }
}

export function encryptApiKey(apiKey: string): string {
  return xorEncrypt(apiKey, SECRET_KEY);
}

export function decryptApiKey(encrypted: string): string {
  return xorDecrypt(encrypted, SECRET_KEY);
}

export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return "****";
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}
