const AUDIO_EXTENSIONS = /\.(mp3|m4a|aac|flac|ogg|wav|webm)$/i;
export function isSupportedAudio(file: File) { return file.type.startsWith("audio/") || AUDIO_EXTENSIONS.test(file.name); }
export function normalizeTrackText(value: string) { return value.toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, "").replace(/[^a-z0-9가-힣]+/g, "").trim(); }
export function filenameToTitle(fileName: string) { return fileName.replace(/\.[^.]+$/, "").replace(/^\d{1,3}[._ -]+/, "").replace(/[_-]+/g, " ").trim() || "제목 미확인"; }
export async function fingerprintFile(file: File) { const firstChunk = await file.slice(0, Math.min(file.size, 64 * 1024)).arrayBuffer(); const digest = await crypto.subtle.digest("SHA-256", firstChunk); return `${file.size}:${Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("")}`; }
