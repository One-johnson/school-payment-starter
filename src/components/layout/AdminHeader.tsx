// components/layout/AdminHeader.tsx
"use client";

import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LayoutDashboard, Users, GraduationCap, Menu } from "lucide-react";
import { useState } from "react";

export default function AdminHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      path: "/pages/dashboards/admin-dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={16} className="mr-2" />,
    },
    {
      path: "/pages/classes",
      label: "Classes",
      icon: <GraduationCap size={16} className="mr-2" />,
    },
    {
      path: "/pages/students",
      label: "Students",
      icon: <Users size={16} className="mr-2" />,
    },
    {
      path: "/pages/teachers",
      label: "Teachers",
      icon: <Users size={16} className="mr-2" />,
    },
  ];

  return (
    <header className="bg-white dark:bg-black shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-blue-600">payFlow</h1>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.path}>
                      <Link
                        href={item.path}
                        className={navigationMenuTriggerStyle({
                          className:
                            pathname === item.path
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-white font-semibold"
                              : "text-muted-foreground hover:text-foreground",
                        })}
                      >
                        <span className="flex items-center">
                          {item.icon}
                          {item.label}
                        </span>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-gray-600 dark:text-gray-300"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Menu size={24} />
            </button>
          </div>

          <SignedIn>
            <UserButton
              appearance={{ elements: { userButtonPopoverFooter: "hidden" } }}
            />
          </SignedIn>
        </div>

        {/* Mobile nav menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition hover:bg-muted ${
                  pathname === item.path
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-white"
                    : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
