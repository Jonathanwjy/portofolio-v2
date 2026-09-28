"use client";
import { motion } from "framer-motion";
import React from "react";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Certification() {
  const { t } = useTranslation();

  const certifications = [
    {
      title: t("certification.webDeveloper.title"),
      issuer: t("certification.webDeveloper.issuer"),
      date: t("certification.webDeveloper.date"),
      link: "https://drive.google.com/file/d/1MqgaR-xiDLnj8_yRHq8VCwf-Ox9F-vqy/view?usp=sharing",
    },
  ];
  return (
    <section
      id="certification"
      className="px-6 py-42 bg-background overflow-hidden"
    >
      <div className="flex flex-col items-center" id="certification">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-primary mb-10"
        >
          {t("certification.sectionTitle")}
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="flex flex-wrap justify-center gap-6 max-w-6xl w-full"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              variants={cardVariants}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden"
            >
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {t(cert.title)}
                  </h2>
                  <p className="text-primary font-medium text-sm">
                    {t(cert.issuer)}
                  </p>
                </div>

                <div className="flex items-center text-gray-500 dark:text-gray-400 text-base font-medium mb-4">
                  <Calendar className="w-5 h-5 mr-2 text-primary/70" />
                  <span>{t(cert.date)}</span>
                </div>

                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-center bg-primary/80 text-white py-2 px-4 rounded-md hover:bg-primary transition-colors duration-300 text-sm font-medium"
                >
                  {t("certification.button")}
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
