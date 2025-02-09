"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTimerStore } from "~/store/timer-store";
import { formatTime } from "~/lib/format-time";

type TimerState = "idle" | "ready" | "inspecting" | "holding" | "running";
type Penalty = 0 | 2 | "DNF";

export function TimerDisplay() {
  const [state, setState] = useState<TimerState>("idle");
  const [inspectionTime, setInspectionTime] = useState(0);
  const [penalty, setPenalty] = useState<Penalty>(0);
  const [canRelease, setCanRelease] = useState(false);

  const isHoldingRef = useRef(false);
  const inspectionStartRef = useRef<number | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const lastInspectionSecondRef = useRef(0);

  const { time, startTimer, stopTimer, resetTimer } = useTimerStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (state === "idle") {
          setState("ready");
        } else if (state === "inspecting") {
          isHoldingRef.current = true;
          setState("holding");
          holdStartRef.current = Date.now();
          setCanRelease(false);

          setTimeout(() => {
            setCanRelease(true);
          }, 500);
        }
      }
    },
    [state],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (state === "ready") {
          setState("inspecting");
          inspectionStartRef.current = Date.now();
          lastInspectionSecondRef.current = 0;
        } else if (state === "holding") {
          if (canRelease) {
            const elapsedSeconds = Math.floor(
              (Date.now() - (inspectionStartRef.current ?? 0)) / 1000,
            );
            let newPenalty: Penalty = 0;
            if (elapsedSeconds >= 17) newPenalty = "DNF";
            else if (elapsedSeconds >= 15) newPenalty = 2;

            setPenalty(newPenalty);

            if (newPenalty !== "DNF") {
              resetTimer();
              startTimer();
              setState("running");
            } else {
              setState("idle");
            }
          } else {
            setState("inspecting");
          }
        } else if (state === "running") {
          stopTimer();
          setState("idle");
        }
      }
    },
    [state, canRelease, resetTimer, startTimer, stopTimer],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === "inspecting") {
      interval = setInterval(() => {
        const elapsedSeconds = Math.floor(
          (Date.now() - (inspectionStartRef.current ?? 0)) / 1000,
        );
        if (elapsedSeconds !== lastInspectionSecondRef.current) {
          setInspectionTime(elapsedSeconds);
          lastInspectionSecondRef.current = elapsedSeconds;
        }

        if (elapsedSeconds >= 17) {
          setPenalty("DNF");
          setState("idle");
        }
      }, 100);
    }
    return () => interval && clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (state === "idle") {
      setPenalty(0);
      setInspectionTime(0);
      inspectionStartRef.current = null;
      lastInspectionSecondRef.current = 0;
      setCanRelease(false);
    }
  }, [state]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <>
      <div
        className={`mt-16 flex h-48 w-full max-w-4xl items-center justify-center rounded-lg transition-colors ${
          state === "ready"
            ? "bg-primary/20"
            : state === "inspecting"
              ? inspectionTime >= 15
                ? "bg-red-500/20"
                : "bg-card"
              : state === "holding"
                ? canRelease
                  ? "bg-green-500/20"
                  : "bg-yellow-500/20"
                : state === "running"
                  ? "bg-card"
                  : "bg-card/50"
        }`}
      >
        <span className="font-mono text-9xl font-bold text-foreground">
          {state === "inspecting"
            ? inspectionTime >= 15
              ? "+2"
              : inspectionTime
            : penalty === "DNF"
              ? "DNF"
              : formatTime(time + penalty * 1000)}
        </span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {state === "idle" && "Press and hold Space to start inspection"}
        {state === "ready" && "Release Space to begin inspection"}
        {state === "inspecting" && "Press and hold Space to start timer"}
        {state === "holding" &&
          (canRelease ? "Release to start timer" : "Keep holding...")}
        {state === "running" && "Press Space to stop timer"}
      </p>
    </>
  );
}
