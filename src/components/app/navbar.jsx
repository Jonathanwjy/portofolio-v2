"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";
import { useTranslation } from "react-i18next";

const navItems = [
  { key: "home", link: "home" },
  { key: "about", link: "about" },
  { key: "education", link: "education" },
  { key: "sertification", link: "certification" },
  { key: "tech", link: "tech" },
  { key: "projects", link: "projects" },
];

export function Navbar() {
  const { t, i18n } = useTranslation();

  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const [ringAnimationId, setRingAnimationId] = useState(0);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
      setRingAnimationId((current) => current + 1);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) =>
        document.getElementById(item.link),
      );

      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        if (
          section &&
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="fixed top-6 md:top-10 inset-x-0 z-40 flex justify-center px-4"
      >
        <nav className="flex items-center gap-2 px-2 py-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground rounded-full"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <NavButton
                key={item.key}
                item={item}
                isActive={activeSection === item.link}
                ringAnimationId={ringAnimationId}
                onClick={scrollToSection}
              />
            ))}
          </div>

          <div className="flex items-center border-4 border-primary rounded-full overflow-hidden">
            <LangButton
              active={i18n.language === "id"}
              onClick={() => changeLang("id")}
            >
              ID
            </LangButton>
            <LangButton
              active={i18n.language === "en"}
              onClick={() => changeLang("en")}
            >
              EN
            </LangButton>
          </div>

          <ModeToggle />
        </nav>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-x-4 top-24 z-[4999] md:hidden"
          >
            <div className="flex flex-col gap-2 p-4 rounded-3xl border border-border bg-background shadow-2xl">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.link)}
                  className={cn(
                    "w-full px-6 py-4 rounded-2xl text-left font-medium transition-all",
                    activeSection === item.link
                      ? "text-primary"
                      : "text-muted-primary hover:text-primary",
                  )}
                >
                  {t(`nav.${item.key}`)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavButton({ item, isActive, ringAnimationId, onClick }) {
  const { t } = useTranslation();

  return (
    <button
      onClick={() => onClick(item.link)}
      aria-current={isActive ? "page" : undefined}
      className="group cursor-pointer relative isolate px-3 py-2 text-sm font-semibold text-foreground transition-transform rounded-full outline-none active:scale-95"
    >
      <span
        className={cn("absolute inset-0 rounded-full z-0", "bg-transparent")}
      />
      <span
        className={cn(
          "relative z-10",
          isActive
            ? "text-primary"
            : "text-muted-primary group-hover:text-primary",
        )}
      >
        {t(`nav.${item.key}`)}
      </span>

      {isActive && (
        <motion.svg
          key={`${item.link}-${ringAnimationId}`}
          aria-hidden="true"
          viewBox="0 0 100 48"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -inset-x-2 -inset-y-1 z-20 h-[calc(100%+0.5rem)] w-[calc(100%+1rem)] overflow-visible text-primary"
        >
          <motion.path
            d="M6 25C7 9 24 4 50 5C77 4 94 11 94 24C94 39 76 44 50 43C24 44 6 39 6 25Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.48, ease: "easeOut" },
              opacity: { duration: 0.12 },
            }}
          />
          <motion.path
            d="M8 27C10 42 31 45 53 44C76 45 91 38 92 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{
              pathLength: { duration: 0.32, delay: 0.2, ease: "easeOut" },
              opacity: { duration: 0.1, delay: 0.2 },
            }}
          />
        </motion.svg>
      )}
    </button>
  );
}

function LangButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold transition-all",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}
