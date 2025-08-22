"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* -------------------------------------------------------------------------- */
/*                              Provider + Context                            */
/* -------------------------------------------------------------------------- */

const SIDEBAR_STORAGE_KEY = "sidebar:open"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3rem"

const SidebarContext = React.createContext(null)

export function SidebarProvider({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
}) {
  const isMobile = useIsMobile()
  const [openUncontrolled, setOpenUncontrolled] = React.useState(
    () => (typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(SIDEBAR_STORAGE_KEY) ?? "null")
      : null) ?? defaultOpen
  )
  const [openMobile, setOpenMobile] = React.useState(false)

  const open = openProp ?? openUncontrolled
  const setOpen = React.useCallback(
    (value) => {
      const next = typeof value === "function" ? value(open) : value
      if (onOpenChange) onOpenChange(next)
      else setOpenUncontrolled(next)
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next))
      } catch {}
    },
    [onOpenChange, open]
  )

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((v) => !v)
    else setOpen((v) => !v)
  }, [isMobile, setOpen])

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT) {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const value = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      isMobile,
    }),
    [state, open, openMobile, isMobile, setOpen, toggleSidebar]
  )

  // CSS custom props for width
  const wrapperStyle = {
    "--sidebar-width": SIDEBAR_WIDTH,
    "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
  }

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider>
        <div
          data-slot="sidebar-wrapper"
          className={cn("group/sidebar-wrapper flex min-h-svh w-full")}
          style={wrapperStyle}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>")
  return ctx
}

/* -------------------------------------------------------------------------- */
/*                                  Sidebar                                   */
/* -------------------------------------------------------------------------- */

export function Sidebar({
  side = "left",
  variant = "sidebar", // "sidebar" | "floating" | "inset"
  collapsible = "offcanvas", // "offcanvas" | "icon" | "none"
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn("bg-sidebar text-sidebar-foreground flex h-full w-[var(--sidebar-width)] flex-col", className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile}>
        <SheetContent
          data-slot="sidebar"
          side={side}
          className="bg-sidebar text-sidebar-foreground w-[var(--sidebar-width)] p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Mobile sidebar</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // desktop
  return (
    <div
      className="group peer hidden data-[side=left]:[--sidebar-offset:0] data-[side=right]:[--sidebar-offset:0] md:block"
      data-slot="sidebar"
      data-state={state}
      data-side={side}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
    >
      {/* gap spacer */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-[var(--sidebar-width)] transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]",
          variant !== "sidebar" && "p-0"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:block",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:-left-[var(--sidebar-width)]"
            : "right-0 group-data-[collapsible=offcanvas]:-right-[var(--sidebar-width)]",
          variant !== "sidebar" ? "p-2 group-data-[collapsible=icon]:pl-[calc(var(--sidebar-width-icon)+.5rem)]" : ""
        )}
        {...props}
      >
        <div
          data-slot="sidebar-inner"
          className={cn(
            "bg-sidebar text-sidebar-foreground flex h-full w-full flex-col",
            variant === "floating" && "rounded-lg border shadow-sm",
            variant === "inset" && "rounded-lg border"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Small Pieces                                */
/* -------------------------------------------------------------------------- */

export function SidebarTrigger({ className, onClick, ...props }) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(e) => {
        onClick?.(e)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 md:block",
        "cursor-ew-resize"
      , className)}
      {...props}
    />
  )
}

export function SidebarInset({ className, ...props }) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("bg-background relative flex w-full flex-1 flex-col", className)}
      {...props}
    />
  )
}

export function SidebarInput({ className, ...props }) {
  return (
    <Input
      data-slot="sidebar-input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  )
}

export function SidebarHeader({ className, ...props }) {
  return (
    <div data-slot="sidebar-header" className={cn("flex flex-col gap-2 p-2", className)} {...props} />
  )
}

export function SidebarFooter({ className, ...props }) {
  return (
    <div data-slot="sidebar-footer" className={cn("mt-auto flex flex-col gap-2 p-2", className)} {...props} />
  )
}

export function SidebarSeparator({ className, ...props }) {
  return (
    <Separator data-slot="sidebar-separator" className={cn("bg-sidebar-border mx-2 w-auto", className)} {...props} />
  )
}

export function SidebarContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:hidden", className)}
      {...props}
    />
  )
}

export function SidebarGroup({ className, ...props }) {
  return (
    <div data-slot="sidebar-group" className={cn("relative flex w-full min-w-0 flex-col p-2", className)} {...props} />
  )
}

export function SidebarGroupContent({ className, ...props }) {
  return (
    <div data-slot="sidebar-group-content" className={cn("w-full text-sm", className)} {...props} />
  )
}

export function SidebarGroupLabel({ className, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="sidebar-group-label"
      className={cn(
        "text-sidebar-foreground/70 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium",
        "transition-[margin,opacity] duration-200 ease-linear",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

export function SidebarGroupAction({ className, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="sidebar-group-action"
      className={cn(
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0",
        "transition-transform",
        "after:absolute after:-inset-2 md:after:content-['']",
        "group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Menu Bits                                 */
/* -------------------------------------------------------------------------- */

export function SidebarMenu({ className, ...props }) {
  return (
    <ul data-slot="sidebar-menu" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
  )
}

export function SidebarMenuItem({ className, ...props }) {
  return (
    <li data-slot="sidebar-menu-item" className={cn("group/menu-item relative", className)} {...props} />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm",
      },
      active: {
        true: "bg-sidebar-accent text-sidebar-accent-foreground",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      active: false,
    },
  }
)

export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size, active: isActive }), className)}
      {...props}
    />
  )

  if (!tooltip) return button

  const tooltipProps = typeof tooltip === "string" ? { children: tooltip } : tooltip
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltipProps}
      />
    </Tooltip>
  )
}

export function SidebarMenuAction({ className, asChild = false, showOnHover = false, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="sidebar-menu-action"
      className={cn(
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground",
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0",
        "transition-transform",
        "after:absolute after:-inset-2 md:after:content-['']",
        showOnHover &&
          "opacity-0 peer-data-[active=true]/menu-button:opacity-100 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100",
        className
      )}
      {...props}
    />
  )
}

export function SidebarMenuBadge({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground"
      , className)}
      {...props}
    />
  )
}

export function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
  const width = React.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, [])
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 flex-1"
        style={{ maxWidth: width }}
        data-sidebar="menu-skeleton-text"
      />
    </div>
  )
}

export function SidebarMenuSub({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

export function SidebarMenuSubItem({ className, ...props }) {
  return (
    <li data-slot="sidebar-menu-sub-item" className={cn("group/menu-sub-item relative", className)} {...props} />
  )
}

export function SidebarMenuSubButton({
  asChild = false,
  size = "md", // "sm" | "md"
  isActive = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a"
  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-none",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" ? "text-xs" : "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}
