"use client";
import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ScrollTimeline } from "@/components/lightswind/scroll-timeline";

export function ExperienceEducation() {
  const { t } = useTranslation();

  const educationData = [
    {
      title: t("education.informatics.title"),
      institution: t("education.informatics.institution"),
      period: t("education.informatics.period"),
      description: t("education.informatics.description"),
    },
    {
      title: t("education.mathScience.title"),
      institution: t("education.mathScience.institution"),
      period: t("education.mathScience.period"),
      description: t("education.mathScience.description"),
    },
  ];

  const experienceData = [
    {
      title: t("experience.dataon.title"),
      institution: t("experience.dataon.institution"),
      period: t("experience.dataon.period"),
      description: t("experience.dataon.description"),
    },
    {
      title: t("experience.intern.title"),
      institution: t("experience.intern.institution"),
      period: t("experience.intern.period"),
      description: t("experience.intern.description"),
    }
     
  ];

  return (
    <section
      id="education"
      className="px-6 py-42 bg-background overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <ScrollTimeline
            events={educationData}
            title={t("section.education")}
            progressIndicator={true}
            cardAlignment="right"
            connectorStyle="dot"
            cardEffect="shadow"
            revealAnimation="fade"
          />

          <ScrollTimeline
            events={experienceData}
            title={t("section.experience")}
            progressIndicator={true}
            cardAlignment="right"
            connectorStyle="dot"
            cardEffect="shadow"
            revealAnimation="fade"
          />
        </div>
      </div>
    </section>
  );
}
