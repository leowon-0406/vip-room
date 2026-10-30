import { openDB, type DBSchema } from "idb";
import type { LocalTrack, StoredAudio } from "./types";
interface VipRoomDB extends DBSchema { tracks: { key: string; value: LocalTrack; indexes: { "by-fingerprint": string } }; audio: { key: string; value: StoredAudio } }
let dbPromise: ReturnType<typeof openDB<VipRoomDB>> | undefined;
function getDB() { if (typeof indexedDB === "undefined") throw new Error("로컬 음악 보관함은 브라우저에서만 사용할 수 있습니다."); dbPromise ??= openDB<VipRoomDB>("vip-room-music", 1, { upgrade(db) { const tracks = db.createObjectStore("tracks", { keyPath: "id" }); tracks.createIndex("by-fingerprint", "fingerprint", { unique: true }); db.createObjectStore("audio", { keyPath: "id" }); } }); return dbPromise; }
export async function listLocalTracks() { return (await getDB()).getAll("tracks"); }
export async function findByFingerprint(fingerprint: string) { return (await getDB()).getFromIndex("tracks", "by-fingerprint", fingerprint); }
export async function saveLocalTrack(track: LocalTrack, blob: Blob) { const db = await getDB(); const tx = db.transaction(["tracks", "audio"], "readwrite"); await tx.objectStore("tracks").put(track); await tx.objectStore("audio").put({ id: track.id, blob }); await tx.done; }
export async function getAudioBlob(id: string) { return (await getDB()).get("audio", id); }
export async function deleteLocalTrack(id: string) { const db = await getDB(); const tx = db.transaction(["tracks", "audio"], "readwrite"); await tx.objectStore("tracks").delete(id); await tx.objectStore("audio").delete(id); await tx.done; }
