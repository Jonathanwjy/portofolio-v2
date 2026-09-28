"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  const fadeIn = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: {
      once: false,
      amount: 0.3,
    },
    transition: { duration: 0.7, ease: "easeOut" },
  };

  return (
    <div className="min-h-screen bg-background px-6 pt-48" id="about">
      <div className="container max-w-6xl mx-auto">
        <motion.section
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center"
        >
          <div className="md:col-span-3 space-y-8">
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              {t("about.title")}{" "}
              <span className="text-primary">
                {t("about.me")}
                {}
              </span>
            </motion.h1>

            <motion.div
              variants={fadeIn}
              className="text-sm md:text-lg leading-relaxed text-muted-foreground space-y-6"
            >
              <p>{t("about.paragraph1")}</p>
              <p>{t("about.paragraph2")}</p>
            </motion.div>
          </div>

          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="md:col-span-2 relative hidden justify-center order-first md:order-last md:flex"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full transform scale-75 z-0" />

            <div className="relative z-10 w-full max-w-[400px]">
              <img
                src="/images/work.png"
                alt="Developer working"
                className="w-full h-auto drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
