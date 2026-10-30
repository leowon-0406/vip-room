import { beforeEach, describe, expect, it } from "vitest";
import { usePlayerStore } from "./player-store";
const track = { id: "a", fileName: "a.mp3", title: "A", artist: null, album: null, durationMs: null, mimeType: "audio/mpeg", size: 1, importedAt: "2026-01-01", fingerprint: "a", catalogTrackId: null };
describe("player store", () => { beforeEach(() => usePlayerStore.setState({ isPlaying: false, currentTrack: null, queue: [] })); it("sets a queue and advances to the next track", () => { usePlayerStore.getState().setQueue([track, { ...track, id: "b", title: "B" }], track); expect(usePlayerStore.getState().isPlaying).toBe(true); usePlayerStore.getState().next(); expect(usePlayerStore.getState().currentTrack?.id).toBe("b"); }); });
