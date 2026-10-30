import { beforeEach, describe, expect, it } from "vitest";
import { usePlayerStore } from "./player-store";
describe("player store", () => { beforeEach(() => usePlayerStore.setState({ isPlaying: false })); it("toggles playback state", () => { usePlayerStore.getState().toggle(); expect(usePlayerStore.getState().isPlaying).toBe(true); usePlayerStore.getState().stop(); expect(usePlayerStore.getState().isPlaying).toBe(false); }); });
