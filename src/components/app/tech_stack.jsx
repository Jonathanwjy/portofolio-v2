"use client";
import React from "react";
import { motion } from "framer-motion";

const techStack = [
  { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
  { name: "PHP", icon: "https://cdn.simpleicons.org/php/777BB4" },

  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },

  { name: "NodeJS", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
  { name: "NextJS", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  },
  { name: "ShadCN UI", icon: "https://cdn.simpleicons.org/shadcnui/000000" },

  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "RESTful API", icon: "https://cdn.simpleicons.org/postman/FF6C37" },

  { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
  { name: "Postman", icon: "https://cdn.simpleicons.org/postman/FF6C37" },
  {
    name: "VS Code",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },
];

export default function TechStackCarousel() {
  const duplicatedStack = [...techStack, ...techStack, ...techStack];

  return (
    <section className=" bg-background overflow-hidden pt-48" id="tech">
      <div className="container mx-auto px-6 mb-4 md:mb-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
          className="text-2xl md:text-4xl font-bold text-primary mb-2"
        >
          Tech Stack <span className="text-foreground"> & Tools</span>
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-6xl mx-auto overflow-hidden py-3 md:py-5"
      >
        <div className="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-background to-transparent z-10" />
        <motion.div
          className="flex gap-4 md:gap-8 w-max"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedStack.map((tech, index) => (
            <TechItem key={`row1-${index}`} tech={tech} />
          ))}
        </motion.div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-background to-transparent z-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-6xl mx-auto overflow-hidden py-3 md:py-5"
      >
        <div className="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-background to-transparent z-10" />
        <motion.div
          className="flex gap-4 md:gap-8 w-max"
          animate={{ x: ["-33.33%", "0%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedStack.map((tech, index) => (
            <TechItem key={`row2-${index}`} tech={tech} />
          ))}
        </motion.div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-background to-transparent z-10" />
      </motion.div>
    </section>
  );
}

function TechItem({ tech }) {
  return (
    <div className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-card border border-border shadow-sm hover:border-primary transition-all group min-w-[130px] md:min-w-[160px]">
      <img
        src={tech.icon}
        alt={tech.name}
        className="w-6 h-6 md:w-8 md:h-8 object-contain grayscale group-hover:grayscale-0 transition-all"
      />
      <span className="text-sm md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
        {tech.name}
      </span>
    </div>
  );
}
