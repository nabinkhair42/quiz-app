"use client"
import { Button } from "@/components/ui/button";
import { Brain, Home, History, LucideIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: Home },
  { path: "/history", label: "History", icon: History },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b mb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">
              Quiz Platform
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} href={path}>
                <Button 
                  variant={pathname === path ? "default" : "ghost"}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
            <div className="ml-2 border-l pl-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Quiz Platform
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map(({ path, label, icon: Icon }) => (
                    <Link 
                      key={path} 
                      href={path}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button 
                        variant={pathname === path ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                        size="lg"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
} 