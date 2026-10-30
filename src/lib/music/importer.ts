import { parseBlob } from "music-metadata";
import { filenameToTitle, fingerprintFile, isSupportedAudio } from "./file-utils";
import { findByFingerprint, saveLocalTrack } from "./db";
import type { ImportResult, LocalTrack } from "./types";
export async function importAudioFile(file: File): Promise<ImportResult> {
  if (!isSupportedAudio(file)) throw new Error("지원하지 않는 파일 형식입니다. MP3, M4A/AAC, FLAC, OGG, WAV만 등록할 수 있습니다.");
  const fingerprint = await fingerprintFile(file); const existing = await findByFingerprint(fingerprint);
  if (existing) return { track: existing, duplicate: true };
  let title = filenameToTitle(file.name), artist: string | null = null, album: string | null = null, durationMs: number | null = null, warning: string | undefined;
  try { const metadata = await parseBlob(file, { duration: true }); title = metadata.common.title?.trim() || title; artist = metadata.common.artist?.trim() || null; album = metadata.common.album?.trim() || null; durationMs = metadata.format.duration ? Math.round(metadata.format.duration * 1000) : null; } catch { warning = "태그를 읽지 못해 파일명으로 등록했습니다."; }
  const track: LocalTrack = { id: crypto.randomUUID(), fileName: file.name, title, artist, album, durationMs, mimeType: file.type || "audio/mpeg", size: file.size, importedAt: new Date().toISOString(), fingerprint, catalogTrackId: null };
  await saveLocalTrack(track, file); return { track, duplicate: false, warning };
}
