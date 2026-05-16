import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Agent OS — Sign In",
  description: "Access your AI Agent Operating System.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
