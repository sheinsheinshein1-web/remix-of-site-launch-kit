/** Decode PNG or uncompressed 32-bit DIB frames in Windows ICO containers. */
export function decodeIcon(bytes) {
  if (bytes.length < 6 || bytes.readUInt32LE(0) !== 65536) return { input: bytes };
  const count = bytes.readUInt16LE(4);
  if (!count || 6 + count * 16 > bytes.length) throw new Error("Invalid ICO directory");
  const frames = [];
  for (let i = 0; i < count; i++) {
    const pos = 6 + i * 16;
    const size = bytes.readUInt32LE(pos + 8);
    const offset = bytes.readUInt32LE(pos + 12);
    if (offset < 6 + count * 16 || offset + size > bytes.length) throw new Error("Invalid ICO frame bounds");
    frames.push({ width: bytes[pos] || 256, height: bytes[pos + 1] || 256, data: bytes.subarray(offset, offset + size) });
  }
  for (const frame of frames.sort((a, b) => b.width * b.height - a.width * a.height)) {
    const { width, height, data } = frame;
    if (data.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) return { input: data };
    if (data.length < 40 || data.readUInt32LE(0) !== 40 || data.readUInt16LE(14) !== 32 || data.readUInt32LE(16) !== 0) continue;
    if (data.readInt32LE(4) !== width || data.readInt32LE(8) !== height * 2 || data.length < 40 + width * height * 4) continue;
    const rgba = Buffer.alloc(width * height * 4);
    let hasAlpha = false;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const src = 40 + ((height - y - 1) * width + x) * 4;
      const dst = (y * width + x) * 4;
      rgba[dst] = data[src + 2]; rgba[dst + 1] = data[src + 1]; rgba[dst + 2] = data[src]; rgba[dst + 3] = data[src + 3];
      hasAlpha ||= data[src + 3] > 0;
    }
    if (!hasAlpha) {
      const maskOffset = 40 + width * height * 4;
      const maskStride = Math.ceil(width / 32) * 4;
      if (data.length < maskOffset + maskStride * height) throw new Error("Missing ICO transparency mask");
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const mask = data[maskOffset + (height - y - 1) * maskStride + Math.floor(x / 8)];
        rgba[(y * width + x) * 4 + 3] = mask & (128 >> (x % 8)) ? 0 : 255;
      }
    }
    return { input: rgba, options: { raw: { width, height, channels: 4 } } };
  }
  throw new Error("Unsupported ICO encoding");
}
