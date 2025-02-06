import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/search", icon: "search", title: "Search Buses" },
      { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
      {
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "#/dashboard/posts",
        icon: "post",
        title: "User Posts",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },

      {
        href: "/fare",
        icon: "bus",
        title: "Fare Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/location",
        icon: "mapin",
        title: "Location Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/vehicle",
        icon: "post",
        title: "Vehicle",
        authorizeOnly: UserRole.ADMIN,
        disabled: false,
      },
      {
        href: "/dashboard/manager",
        icon: "package",
        title: "Manager",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/route",
        icon: "post",
        title: "Route",
        authorizeOnly: UserRole.ADMIN,
        disabled: false,
      }
    ],

    
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
];
