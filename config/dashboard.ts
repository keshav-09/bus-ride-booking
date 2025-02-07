import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [{
      href: "/admin",
      icon: "laptop",
      title: "Admin Panel",
      authorizeOnly: UserRole.ADMIN,
    },
    {
      href: "/location",
      icon: "mapin",
      title: "Location",
      authorizeOnly: UserRole.ADMIN,
    },
    {
      href: "/dashboard/vehicle",
      icon: "bus",
      title: "Vehicle",
      authorizeOnly: UserRole.ADMIN,
      disabled: false,
    },

    {
      href: "/dashboard/route",
      icon: "route",
      title: "Route",
      authorizeOnly: UserRole.ADMIN,
      disabled: false,
    },
    {
      href: "/fare",
      icon: "wallet",
      title: "Fare",
      authorizeOnly: UserRole.ADMIN,
    },

    { href: "/search", icon: "search", title: "Bus Booking" },
    { href: "/tickets", icon: "ticket", title: "Tickets" },
      // {
      //   href: "/dashboard/manager",
      //   icon: "package",
      //   title: "Manager",
      //   authorizeOnly: UserRole.ADMIN,
      // },

    ],


  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
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
