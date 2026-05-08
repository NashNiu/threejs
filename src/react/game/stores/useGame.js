import { create } from "zustand";

export default create((set) => ({
    blocksCount: 3,
    phase: 'ready',
    start: () => {
        console.log('Starting game...');
        return set({ phase: 'playing' });
    },
    reStart: () => {
        console.log('Restarting game...');
        return set({ phase: 'ready' });
    },
    end: () => {
        console.log('Ending game...');
        return set({ phase: 'ended' });
    },
}));