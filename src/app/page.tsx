import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Timer, CuboidIcon as Cube3D } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/timer");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              <span className="text-foreground">Twist</span>
              <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                X
              </span>
            </h1>

            <h2 className="text-2xl font-semibold tracking-tight text-muted-foreground">
              Turn. Track.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Card className="flex max-w-xs cursor-pointer flex-col gap-4 rounded-xl bg-card p-4 shadow-sm transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  <Timer className="mb-1 mr-2 inline-block h-6 w-6" />
                  Start Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">
                  Begin your speedcubing journey with our precision timer
                </p>
              </CardContent>
            </Card>

            <Card className="flex max-w-xs cursor-pointer flex-col gap-4 rounded-xl bg-card p-4 shadow-sm transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  <Cube3D className="mb-1 mr-2 inline-block h-6 w-6" />
                  Track Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">
                  Analyze your solves and watch yourself improve
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
              <Button
                variant="default"
                size="lg"
                className="bg-violet-600 text-primary-foreground hover:bg-violet-600/90"
              >
                {session ? "Sign out" : "Sign in to get started"}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
