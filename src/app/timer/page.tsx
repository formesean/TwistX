import { Suspense } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TimerDisplay } from "./_components/timer-display";
import { ScrambleDisplay } from "./_components/scramble-display";
import { SolvesList } from "./_components/solves-list";
import { Skeleton } from "~/components/ui/skeleton";
import { auth } from "~/server/auth";

export default async function TimerPage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4">
      {/* Header */}
      <div className="flex w-full max-w-4xl items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          <span className="text-foreground">Twist</span>
          <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            X
          </span>
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-violet-600 text-primary-foreground hover:bg-violet-600/90"
                >
                  {session ? "Sign out" : "Sign in to get started"}
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scramble */}
      <Suspense
        fallback={
          <Card className="mt-8 w-full max-w-4xl p-4">
            <Skeleton className="h-8 w-full" />
          </Card>
        }
      >
        <ScrambleDisplay />
      </Suspense>

      {/* Timer and AoX */}
      <Suspense
        fallback={
          <div className="mt-16 flex h-48 w-full max-w-4xl items-center justify-center rounded-lg bg-card/50">
            <Skeleton className="h-24 w-48" />
          </div>
        }
      >
        <TimerDisplay />
      </Suspense>

      {/* Last Solves */}
      <Suspense
        fallback={
          <Card className="mt-8 w-full max-w-4xl p-4">
            <Skeleton className="h-[248px] w-full" />
          </Card>
        }
      >
        <SolvesList />
      </Suspense>
    </main>
  );
}
