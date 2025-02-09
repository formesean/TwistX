"use client";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { RotateCcw } from "lucide-react";
import { useTimerStore } from "~/store/timer-store";
import { formatTime } from "~/lib/format-time";

export function SolvesList() {
  const { solves, clearSolves } = useTimerStore();

  return (
    <Card className="mt-8 w-full max-w-4xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Last Solves</h2>
        <Button variant="ghost" size="icon" onClick={clearSolves}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[200px]">
        {solves.length > 0 ? (
          <div className="space-y-2">
            {solves.map((solve, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <span className="text-sm text-muted-foreground">
                  Solve {solves.length - i}
                </span>
                <span className="font-mono text-lg text-foreground">
                  {formatTime(solve)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No solves yet</p>
        )}
      </ScrollArea>
    </Card>
  );
}
