import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Loader({
  className,
  size = "md",
  fullScreen = false,
}: LoaderProps) {
  const Spinner = (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        sizeClasses[size],
        className,
      )}
    >
      <div className="absolute w-full h-full border-4 border-primary/30 rounded-full" />
      <div className="absolute w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {Spinner}
            <p className="text-muted-foreground animate-pulse">
              Loading your experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return Spinner;
}
