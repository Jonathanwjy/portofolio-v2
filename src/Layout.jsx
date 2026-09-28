"use client";
import React from "react";
import { Navbar } from "./components/app/navbar";
import { Outlet } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion"; // Tambahkan useSpring untuk gerak lebih halus
import { ThemeProvider } from "./components/theme-provider";
import "./i18n";

function Layout() {
  const { scrollYProgress } = useScroll();

  // Membuat pergerakan progress bar lebih smooth
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Scroll Progress Bar */}
      <ThemeProvider>
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary z-[6000] origin-left"
          style={{ scaleX }}
        />

        <Navbar />

        <main>
          {/* Konten Hero, About, dll akan muncul di sini */}
          <Outlet />
        </main>
      </ThemeProvider>
    </>
  );
}

export default Layout;
