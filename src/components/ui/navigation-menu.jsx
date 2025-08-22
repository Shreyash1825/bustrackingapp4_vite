import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"

import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover-accent hover-accent-foreground focus-accent focus-accent-foreground disabled-events-none disabled-50 data-[state=open]-accent data-[state=open]-accent-foreground data-[state=open]-accent data-[state=open]-accent/50 focus-visible-ring/50 outline-none transition-[color,box-shadow] focus-visible-[3px] focus-visible-1"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]-in data-[motion^=to-]-out data-[motion^=from-]-in data-[motion^=to-]-out data-[motion=from-end]-in-from-right-52 data-[motion=from-start]-in-from-left-52 data-[motion=to-end]-out-to-right-52 data-[motion=to-start]-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md-auto",
        "group-data-[viewport=false]/navigation-menu-popover group-data-[viewport=false]/navigation-menu-popover-foreground group-data-[viewport=false]/navigation-menu-[state=open]-in group-data-[viewport=false]/navigation-menu-[state=closed]-out group-data-[viewport=false]/navigation-menu-[state=closed]-out-95 group-data-[viewport=false]/navigation-menu-[state=open]-in-95 group-data-[viewport=false]/navigation-menu-[state=open]-in-0 group-data-[viewport=false]/navigation-menu-[state=closed]-out-0 group-data-[viewport=false]/navigation-menu-full group-data-[viewport=false]/navigation-menu-1.5 group-data-[viewport=false]/navigation-menu-hidden group-data-[viewport=false]/navigation-menu-md group-data-[viewport=false]/navigation-menu-data-[viewport=false]/navigation-menu-data-[viewport=false]/navigation-menu-200 **-[slot=navigation-menu-link]-0 **-[slot=navigation-menu-link]-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]-in data-[state=closed]-out data-[state=closed]-out-95 data-[state=open]-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]-accent data-[active=true]-accent data-[active=true]-accent/50 data-[active=true]-accent-foreground hover-accent hover-accent-foreground focus-accent focus-accent-foreground focus-visible-ring/50 [&_svg([class*='text-'])]-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible-[3px] focus-visible-1 [&_svg([class*='size-'])]-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]-in data-[state=hidden]-out data-[state=hidden]-out data-[state=visible]-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
