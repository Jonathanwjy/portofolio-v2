import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Layout.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Layout.jsx";
import { HeroSection } from "./components/app/hero_section";
import AboutPage from "./components/app/about_me";
import { ExperienceEducation } from "./components/app/education_experience";
import ProjectsPage from "./components/app/project";
import TechStackPage from "./components/app/tech_stack";
import FooterContact from "./components/app/footer_contact";
import "./i18n";
import Certification from "./components/app/certification";
import SupabaseTest from "./components/app/test_supbase";
import AdminDashboard from "./components/admin/dashboard";

const Home = () => (
  <>
    <HeroSection />
    <AboutPage />
    <ExperienceEducation />
    <Certification />
    <TechStackPage />
    <ProjectsPage />
    <FooterContact />
    <SupabaseTest />
  </>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
        </Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
