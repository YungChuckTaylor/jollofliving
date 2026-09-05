/* ============================================================
   JOLLOF LIVING — APK packaging
   ------------------------------------------------------------
   A small zip writer with the two rules an APK has to follow:

     * resources.arsc (and any other stored entry) must start on a
       4-byte boundary, or Android 11 and newer refuse to install
       the package;
     * the file types aapt already compressed — png, jpg, ogg … —
       are stored, not deflated again.

   Padding goes in the local header's extra field under the same
   0xD935 id zipalign uses, so the result is byte-for-byte the
   layout a Gradle build would produce.
   ============================================================ */
import { deflateRawSync } from "node:zlib";
import { writeFileSync, readFileSync } from "node:fs";

/* Extensions aapt2 leaves uncompressed. Deflating them again costs
   CPU on the phone and saves nothing. */
const STORE = new Set([
  ".arsc", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".wav", ".mp2", ".mp3",
  ".ogg", ".aac", ".mpg", ".mpeg", ".mid", ".midi", ".smf", ".jet", ".rtttl",
  ".imy", ".xmf", ".mp4", ".m4a", ".m4v", ".avi", ".wma", ".wmv", ".webm",
  ".mkv", ".tflite", ".so",
]);

const ALIGN = 4;
const PADDING_ID = 0xd935; // "Android alignment" extra field.

let CRC_TABLE = null;
function crc32(buf) {
  if (!CRC_TABLE) {
    CRC_TABLE = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      CRC_TABLE[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

/* A fixed timestamp keeps two builds of the same sources identical. */
const DOS_TIME = 0x6000; // 12:00:00
const DOS_DATE = ((2024 - 1980) << 9) | (1 << 5) | 1; // 2024-01-01

function shouldStore(name) {
  const dot = name.lastIndexOf(".");
  return dot > -1 && STORE.has(name.slice(dot).toLowerCase());
}

function paddingExtra(offset, nameLength) {
  const headerEnd = offset + 30 + nameLength;
  const short = (ALIGN - (headerEnd % ALIGN)) % ALIGN;
  if (short === 0) return Buffer.alloc(0);
  const total = short + 4; // the extra field needs its own 4-byte header
  const extra = Buffer.alloc(total);
  extra.writeUInt16LE(PADDING_ID, 0);
  extra.writeUInt16LE(total - 4, 2);
  return extra;
}

/**
 * Write an APK (a zip) from a list of { name, data } entries.
 * `data` may be a Buffer or a path to read.
 */
export function writeApk(outPath, entries) {
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const raw = entry.data instanceof Buffer ? entry.data : readFileSync(entry.data);
    const store = entry.store ?? shouldStore(entry.name);

    const body = store ? raw : deflateRawSync(raw, { level: 9 });
    const method = store ? 0 : 8;
    const crc = crc32(raw);
    const extra = store ? paddingExtra(offset, name.length) : Buffer.alloc(0);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(extra.length, 28);

    chunks.push(local, name, extra, body);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4); // version made by
    dir.writeUInt16LE(20, 6); // version needed
    dir.writeUInt16LE(0, 8);
    dir.writeUInt16LE(method, 10);
    dir.writeUInt16LE(DOS_TIME, 12);
    dir.writeUInt16LE(DOS_DATE, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(body.length, 20);
    dir.writeUInt32LE(raw.length, 24);
    dir.writeUInt16LE(name.length, 28);
    dir.writeUInt16LE(0, 30); // extra length — padding lives in the local header only
    dir.writeUInt16LE(0, 32); // comment
    dir.writeUInt16LE(0, 34); // disk
    dir.writeUInt16LE(0, 36); // internal attrs
    dir.writeUInt32LE(0, 38); // external attrs
    dir.writeUInt32LE(offset, 42);
    central.push(dir, name);

    offset += local.length + name.length + extra.length + body.length;
  }

  const centralStart = offset;
  let centralSize = 0;
  for (const c of central) centralSize += c.length;

  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralStart, 16);
  end.writeUInt16LE(0, 20);

  writeFileSync(outPath, Buffer.concat([...chunks, ...central, end]));
  return outPath;
}

/**
 * Read back a finished APK and confirm every stored entry starts on a
 * 4-byte boundary — the check `zipalign -c` performs.
 */
export function checkAlignment(apkPath) {
  const buf = readFileSync(apkPath);
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error("not a zip: no end-of-central-directory record");
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const bad = [];

  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("central directory is corrupt");
    const method = buf.readUInt16LE(p + 10);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);

    if (method === 0) {
      const localNameLen = buf.readUInt16LE(localOffset + 26);
      const localExtraLen = buf.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + localNameLen + localExtraLen;
      if (dataStart % ALIGN !== 0) bad.push(`${name} @ ${dataStart}`);
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return bad;
}
