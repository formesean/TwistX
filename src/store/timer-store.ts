import { create } from "zustand";

interface TimerState {
  time: number;
  isRunning: boolean;
  scramble: string;
  solves: number[];
  startTime: number | null;
  animationFrame: number | null;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  generateScramble: () => void;
  clearSolves: () => void;
}

const generateScramble = async (): Promise<string> => {
  if (typeof window === "undefined") return "Loading...";
  const Scrambler = (await import("sr-scrambler")).default;
  return Scrambler.cube(3, 20).toString();
};

export const useTimerStore = create<TimerState>((set, get) => {
  // Generate scramble on store creation
  void generateScramble().then((scramble) => set({ scramble }));

  return {
    time: 0,
    isRunning: false,
    scramble: "Loading...",
    solves: [],
    startTime: null,
    animationFrame: null,

    startTimer: () => {
      const start = performance.now();
      set({ isRunning: true, startTime: start });

      const updateTime = () => {
        const { startTime, isRunning } = get();
        if (!isRunning) return;

        const elapsed = performance.now() - (startTime ?? start);
        set({ time: elapsed });

        const frameId = requestAnimationFrame(updateTime);
        set({ animationFrame: frameId });
      };

      updateTime();
    },

    stopTimer: () => {
      const { animationFrame, time } = get();
      if (animationFrame) cancelAnimationFrame(animationFrame);

      void generateScramble().then((scramble) => {
        set((state) => ({
          isRunning: false,
          animationFrame: null,
          solves: [time, ...state.solves].slice(0, 5),
          scramble,
        }));
      });
    },

    resetTimer: () => {
      set({ time: 0, startTime: null });
    },

    generateScramble: () => {
      void generateScramble().then((scramble) => set({ scramble }));
    },

    clearSolves: () => {
      set({ solves: [] });
    },
  };
});
