export type LocalTrack = {
  id: string; fileName: string; title: string; artist: string | null; album: string | null;
  durationMs: number | null; mimeType: string; size: number; importedAt: string; fingerprint: string;
  catalogTrackId: string | null; coverBlob?: Blob;
};
export type StoredAudio = { id: string; blob: Blob };
export type ImportResult = { track: LocalTrack; duplicate: boolean; warning?: string };
