import { Layout } from "@/components/Layout";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Support — Focus V Help Center",
  description: "Submit a support request to the Focus V team.",
  openGraph: {
    title: "Contact Focus V Support",
    description: "Submit a support request to the Focus V team.",
  },
};

export default function ContactPage() {
  return (
    <Layout>
      <ContactForm />
    </Layout>
  );
}
