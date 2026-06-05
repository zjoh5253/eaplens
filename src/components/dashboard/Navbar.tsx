"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BarChart3, LayoutDashboard, Upload, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload Data", icon: Upload },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-gray-900">EAPLens</span>
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {session?.user?.name?.[0]?.toUpperCase() ?? session?.user?.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:block max-w-32 truncate">
                {session?.user?.name ?? session?.user?.email}
              </span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <p className="px-3 py-2 text-xs text-gray-400 border-b border-gray-100 truncate">
                  {session?.user?.email}
                </p>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
