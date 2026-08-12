import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import ProjectGrid from "./ProjectGrid";
import { getProjects } from "@/lib/api";

export default async function ProjectsSection() {
  const projects = await getProjects();

  return (
    <section id="projects" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Projects"
          title="Selected work."
          description="Real systems built for real constraints — filter by stack, or open a project for the full story."
        />
        <ProjectGrid projects={projects} />
      </Container>
    </section>
  );
}
