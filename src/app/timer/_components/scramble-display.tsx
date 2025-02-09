"use client";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useTimerStore } from "~/store/timer-store";

export function ScrambleDisplay() {
  const { scramble, generateScramble } = useTimerStore();

  return (
    <Card className="mt-8 w-full max-w-4xl p-4">
      <div className="flex items-center justify-between">
        <p
          className="font-mono text-2xl text-foreground"
          suppressHydrationWarning
        >
          {scramble}
        </p>
        <Button variant="ghost" size="icon" onClick={generateScramble}>
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
