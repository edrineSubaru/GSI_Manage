import * as React from "react";
import { cn } from "@/lib/utils";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-64 flex-col bg-background shadow-lg border-r",
      className
    )}
    {...props}
  />
));
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 border-b", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto py-6", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarNav = React.forwardRef<
  HTMLNavigationElement,
  React.HTMLAttributes<HTMLNavigationElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("px-4", className)}
    {...props}
  />
));
SidebarNav.displayName = "SidebarNav";

const SidebarNavList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
));
SidebarNavList.displayName = "SidebarNavList";

const SidebarNavItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={className}
    {...props}
  />
));
SidebarNavItem.displayName = "SidebarNavItem";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarNav,
  SidebarNavList,
  SidebarNavItem,
};
