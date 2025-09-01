import Header from "@/components/layout/Header"
import Hero from "@/components/sections/Hero"
import Features from "@/components/sections/Features"
import CTA from "@/components/sections/CTA"
import Footer from "@/components/layout/Footer"

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
