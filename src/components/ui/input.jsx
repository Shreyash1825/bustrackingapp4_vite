import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "dark:border-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none",
        "file:flex file:items-center file:gap-2 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:ring focus-visible:ring-ring/50 focus-visible:ring-offset-0",
        "aria-invalid:border-destructive aria-invalid:ring-destructive aria-invalid:ring-1",
        className
      )}
      {...props}
    />
  )
}

export { Input }
