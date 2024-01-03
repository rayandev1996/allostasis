export function uint8Array(text): Uint8Array {
  const buf = Buffer.from(text, 'utf-8');
  const result = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

  return result;
}
