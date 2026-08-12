import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import ResumeDownloadButton from "./ResumeDownloadButton";
import { getSiteContent } from "@/lib/api";

export default async function ContactSection() {
  const content = await getSiteContent();

  return (
    <section id="contact" className="py-24 md:py-32">
      <Container className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something reliable."
            description="Tell me what you're working on — I'll get back to you within a day or two."
          />
          <ContactInfo email={content.email} whatsappUrl={content.whatsapp_url} />
          <div className="mt-8">
            <ResumeDownloadButton />
          </div>
        </div>

        <ContactForm />
      </Container>
    </section>
  );
}
