import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import ExperienceEducation from "@/components/ExperienceEducation";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import ContactSection from "@/components/Contact/ContactSection";
import Footer from "@/components/Footer";
import SignalDivider from "@/components/SignalDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <SignalDivider />
        <About />
        <SignalDivider />
        <Skills />
        <SignalDivider />
        <ExperienceEducation />
        <SignalDivider />
        <ProjectsSection />
        <SignalDivider />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
