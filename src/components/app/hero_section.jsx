"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Mail, Github, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import StrokeText from "../stroke-text";

export function HeroSection() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-center px-6 py-20 lg:pt-20 overflow-hidden bg-background"
      id="home"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="container max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
      >
        <motion.div
          variants={itemVariants}
          className="relative flex justify-center lg:justify-end order-first lg:order-last"
        >
          <div className="relative w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96">
            {/* Rotating Border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-primary opacity-20"
            />

            <div className="absolute inset-3 rounded-full overflow-hidden border-4 border-card shadow-2xl">
              <img
                src="/images/foto-diri.jpeg"
                alt="Jonathan Wijaya"
                className="w-full h-full object-cover"
              />
            </div>

            {/* <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute bottom-6 -right-2 bg-card border border-border px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                Open To Work
              </span>
            </motion.div> */}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="space-y-6 text-center lg:text-left"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground">
            {t("hero.greeting")} <br />
            <span className="text-primary"> Jonathan Wijaya.</span>
          </h2>

          <motion.p className="text-base lg:text-lg text-muted-foreground">
            {t("hero.description")}
          </motion.p>

          <div className="p-4 border border-border bg-card rounded-xl">
            <StrokeText
              text="FullStack Web Development"
              strokeColor="var(--foreground)"
              fillColor="var(--foreground)"
              strokeWidth={1}
              drawDuration={1.1}
              fillDelay={0.1}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={50}
              fontWeight={400}
              letterSpacing={-2}
              reverse={false}
            />
          </div>

          <a
            href="#projects"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-foreground font-bold rounded-xl"
          >
            {t("hero.viewProjects")} <ArrowDown className="w-4 h-4" />
          </a>

          <div className="flex gap-4 justify-center lg:justify-start">
            <SocialLink
              href="https://github.com/Jonathanwjy"
              icon={<Github />}
            />
            <SocialLink href="https://linkedin.com" icon={<Linkedin />} />
            <SocialLink href="https://instagram.com" icon={<Instagram />} />
            <SocialLink href="mailto:test@gmail.com" icon={<Mail />} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-white transition-all duration-300"
    >
      {React.cloneElement(icon, { size: 20 })}
    </a>
  );
}
