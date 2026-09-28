"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/project_card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Github,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const projectsData = [
  {
    key: "traho",
    title: "Traho Journal",
    description:
      "This application is designed to manage trade logging process. Traders often struggle to manage their records, such as entry reasons and daily updates. Especially when initial analyses shift due to dynamic market conditions. This app solves that problem by allowing users to append real-time analysis to their current holdings. It features a user-friendly interface with automated calculations, ensuring that all transaction history and notes are organized and easily accessible. Additionally, integrated charts provide clear data visualization, helping traders evaluate their trading performance",
    images: [
      "images/traho/traho().png",
      "/images/traho/traho(-1).png",
      "/images/traho/traho(1).png",
      "/images/traho/traho(2).png",
      "/images/traho/traho-2.png",
      "/images/traho/traho-3.png",
      "/images/traho/traho-4.png",
      "/images/traho/traho-5.png",
      "/images/traho/traho-6.png",
      "/images/traho/traho-7.png",
      "/images/traho/traho-8.png",
      "/images/traho/traho-9.png",
    ],
    tags: ["React", "Laravel", "Tailwind", "Shadcn", "MySQL", "RESTful API"],
    githubUrl: "https://github.com/Jonathanwjy/traho-journal",
    demoUrl: "",
  },

  {
    key: "barber",
    title: "Sixty BarberShop",
    description:
      "This project is a comprehensive web application for BarberShop, serving as both an engaging landing page and an integrated online booking platform. It was designed to streamline the reservation process for customers, eliminating manual scheduling conflicts, and to digitalize daily operations for the barbershop management.\n\nThe system features a seamless customer booking experience with dynamic time slots, real-time availability checking, and secure online payment integration via Midtrans. For administrators, it provides a robust dashboard to efficiently manage services, capsters (barbers), dynamic pricing, and monitor daily booking schedules. Built with a modern tech stack including Laravel, React (Inertia.js), and TypeScript, the application ensures a fast, interactive, and user-friendly experience with dynamic status updates and interactive confirmations",
    images: [
      "/images/sixty-barbershop/sixty-cover.png",
      "images/sixty-barbershop/sixty-1.png",
      "images/sixty-barbershop/sixty-2.png",
      "images/sixty-barbershop/sixty-3.png",
      "images/sixty-barbershop/sixty-4.png",
      "images/sixty-barbershop/sixty-5.png",
      "images/sixty-barbershop/sixty-6.png",
      "images/sixty-barbershop/sixty-7.png",
      "images/sixty-barbershop/sixty-8.png",
      "images/sixty-barbershop/sixty-9.png",
      "images/sixty-barbershop/sixty-10.png",
      "images/sixty-barbershop/sixty-11.png",
      "images/sixty-barbershop/sixty-12.png",
    ],
    tags: [
      "Inertia JS",
      "Tailwind CSS",
      "MySQL",
      "Authentication & Authorization",
      "Midtrans Payment",
    ],
    githubUrl: "https://github.com/Jonathanwjy/sixty-barbershop",
    demoUrl: "",
  },
  {
    key: "hris",
    title: "HRIS Management",
    description: "tes",
    images: [
      "images/hris/hris-1.png",
      "images/hris/hris-3.png",
      "images/hris/hris-2.png",
      "images/hris/hris-4.png",
      "images/hris/hris-5.png",
      "images/hris/hris-6.png",
      "images/hris/hris-7.png",
      "images/hris/hris-8.png",
      "images/hris/hris-9.png",
      "images/hris/hris-10.png",
      "images/hris/hris-11.png",
      "images/hris/hris-12.png",
    ],
    tags: [
      "Inertia JS",
      "Tailwind CSS",
      "TypeScript",
      "PostgreSQL",
      "Authentication & Authorization",
      "Mailtrap",
      "Jobs & Queue",
    ],
    githubUrl: "https://github.com/Jonathanwjy/hris-management",
    demoUrl: "",
  },
  {
    key: "pkbm",
    title: "Buku Induk Siswa Sekolah Bintang",
    description:
      "This project is a web-based information system designed to manage student master data for PKBM Sekolah Bintang, a non-formal education institution. The application was developed to replace manual record. The system allows administrators and staff to manage student profiles and academic records.\n\nThe system supports multi-role access (Super Admin, Admin, Staff). Key features include student data CRUD operations, academic score management, filtering and searching by academic year and package, and automatic generation of student reports in PDF and Word formats. The dashboard also provides statistical visualizations of student growth over time.",
    images: [
      "/images/pkbm/bks-tumbnail.png",
      "/images/pkbm/bks-1.png",
      "/images/pkbm/bks-2.png",
      "/images/pkbm/bks-3.png",
      "/images/pkbm/bks-4.png",
      "/images/pkbm/bks-5.png",
      "/images/pkbm/bks-6.png",
      "/images/pkbm/bks-7.png",
      "/images/pkbm/bks-8.png",
      "/images/pkbm/bks-9.png",
      "/images/pkbm/bks-10.png",
    ],
    tags: [
      "Laravel",
      "MySQL",
      "Tailwind CSS",
      "Authentication & Authorization",
    ],
    githubUrl: "https://github.com/Jonathanwjy/pkbm-sekolah-bintang",
    demoUrl: "",
  },
  {
    key: "wise",
    title: "Wise University Admission",
    description:
      "This application is a web-based Student Admission Management System designed to handle the complete new student enrollment process. When the application is first accessed, users are presented with a dashboard containing general information about the university, including announcements and admission updates. The system supports authentication with two roles: User (Applicant) and Admin.\n\nApplicants must register and login to begin the admission process. However, access to each stage is strictly controlled through an admin verification mechanism. Users are required to be verified by an admin before they apply to the university. Each stage, application submission, payment confirmation, and temporary student ID (KTM) must be reviewed and approved by an admin before the user can move forward. This sequential verification flow ensures data accuracy, prevents invalid submissions, and maintains administrative control.\n\nAdmins are responsible for user verification, registration approval, payment validation, and issuing temporary student cards. Additionally, the system provides a CRUD-based announcement management feature, allowing admins to create, update, and publish announcements dynamically.",
    images: [
      "/images/wise/wise-tumbnail.png",
      "/images/wise/wise-1.png",
      "/images/wise/wise-2.png",
      "/images/wise/wise-3.png",
      "/images/wise/wise-4.png",
      "/images/wise/wise-5.png",
      "/images/wise/wise-6.png",
      "/images/wise/wise-7.png",
      "/images/wise/wise-8.png",
      "/images/wise/wise-9.png",
      "/images/wise/wise-10.png",
      "/images/wise/wise-11.png",
    ],
    tags: [
      "Laravel",
      "MySQL",
      "Tailwind CSS",
      "Authentication & Authorization",
    ],
    githubUrl: "https://github.com/Jonathanwjy/wine-university",
    demoUrl: "",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
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

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ProjectsPage() {
  const { t } = useTranslation();

  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex((prev) =>
      prev === selectedProject.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedProject.images.length - 1 : prev - 1,
    );
  };

  return (
    <section
      id="projects"
      className="pt-48 pb-12 px-6 bg-background min-h-screen"
    >
      <div className="container max-w-6xl mx-auto">
        <motion.h1
          variants={titleVariants}
          className="text-4xl md:text-5xl font-bold tracking-tight text-primary"
        >
          Featured <span className="text-foreground">Projects</span>
        </motion.h1>

        <motion.div
          variants={titleVariants}
          className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
        >
          {projectsData.map((project, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="w-full h-full flex justify-center"
            >
              <ProjectCard
                project={{
                  ...project,
                  title: t(`projects.${project.key}.title`),
                  description: t(`projects.${project.key}.shortDesc`),
                }}
                onClick={() => handleOpenProject(project)}
              />
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedProject && (
            <Dialog
              open={!!selectedProject}
              onOpenChange={() => setSelectedProject(null)}
            >
              <DialogContent className="z-[9999] w-[90vw] md:w-[75vw] max-w-[90vw] md:max-w-[75vw] aspect-auto max-h-[90vh] rounded-[2.5rem] p-0 overflow-y-auto border-none bg-card shadow-2xl focus:outline-none scrollbar-hide">
                <motion.div
                  layoutId={`card-${selectedProject.title}`}
                  className="flex flex-col bg-card"
                >
                  <motion.div
                    layoutId={`image-${selectedProject.images}`}
                    className="relative w-full md:w-3/4 mx-auto h-[33vh] md:h-auto md:aspect-video group md:rounded-xl overflow-hidden md:mt-6"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={selectedProject.images[currentImageIndex]}
                        alt={selectedProject.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/800x600?text=No+Image";
                        }}
                      />
                    </AnimatePresence>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all hover:scale-110"
                    >
                      <X className="w-5 h-5" />
                    </Button>

                    {selectedProject.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 
                 bg-primary/10 text-primary 
                 hover:bg-primary hover:text-primary-foreground
                 rounded-full group-hover:opacity-100 
                 transition-all hover:scale-110 backdrop-blur-sm"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 
                 bg-primary/10 text-primary 
                 hover:bg-primary hover:text-primary-foreground
                 rounded-full group-hover:opacity-100 
                 transition-all hover:scale-110 backdrop-blur-sm"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {selectedProject.images.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === currentImageIndex
                                  ? "bg-white w-6"
                                  : "bg-white/50 w-1.5"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>

                  <div className="p-8 md:p-10 space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 font-medium"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <motion.h2
                        layoutId={`title-${selectedProject.title}`}
                        className="text-3xl md:text-4xl font-bold text-foreground"
                      >
                        {t(`projects.${selectedProject.key}.title`)}
                      </motion.h2>
                    </div>

                    <DialogDescription className="text-sm md:text-lg whitespace-pre-line text-muted-foreground leading-relaxed">
                      {t(`projects.${selectedProject.key}.description`)}
                    </DialogDescription>

                    <div className="flex flex-wrap gap-4 pt-4">
                      {selectedProject.githubUrl ? (
                        <Button
                          asChild
                          className="rounded-full bg-primary px-8 py-6 text-lg font-bold hover:brightness-110 transition-all"
                        >
                          <a
                            href={selectedProject.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Github className="mr-2 w-5 h-5" /> GitHub Repo
                          </a>
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="rounded-full bg-primary/20 px-8 py-6 text-lg font-bold cursor-not-allowed"
                          title="No GitHub link"
                        >
                          <Github className="mr-2 w-5 h-5" /> GitHub Repo
                        </Button>
                      )}

                      {selectedProject.demoUrl ? (
                        <Button
                          variant="outline"
                          asChild
                          className="rounded-full px-8 py-6 text-lg font-bold border-2 hover:bg-muted transition-all"
                        >
                          <a
                            href={selectedProject.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="mr-2 w-5 h-5" /> Live Demo
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          disabled
                          className="rounded-full px-8 py-6 text-lg font-bold border-2 cursor-not-allowed"
                          title="No demo available"
                        >
                          <ExternalLink className="mr-2 w-5 h-5" /> Live Demo
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
