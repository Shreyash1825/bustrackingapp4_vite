import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  formatters,
  components,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn("p-3", className)}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "flex justify-center items-center",
        nav: "flex items-center justify-between",
        button_previous: "p-2",
        button_next: "p-2",
        weekdays: "flex justify-between text-sm",
        weekday: "text-muted-foreground",
        week: "flex w-full mt-2",
        day: "h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none",
        today: "bg-accent text-accent-foreground rounded-md",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className="size-4" {...props} />
          }
          if (orientation === "right") {
            return <ChevronRightIcon className="size-4" {...props} />
          }
          return <ChevronDownIcon className="size-4" {...props} />
        },
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar }
