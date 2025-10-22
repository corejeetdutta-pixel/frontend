import { useRef } from "react";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import WhyAtract from "../components/WhyAtract";
import ChoosePortal from "../components/ChoosePortal";

export default function Landing() {
  const portalRef = useRef(null);

  const scrollToPortal = () => {
    portalRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="flex flex-col">
      {/* Hero with scroll callback */}
      <Hero onPostRoleClick={scrollToPortal} />
      {/* ChoosePortal Section */}
      <div ref={portalRef}>
        <ChoosePortal />
      </div>

      {/* How it works section */}
      <HowItWorks />

      {/* Features Section */}
      <WhyAtract onGetStarted={scrollToPortal} />

      

      
    </main>
  );
}
