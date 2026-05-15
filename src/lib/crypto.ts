const ENC_ALGO = 'AES-GCM'
const KEY_ALGO = 'PBKDF2'
const KEY_ITERATIONS = 200_000
const KEY_LENGTH = 256
const SALT_PREFIX = 'cici-and-monday:'

function enc(str: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(new TextEncoder().encode(str))
}

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw', enc(password), KEY_ALGO, false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: KEY_ALGO, salt, iterations: KEY_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: ENC_ALGO, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

function makeSalt(uid: string): Uint8Array<ArrayBuffer> {
  return enc(SALT_PREFIX + uid)
}

export async function encrypt(plaintext: string, password: string, uid: string): Promise<string> {
  const key = await deriveKey(password, makeSalt(uid))
  const iv = Uint8Array.from(crypto.getRandomValues(new Uint8Array(12)))
  const encoded = enc(plaintext)
  const ciphertext = await crypto.subtle.encrypt(
    { name: ENC_ALGO, iv }, key, encoded
  )
  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), iv.length)
  return btoa(String.fromCharCode(...combined))
}

export async function decrypt(ciphertext: string, password: string, uid: string): Promise<string> {
  const raw = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0))
  const iv = Uint8Array.from(raw.slice(0, 12))
  const data = Uint8Array.from(raw.slice(12))
  const key = await deriveKey(password, makeSalt(uid))
  const decrypted = await crypto.subtle.decrypt(
    { name: ENC_ALGO, iv }, key, data
  )
  return new TextDecoder().decode(decrypted)
}
