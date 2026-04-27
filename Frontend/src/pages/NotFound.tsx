import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="container py-6"><Logo /></header>
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
            <Compass className="h-7 w-7" />
          </div>
          <h1 className="mt-8 font-display text-6xl md:text-7xl font-bold gradient-hero-text">404</h1>
          <p className="mt-4 text-lg text-muted-foreground">This page took a wrong turn. Let's get you back home.</p>
          <Button asChild className="mt-8 bg-gradient-primary text-primary-foreground hover:opacity-90 h-11 px-6">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
