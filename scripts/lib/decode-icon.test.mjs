import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeIcon } from "./decode-icon.mjs";

test("ordinary image bytes are unchanged", () => {
  const input = Buffer.from("ordinary-image");
  assert.equal(decodeIcon(input).input, input);
});

test("32-bit ICO uses the correct color order and orientation", () => {
  const input = Buffer.alloc(70);
  input.writeUInt16LE(1, 2); input.writeUInt16LE(1, 4);
  input[6] = 1; input[7] = 2;
  input.writeUInt32LE(48, 14); input.writeUInt32LE(22, 18);
  input.writeUInt32LE(40, 22); input.writeInt32LE(1, 26); input.writeInt32LE(4, 30);
  input.writeUInt16LE(32, 36);
  Buffer.from([1, 2, 3, 255, 4, 5, 6, 128]).copy(input, 62);
  const decoded = decodeIcon(input);
  assert.deepEqual([...decoded.input], [6, 5, 4, 128, 3, 2, 1, 255]);
  assert.deepEqual(decoded.options.raw, { width: 1, height: 2, channels: 4 });
});

test("a truncated ICO is rejected", () => {
  const input = Buffer.from([0, 0, 1, 0, 3, 0]);
  assert.throws(() => decodeIcon(input), /Invalid ICO directory/);
});
