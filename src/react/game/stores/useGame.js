import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(subscribeWithSelector((set) => ({
    blocksCount: 10,
    blocksSeed: 0,
    phase: 'ready',
    startTime: 0,
    endTime: 0,
    start: () => {
        set((state) => {
            if (state.phase === 'ready') {
                return { phase: 'playing', startTime: Date.now() };
            }
            return {};
        })
    },
    reStart: () => {
        set((state) => {
            if (state.phase === 'ended' || state.phase === 'playing') {
                return { phase: 'ready', blocksSeed: Math.random() };
            }
            return {};
        })
    },
    end: () => {
        set((state) => {
            if (state.phase !== 'playing') {
                return {};
            }
            return { phase: 'ended', endTime: Date.now() };
        })
    },
})));