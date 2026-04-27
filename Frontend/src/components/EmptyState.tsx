import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void } | ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6", className)}>
      <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action &&
        (typeof action === "object" && action !== null && "label" in (action as object) ? (
          <Button onClick={(action as { onClick: () => void }).onClick} className="mt-6 bg-gradient-primary text-primary-foreground hover:opacity-90">
            {(action as { label: string }).label}
          </Button>
        ) : (
          <div className="mt-6">{action as ReactNode}</div>
        ))}
    </div>
  );
}
