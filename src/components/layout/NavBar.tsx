"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Speakers", href: "/speakers" },
  { name: "Agenda", href: "/agenda" },
  { name: "Venue", href: "/venue" },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check user's preferred color scheme
    if (typeof window !== "undefined") {
      const isDark =
        localStorage.getItem("darkMode") === "true" ||
        (!("darkMode" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }

    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-20 transition-all duration-200 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              PharmMAIR
            </span>
            <span className="text-sm bg-secondary-600 dark:bg-secondary-700 text-white px-2 py-0.5 rounded-full">
              2025
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-900/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="default"
              size="sm"
              roundedness="full"
              className="ml-4"
              animate
              onClick={() => (window.location.href = "/registration")}
            >
              Register Now
            </Button>
            <button
              onClick={toggleDarkMode}
              className="ml-2 p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 py-3 bg-white dark:bg-slate-900 shadow-lg">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(link.href)
                        ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-900/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = "/registration";
                    }}
                  >
                    Register Now
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
