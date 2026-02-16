"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [workHover, setWorkHover] = useState(false)

  const isWorkActive = pathname.startsWith("/work")

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 lg:px-16">
        <Link
          href="/"
          className="font-serif text-lg tracking-wide text-foreground transition-opacity hover:opacity-70"
        >
          Elena Vasquez
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          <Link
            href="/about"
            className={cn(
              "text-sm tracking-widest uppercase transition-opacity hover:opacity-60",
              pathname === "/about" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            About
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setWorkHover(true)}
            onMouseLeave={() => setWorkHover(false)}
          >
            <Link
              href="/work/paintings"
              className={cn(
                "text-sm tracking-widest uppercase transition-opacity hover:opacity-60",
                isWorkActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Work
            </Link>

            {/* Dropdown */}
            <div
              className={cn(
                "absolute right-0 top-full pt-3 transition-all duration-200",
                workHover ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"
              )}
            >
              <div className="flex flex-col gap-1 border border-border bg-background px-5 py-3 shadow-sm">
                <Link
                  href="/work/paintings"
                  className={cn(
                    "text-xs tracking-widest uppercase py-1.5 transition-opacity hover:opacity-60 whitespace-nowrap",
                    pathname === "/work/paintings" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Paintings
                </Link>
                <Link
                  href="/work/drawings"
                  className={cn(
                    "text-xs tracking-widest uppercase py-1.5 transition-opacity hover:opacity-60 whitespace-nowrap",
                    pathname === "/work/drawings" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Drawings
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/blog"
            className={cn(
              "text-sm tracking-widest uppercase transition-opacity hover:opacity-60",
              pathname === "/blog" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Blog
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 bg-background border-b border-border",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-b-0"
        )}
      >
        <div className="flex flex-col px-6 pb-6 gap-4">
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "text-sm tracking-widest uppercase transition-opacity hover:opacity-60",
              pathname === "/about" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            About
          </Link>
          <div className="flex flex-col gap-2">
            <span className="text-sm tracking-widest uppercase text-foreground">
              Work
            </span>
            <Link
              href="/work/paintings"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-xs tracking-widest uppercase pl-4 transition-opacity hover:opacity-60",
                pathname === "/work/paintings" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Paintings
            </Link>
            <Link
              href="/work/drawings"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-xs tracking-widest uppercase pl-4 transition-opacity hover:opacity-60",
                pathname === "/work/drawings" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Drawings
            </Link>
          </div>
          <Link
            href="/blog"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "text-sm tracking-widest uppercase transition-opacity hover:opacity-60",
              pathname === "/blog" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Blog
          </Link>
        </div>
      </div>
    </header>
  )
}
