import Navigation from "../components/navigation";
import HeroSection from "../components/hero-section";
import TimelineSection from "../components/timeline-section";
import ProjectsSection from "../components/projects-section";
import SkillsSection from "../components/skills-section";
import EducationSection from "../components/education-section";
import ContactSection from "../components/contact-section";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-clinical-white">
      <Navigation />
      <HeroSection />
      <TimelineSection />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
