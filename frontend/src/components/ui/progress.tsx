import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "../../lib/utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const getProgressColor = (value: number) => {
    if (value < 20) {
      return "bg-red-500";
    }
    if (value < 50) {
      return "bg-yellow-500";
    }
    return "bg-green-500";
  };

  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className={`${getProgressColor(
          value || 0
        )} h-full w-full flex-1 transition-all`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
